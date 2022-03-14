import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { MeetingData, MeetingDataPlus } from "../src/MeetingData";
import { UserData } from "../src/UserData";
import { MeetingHandler, UserHandler, UserJoin } from "./db";
import { cleanUserId } from "./utils";

/**
 * The main server code
 * @param db loki db class
 */
export function socketServer(
  server: Server,
  userHandler: UserHandler,
  meetingHandler: MeetingHandler
) {
  // create websocket server
  const io = new SocketIOServer(server, {
    // serveClient: false,
  });
  // enable admin ui on http://admin.socket.io/
  instrument(io, {
    auth: false,
  });

  /**
   * Event Format:
   * <collection>:<operation>:<?result>
   *
   * Collections:
   * - user
   * - meeting
   *
   * Operations:
   * - create
   * - get
   * - list
   *
   * Result:
   * An optional item which denotes the result of a performed operation
   */

  // when user connects via socket
  io.on("connection", (socket) => {
    console.log("a user connected");

    /**
     * Allows client to specify which room to join
     */
    socket.on("join", (id) => {
      // meetingHandler.join(id);

      socket.join(id);
    });

    /**
     * Allows client to specify which room to leave
     */
    socket.on("leave", (id: string) => {
      socket.leave(id);
    });

    /**
     * creates a meetings
     */
    socket.on("meeting:create", (meetingData: MeetingData) => {
      // create the meeting
      meetingHandler.create(meetingData);

      // send event that meeting has been created
      socket.emit("meeting:create:result", meetingData.id);
      // send same event to all in meetings room
      socket.in("meetings").emit("meeting:create:result", meetingData.id);
    });

    /**
     * Gets a specific meeting
     */
    socket.on("meeting:get", (id: string) => {
      const meeting = meetingHandler.get(id);

      // send result back
      socket.emit("meeting:get:result", meeting);
    });

    /**
     * Gets a specific meeting but people have names
     */
    socket.on("meeting:getPlus", (id: string) => {
      const meeting = meetingHandler.getPlus(id);

      // send result back
      socket.emit("meeting:getPlus:result", meeting);
    });

    /**
     * Gets all meetings
     */
    socket.on("meeting:list", () => {
      const meetings = meetingHandler.list();

      // send result back
      socket.emit("meeting:list:result", meetings);
    });

    /**
     * End a meeting
     */
    socket.on("meeting:end", (id) => {
      meetingHandler.end(id);

      // notify the client that the meeting has been ended
      socket.emit("meeting:end:result", id);
      // tell all in the meeting it has ended
      socket.broadcast.emit("meeting:end:result", id);
    });

    /**
     * Delete a meeting
     */
    socket.on("meeting:delete", (id) => {
      meetingHandler.delete(id);

      // send event that meeting has been deleted
      socket.emit("meeting:delete:result", id);
      // send same event to all
      socket.in("meetings").emit("meeting:delete:result", id);
    });

    /**
     * Has a user join a meeting
     */
    socket.on("meeting:user:join", (data: UserJoin) => {
      //Prevent duplicate users from being logged to meeting
      const meeting = meetingHandler.get(data.meeting);
      if (
        meeting &&
        meeting.participants.find((user) => user.id === data.user) !== undefined
      ) {
        console.log("User duplicate logged to meeting");
        return null;
      }
      // clean the user id to not have a bunch of muck
      const userId = cleanUserId(data.user);

      // save to db
      const user = meetingHandler.userJoin({
        meeting: data.meeting,
        user: userId,
      });

      // if user has a name
      if (user !== null) {
        // tell all
        socket.broadcast.emit("meeting:user:join:result", user.name);
        // send back to client
        socket.emit("meeting:user:join:result", user.name);
      } else {
        // if no name

        // tell all
        socket.broadcast.emit("meeting:user:join:result", userId);
        // send back to client
        socket.emit("meeting:user:join:result", userId);
      }
    });

    /**
     * Deletes a user
     */
    socket.on("user:delete", (user) => {
      userHandler.delete(user.id);

      // send event that meeting has been deleted
      socket.emit("user:delete:result", user.id);
      // tell all in users too
      socket.in("users").emit("user:delete:result", user.id);
    });

    /**
     * Creates a user
     */
    socket.on("user:create", (user: UserData) => {
      userHandler.create(user);

      // tell client user has been creates
      socket.emit("user:create:result", user.id);
      // tell all in users too
      socket.in("users").emit("user:create:result", user.id);
    });

    /**
     * Gets all users
     */
    socket.on("user:list", () => {
      const users = userHandler.list();

      // send result to client
      socket.emit("user:list:result", users);
    });

    /**
     * Gets a specific user
     */
    socket.on("user:get", (id: string) => {
      const user = userHandler.get(id);

      // send result to client
      socket.emit("user:get:result", user);
    });

    // client disconnected
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  // handle graceful exits
  process.on("SIGTERM", () => {
    // kill socket server
    io.close(() => {
      console.log("Shutdown next");
    });
  });
}

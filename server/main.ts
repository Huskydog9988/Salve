import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { MeetingHandler, StudentHandler } from "./db";
import { cleanUserId } from "./utils";
import { StudentJoin } from "../src/shared/studentJoin";
import { Meeting, Student } from "@prisma/client";
import { StudentCreate } from "../src/shared/studentCreate";
import { ParticipantHandler } from "./db/Participant";
import { MeetingCreateClient } from "../src/shared/meetingCreate";
import { EditUserName } from "../src/shared/editUser";

/**
 * The main server code
 * @param db loki db class
 */
export function socketServer(server: Server) {
  // create websocket server
  const io = new SocketIOServer(server, {
    // serveClient: false,
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
  });
  // enable admin ui on http://admin.socket.io/
  instrument(io, {
    auth: false,
  });

  const participantHandler = new ParticipantHandler();
  const studentHandler = new StudentHandler();
  const meetingHandler = new MeetingHandler(studentHandler, participantHandler);

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
    socket.on("join", (id: Meeting["id"]) => {
      // meetingHandler.join(id);

      socket.join(`${id}`);
    });

    /**
     * Allows client to specify which room to leave
     */
    socket.on("leave", (id: Meeting["id"]) => {
      socket.leave(`${id}`);
    });

    /**
     * creates a meetings
     */
    socket.on("meeting:create", async (meetingData: MeetingCreateClient) => {
      const time = new Date().toISOString();

      // create the meeting
      const result = await meetingHandler.create({
        ...meetingData,
        startTime: time,
      });

      // send event that meeting has been created
      socket.emit("meeting:create:result", result.id);
      // send same event to all in meetings room
      socket.in("meetings").emit("meeting:create:result", result.id);
    });

    /**
     * Gets a specific meeting
     */
    socket.on("meeting:get", async (id: Meeting["id"]) => {
      const meeting = await meetingHandler.get(id);

      // send result back
      socket.emit("meeting:get:result", meeting);
    });

    /**
     * Gets all meetings
     */
    socket.on("meeting:list", async () => {
      const meetings = await meetingHandler.list();

      // send result back
      socket.emit("meeting:list:result", meetings);
    });

    /**
     * End a meeting
     */
    socket.on("meeting:end", async (id: Meeting["id"]) => {
      await meetingHandler.end(id);

      // notify the client that the meeting has been ended
      socket.emit("meeting:end:result", id);
      // tell all in the meeting it has ended
      socket.broadcast.emit("meeting:end:result", id);
    });

    /**
     * Delete a meeting
     */
    socket.on("meeting:delete", async (id: Meeting["id"]) => {
      // console.log(`Requested a delete (server) of ${id}`);
      await meetingHandler.delete(id);

      // send event that meeting has been deleted
      socket.emit("meeting:delete:result", id);
      // send same event to all
      socket.in("meetings").emit("meeting:delete:result", id);
    });

    /**
     * Has a user join a meeting
     */
    socket.on("meeting:user:join", async (data: StudentJoin) => {
      //Prevent duplicate users from being logged to meeting
      const meeting = await meetingHandler.get(data.meeting);

      if (meeting && undefined !== undefined) {
        console.log("User duplicate logged to meeting");
        return null;
      }
      // clean the user id to not have a bunch of muck
      const userId = cleanUserId(data.user);

      // save to db
      const name = await meetingHandler.userJoin({
        meeting: data.meeting,
        user: userId,
      });

      // if user has a name
      if (name !== null && name !== undefined) {
        // tell all
        socket.broadcast.emit("meeting:user:join:result", name);
        // send back to client
        socket.emit("meeting:user:join:result", name);
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
    socket.on("user:delete", async (id: Student["id"]) => {
      await studentHandler.delete(id);

      // send event that meeting has been deleted
      socket.emit("user:delete:result", id);
      // tell all in users too
      socket.in("users").emit("user:delete:result", id);
    });

    /**
     * Edits a user
     */
    socket.on("user:edit", async (data: EditUserName) => {
      await studentHandler.edit(data);

      // send event that meeting has been deleted
      socket.emit("user:edit:result", data.id);
      // tell all in users too
      socket.in("users").emit("user:edit:result", data.id);
    });

    /**
     * Creates a user
     */
    socket.on("user:create", async (user: StudentCreate) => {
      await studentHandler.create(user);

      // tell client user has been creates
      socket.emit("user:create:result", user.id);
      // tell all in users too
      socket.in("users").emit("user:create:result", user.id);
    });

    /**
     * Gets all users
     */
    socket.on("user:list", async () => {
      const users = await studentHandler.list();

      // send result to client
      socket.emit("user:list:result", users);
    });

    /**
     * Gets a specific user
     */
    socket.on("user:get", async (id: Student["id"]) => {
      const user = await studentHandler.get(id);

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

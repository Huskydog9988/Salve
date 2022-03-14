import { createServer } from "http";
import { parse } from "url";
import next from "next";
// import loki from "lokijs";
import { db, MeetingHandler, UserHandler } from "./db";
import { socketServer } from "./main";
import { resError, resResult } from "./utils/responses";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const meetingHandler = new MeetingHandler(db);
  const userHandler = new UserHandler(db);

  // create next server
  const server = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url!, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/api/users") {
        // if specified user
        if (typeof query.user === "string") {
          // get user
          const result = userHandler.get(query.user);

          // if found user
          if (result !== null) {
            // send result
            resResult(res, result);
          } else {
            // else just error
            resError(res, "Failed to fetch user", 404);
          }
        } else {
          // if no user specified

          // get all users
          const result = userHandler.list();

          // send result
          resResult(res, result);
        }
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // have server listen on port
  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });

  // run the socket server
  socketServer(server, userHandler, meetingHandler);
});

// handle graceful exits
process.on("SIGTERM", () => {
  // kill next
  app.close().then(() => {
    console.log("Shutdown next");
  });

  // kill db
  db.close(() => {
    console.log("Shutdown Lokijs db");
  });
});

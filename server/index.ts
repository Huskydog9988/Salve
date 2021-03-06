import { createServer } from "http";
import { parse } from "url";
import next from "next";
// import loki from "lokijs";
import { socketServer } from "./main";
import { prisma } from "./db";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // create next server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    // have next handle routing
    handle(req, res, parsedUrl);
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
  socketServer(server);
});

// handle graceful exits
process.on("SIGTERM", () => {
  // kill next
  app.close().then(() => {
    console.log("Shutdown next");
  });

  // kill db
  prisma.$disconnect().then(() => {
    console.log("Shutdown prisma");
  });
});

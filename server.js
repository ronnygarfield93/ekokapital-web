const fs = require("node:fs");
const path = require("node:path");
const { createServer } = require("node:http");
const next = require("next");

// Ensure persistent data & uploads directories exist in project root
fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, () => {
      console.log(
        `> Ekokapital Web listening on port ${port} (${dev ? "development" : "production"})`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js server:", err);
    process.exit(1);
  });

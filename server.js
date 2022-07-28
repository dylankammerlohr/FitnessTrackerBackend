const http = require("http")
const chalk = require("chalk")
const app = require("./app")

const PORT = process.env["PORT"] ?? 3000
const server = http.createServer(app)
// app.get("/api", function (req, res, next) {
//   res.json({ msg: "This is CORS-enabled for all origins!" });
// });

server.listen(PORT,  ()=> {
  console.log(
    chalk.blueBright("Server is listening on PORT:"),
    chalk.yellow(PORT),
    chalk.blueBright("Get your routine on!"));
});

// server.listen(PORT, () => {
//   console.log(
//     chalk.blueBright("Server is listening on PORT:"),
//     chalk.yellow(PORT),
//     chalk.blueBright("Get your routine on!")
//   )
// })

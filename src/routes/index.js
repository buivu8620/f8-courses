const newsRouter = require("./news");
const meRouter = require("./me");
const siteRouter = require("./site");
const courseRouter = require("./course");
const chapterRouter = require("./chapter");
function route(app) {
  app.use("/news", newsRouter);
  app.use("/chapter", chapterRouter);
  app.use("/me", meRouter);
  app.use("/course", courseRouter);
  app.use("/", siteRouter);
}
module.exports = route;

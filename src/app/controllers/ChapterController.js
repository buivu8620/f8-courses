const Chapter = require("../models/Chapter");
// const Course = require("../models/Course");
const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../../util/mongoose");
const Course = require("../models/Course");
class ChapterController {
  //[DELETE] /chapter/:id
  async delete(req, res) {
    const chapter = await Chapter.findById(req.params.id);
    await chapter.remove();
    res.redirect("back");
  }
  async edit(req, res) {
    const chapter = await Chapter.findById(req.params.id);
    res.render("chapter/edit", { chapter: mongooseToObject(chapter) });
  }
  async update(req, res) {
    const chapter = await Chapter.findById(req.params.id);
    const courseId = chapter.ownerByCourse;
    Chapter.updateOne({ _id: req.params.id }, req.body).then(() => {
      res.redirect(`/course/${courseId}/viewchapter`);
    });
  }

  //[POST] /chapter/:id/storecontent
  // async storeContent(req, res) {
  //   const content = new Content({ ...req.body, ownerByChapter: req.params.id });
  //   await content.save();
  //   res.send(content);
  // }
}

module.exports = new ChapterController();

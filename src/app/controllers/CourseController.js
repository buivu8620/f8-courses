const Course = require("../models/Course");
const User = require("../models/User");
const Chapter = require("../models/Chapter");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../util/mongoose");
const { redirect } = require("express/lib/response");

class CourseController {
  //[GET] /course/show
  async show(req, res, next) {
    try {
      const course = await Course.findOne({ slug: req.params.slug });
      const chapter = await Chapter.findOne({ ownerByCourse: course._id });
      await course.populate({ path: "chapters" });
      const user = await User.findById(course.owner);
      const results = course.result.split("\n");
      let require;
      let resultsLeft;
      if (course.require) {
        require = course.require.split("\n");
      } else {
        require = null;
      }
      if (results.length >= 10) {
        resultsLeft = results.splice(0, Math.ceil(results.length / 2));
      } else {
        resultsLeft = null;
      }
      // console.log(chapter.contents);

      res.render("courses/show", {
        course: mongooseToObject(course),
        user: mongooseToObject(user),
        results: results,
        require: require,
        resultsLeft: resultsLeft,
        chapters: multipleMongooseToObject(course.chapters),
      });
    } catch (e) {}
  }

  //[GET] /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }

  //[POST] /course/store
  async store(req, res, next) {
    // res.json(req.body);

    const course = new Course({
      ...req.body,
      owner: req.user._id,
    });

    try {
      await course.save();
      res.redirect("/me/stored/courses");
    } catch (e) {
      res.status(400).send(e);
    }
  }

  //[GET] /course/:id/edit
  async edit(req, res, next) {
    const course = await Course.findById(req.params.id);

    res.render("courses/edit", { course: mongooseToObject(course) });
  }

  //[POST] /course/:id/update
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }
  //[DELETE] /course/:id/delete
  async delete(req, res, next) {
    const course = await Course.findById(req.params.id);
    await course.remove();
    res.redirect("back");
  }

  //[get] /course/:id/addchapter
  async addChapter(req, res) {
    res.render("chapter/create", { courseId: req.params.id });
  }

  //[POST] /course/:id/storechapter
  async storeChapter(req, res) {
    const chaptersByCourse = await Chapter.find({
      ownerByCourse: req.params.id,
    });
    const chapter = new Chapter({
      ...req.body,
      ownerByCourse: req.params.id,
    });
    // console.log(chaptersByCourse);
    if (chaptersByCourse) {
      let isExist = false;
      for (const chapter of chaptersByCourse) {
        if (req.body.number == chapter.number) {
          isExist = true;
        }
      }
      if (isExist) {
        res.send("Exists");
      } else {
        await chapter.save();
        res.redirect("/me/stored/courses");
      }
    } else {
      await chapter.save();
      res.redirect("/me/stored/courses");
    }
  }

  //[GET] course/:id/viewchapter
  async viewChapter(req, res) {
    const idCourse = req.params.id;
    const course = await Course.findById(idCourse);

    await course.populate({
      path: "chapters",
    });
    res.render("chapter/view", {
      chapters: multipleMongooseToObject(course.chapters),
      course: mongooseToObject(course),
    });
  }
}

module.exports = new CourseController();

const Course = require("../models/Course");
const { multipleMongooseToObject } = require("../../util/mongoose");
const User = require("../models/User");
class SiteController {
  //[GET] home
  async index(req, res, next) {
    const courses = await Course.find({});

    res.render("sites/home", {
      courses: multipleMongooseToObject(courses),
      isHome: true,
    });
  }

  //[GET] search
  search(req, res) {
    res.render("courses/search");
  }

  //[POST] /Sign up
  async signUp(req, res) {
    res.render("sites/signup");
  }

  //[GET] /login

  async login(req, res) {
    res.render("sites/login");
  }
}

module.exports = new SiteController();

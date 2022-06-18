const Course = require("../models/Course");
const User = require("../models/User");
const multer = require("multer");
const sharp = require("sharp");
const {
  multipleMongooseToObject,
  mongooseToObject,
} = require("../../util/mongoose");
const { renderSync } = require("node-sass");

class MeController {
  //[GET] /me/stored/courses
  async storedCourses(req, res, next) {
    try {
      await req.user.populate({ path: "courses" });
      res.render("me/stored-courses", {
        courses: multipleMongooseToObject(req.user.courses),
      });
    } catch (e) {
      res.status(400);
    }
  }

  //[GET] /me/profile

  async profile(req, res) {
    const user = req.user;
    await user.populate({ path: "courses" });
    const countCourses = user.courses.length;
    const joined = new Date(`${user.createdAt}`);

    const joinedTime = `${joined.getDate()} - ${
      joined.getMonth() + 1
    } - ${joined.getFullYear()}`;
    let b64;
    if (user.avatar) {
      b64 = new Buffer(user.avatar).toString("base64");
    } else {
      b64 = null;
    }
    res.render("me/profile", {
      user: mongooseToObject(user),
      countCourses,
      joinedTime,
      b64,
    });

    // res.send(user);
  }

  //[GET] /me/edit
  async edit(req, res) {
    const user = req.user;

    res.render("me/edit", { user: mongooseToObject(user) });
  }

  //[PATCH] /me/save-edit
  async saveEdit(req, res) {
    try {
      const buffer = await sharp(req.file.buffer).png().toBuffer();
      // console.log(req.file);
      await User.updateOne(
        { _id: req.user._id },
        { name: req.body.name, avatar: buffer, introduce: req.body.introduce }
      );
      res.redirect("/me/profile");
    } catch (e) {}
  }

  //[POST] /me/signup
  async signUp(req, res) {
    const user = new User(req.body);
    try {
      await user.save();
      res.render("error", { err: "Sign up success" });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }

  //[POST] me/login
  async login(req, res) {
    try {
      const user = await User.finByCredentials(
        req.body.email,
        req.body.password
      );
      // console.log(user);

      if (!user) {
        res.status(404).send();
      } else {
        const token = await user.generateAuthToken();
        console.log(user.name);
        res.cookie("token", token);
        res.cookie("username", user.name);
        res.redirect("/");
      }
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }

  //[GET] me/logout
  async logout(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token;
      });
      res.clearCookie("token");
      res.clearCookie("username");
      await req.user.save();
      res.redirect("/");
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //[GET] me/logoutall
  async logoutAll(req, res) {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.clearCookie("token");
      res.clearCookie("username");
      res.redirect("/");
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //[POST] me/upload-avatar
  async uploadAvatar(req, res) {
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.send(req.user);
  }

  //[Get] me/viewavatar
  async viewAvatar(req, res) {
    const user = await User.findById(req.user._id);
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  }
}

module.exports = new MeController();

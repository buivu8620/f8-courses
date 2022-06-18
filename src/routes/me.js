const express = require("express");
const router = express.Router();
const auth = require("../app/middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const meController = require("../app/controllers/MeController");

//upload avatar
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    filesize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Invalid file name"));
    } else {
      cb(undefined, true);
    }
  },
});

router.post("/login", meController.login);
router.post("/signup", meController.signUp);
router.get("/stored/courses", auth, meController.storedCourses);
router.get("/logout", auth, meController.logout);
router.get("/logoutall", auth, meController.logoutAll);
router.get("/profile", auth, meController.profile);
router.get("/edit", auth, meController.edit);
router.put(
  "/save-edit",
  auth,
  upload.single("avatar"),
  meController.saveEdit,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.post(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  meController.uploadAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/view-avatar", auth, meController.viewAvatar);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../app/middleware/auth");
const courseController = require("../app/controllers/CourseController");

router.get("/create", auth, courseController.create);
router.get("/:slug", courseController.show);
router.post("/store", auth, courseController.store);
router.get("/:id/addchapter", auth, courseController.addChapter);
router.post("/:id/storechapter", auth, courseController.storeChapter);
router.get("/:id/viewchapter", auth, courseController.viewChapter);
router.get("/:id/edit", auth, courseController.edit);
router.delete("/:id", auth, courseController.delete);
router.put("/:id", auth, courseController.update);

module.exports = router;

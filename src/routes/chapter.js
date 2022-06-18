const express = require("express");
const router = express.Router();

const ChapterController = require("../app/controllers/ChapterController");

// router.post("/:id/storecontent", ChapterController.storeContent);
router.get("/:id/edit", ChapterController.edit);
router.delete("/:id", ChapterController.delete);
router.put("/:id", ChapterController.update);

module.exports = router;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChapterSchema = new Schema(
  {
    number: {
      type: "number",
      required: true,
    },
    title: {
      type: "string",
      required: true,
    },
    ownerByCourse: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

ChapterSchema.virtual("contents", {
  ref: "Content",
  localField: "_id",
  foreignField: "ownerByChapter",
});

const Chapter = mongoose.model("Chapter", ChapterSchema, "Chapters");
module.exports = Chapter;

const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const CourseSchema = new Schema(
  {
    name: { type: String, maxlength: 255 },
    description: { type: String, maxlength: 600 },
    result: { type: String },
    require: { type: String },
    youtubeId: { type: String },
    slug: { type: String, slug: "name", unique: true },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

CourseSchema.virtual("chapters", {
  ref: "Chapter",
  localField: "_id",
  foreignField: "ownerByCourse",
});

const Chapter = require("./Chapter");
CourseSchema.pre("remove", async function (next) {
  const course = this;

  await Chapter.deleteMany({ ownerByCourse: course._id });
  next();
});

const Course = mongoose.model("Course", CourseSchema, "Courses");
module.exports = Course;

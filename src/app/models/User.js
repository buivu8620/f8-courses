const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: "string", required: true },
    introduce: { type: "string" },
    email: {
      type: "string",
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: { type: "string", required: true, trim: true },
    image: { type: "string" },
    tokens: [
      {
        token: { type: "string", required: true },
      },
    ],
    avatar: { type: Buffer },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "mynameisvu");

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

UserSchema.statics.finByCredentials = async function (email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email");
  } else {
    if (user.password === password) {
      return user;
    } else {
      throw new Error("Invalid password");
    }
  }
  // return user;
};

const User = mongoose.model("User", UserSchema, "Users");
module.exports = User;

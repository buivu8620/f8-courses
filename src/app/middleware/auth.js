const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "mynameisvu");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(400).render("error", { err: "please authenticate" });
  }
};

module.exports = auth;

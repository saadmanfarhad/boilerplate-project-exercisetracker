const mongoose = require("mongoose");
const User = mongoose.model("users");
const Exercise = mongoose.model("exercises");

module.exports = (app) => {
  app.post("/api/users", async (req, res) => {
    const { username } = req.body;
    console.log(username);

    const newUser = new User({
      username,
    });

    try {
      const user = await newUser.save();
      console.log(user);
      res.send({ username: user.username, _id: user._id });
    } catch (e) {
      if (e.code === 11000) {
        res
          .status(422)
          .send({ status: false, message: "Username already exists" });
      }
    }
  });
};

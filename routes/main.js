const mongoose = require("mongoose");
const User = mongoose.model("users");
const Exercise = mongoose.model("exercises");

module.exports = (app) => {
  app.get("/api/users", async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (e) {
      res.status(422).send({ status: false, message: e });
    }
  });

  app.post("/api/users", async (req, res) => {
    const { username } = req.body;

    const newUser = new User({
      username,
    });

    try {
      const user = await newUser.save();
      res.send({ username: user.username, _id: user._id });
    } catch (e) {
      if (e.code === 11000) {
        res
          .status(422)
          .send({ status: false, message: "Username already exists" });
      }
    }
  });

  app.post("/api/users/:_id/exercises", async (req, res) => {
    const { id, description, duration, date } = req.body;

    if (id && description && duration) {
      const newExercise = new Exercise({
        user: id,
        description,
        duration,
        date: date ? date : new Date(),
      });

      try {
        const exercise = await newExercise.save();
        const user = await User.findOne({ _id: exercise.user });

        res.send({
          _id: user._id,
          username: user.username,
          duration: exercise.duration,
          description: exercise.description,
          date: exercise.date.toDateString(),
        });
      } catch (e) {
        res.status(422).send({ status: false, message: e });
      }
    }
  });

  app.get("/api/users/:_id/logs", async (req, res) => {
    const { _id } = req.params;
    const { limit, to, from } = req.query;
    const user = await User.findOne({ _id: _id });

    const query =
      to && from
        ? {
            user: _id,
            date: { $gte: from, $lte: to },
          }
        : { user: _id };

    const exercises = await Exercise.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    const logs = exercises.map((exercise) => {
      return {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
      };
    });

    res.send({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: logs,
    });
  });
};

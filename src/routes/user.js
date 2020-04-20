import express from "express";
import _database from "../models";

const router = express.Router();
const User = _database.User;
const Lesson = _database.Lesson;

router.post("/", async (req, res) => {
  const userInformation = req.body;
  const userLessons = userInformation.lessons;
  let lessonTags = [];
  let transaction;

  try {
    transaction = await _database.sequelize.transaction();

    const newUser = await User.create(userInformation);

    for (let i = 0; i < userLessons.length; i++) {
      let lesson = userLessons[i];
      const [lessonTag, created] = await Lesson.findOrCreate({
        where: {
          name: lesson
        },
        defaults: {
          name: lesson
        },
        transaction
      });
      lessonTags.push(lessonTag);
    }

    if (lessonTags) {
      await newUser.setLessons(lessonTags, { transaction });
    }

    transaction.commit();

    res.status(200).send({ message: "User successfully created" });
  } catch (err) {
    transaction.rollback();

    if (err.name == "SequelizeValidationError") {
      res.status(400).send({ error: err.message });
    } else {
      console.log("Error " + err.stack);
      res.status(500).end();
    }
  }
});

router.get("/:email", async (req, res) => {
  const userEmail = req.params.email;
  try {
    let user = await User.findOne({
      where: {
        email: userEmail
      },
      attributes: [
        "email",
        "role",
        "displayName",
        "photoURL",
        "phoneNumber",
        "gender"
      ],
      include: {
        model: Lesson
      }
    });

    if (!user) throw new Error("User not found");

    const userLessons = user.Lessons.map(lessonObject => {
      return lessonObject.name;
    });
    let returnedUser = user.toJSON();
    delete returnedUser.Lessons;
    returnedUser.lessons = userLessons;

    res.send(returnedUser);
  } catch (err) {
    if (err.message == "User not found") {
      res.status(404).send({ error: err.message });
    } else {
      console.log(err.stack);
      res.status(500).end();
    }
  }
});

router.put("/:email", async (req, res) => {
  const userEmail = req.params.email;
  const userUpdatedInformation = req.body;
  let transaction;

  try {
    transaction = await _database.sequelize.transaction();
    let userToUpdate = await User.findOne({
      where: { email: userEmail },
      transaction
    });

    await userToUpdate.update(userUpdatedInformation, { transaction });
    await transaction.commit();

    res.send({ message: "Successfully updated" });
  } catch (err) {
    await transaction.rollback();

    if (err instanceof TypeError) {
      return res.status(404).json({ error: "User not found" });
    } else {
      console.log(err.stack);
      res.status(500).end();
    }
  }
});

export default router;

import express from "express";
import _database from "../models";

const router = express.Router();
const Event = _database.Event;

router.post("/", async (req, res) => {
  const eventInformation = req.body;
  let transaction;

  try {
    transaction = await _database.sequelize.transaction();

    const user = await _database.User.findByPk(eventInformation.email, {
      transaction
    });
    const newEvent = await Event.create(eventInformation, { transaction });
    await user.addEvent(newEvent, { transaction });

    transaction.commit();

    res.send({ message: "Event successfully created" });
  } catch (err) {
    transaction.rollback();

    if (err.name == "TypeError") {
      return res.status(404).send({ error: "User not found" });
    } else if (err.name == "SequelizeValidationError") {
      res.status(400).send({ error: err.message });
    } else {
      console.log("Error " + err.stack);
      res.status(500).end();
    }
  }
});

export default router;

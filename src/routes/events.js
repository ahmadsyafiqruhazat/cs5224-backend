import express from "express";
import _database from "../models";

const router = express.Router();
const Event = _database.Event;

router.post("/", async (req, res) => {
  let eventInformation = req.body;
  let transaction;

  try {
    transaction = await _database.sequelize.transaction();

    let user = await _database.User.findByPk(eventInformation.email, {
      transaction
    });
    let newEvent = await Event.create(eventInformation, { transaction });
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

// Get all events
router.get("/", async (req, res) => {
  let userEmail = req.query.email;
  let eventId = req.query.eventId;
  let events;
  try {
    if (eventId) {
      events = await Event.findByPk(eventId, {
        attributes: ["id", "title", "startDate", "endDate"]
      });
    } else if (userEmail) {
      events = await Event.findAll({
        where: { UserEmail: userEmail },
        attributes: ["id", "title", "startDate", "endDate"]
      });
    } else {
      events = await Event.findAll({
        attributes: ["id", "title", "startDate", "endDate"]
      });
    }
    res.send(events);
  } catch (err) {
    console.log("Error " + err.stack);
    res.status(500).end();
  }
});

router.put("/:eventId", async (req, res) => {
  let eventId = req.params.eventId;
  let newEventInfo = req.body;
  let transaction;

  try {
    transaction = await _database.sequelize.transaction();
    let eventToUpdate = await Event.findByPk(eventId, { transaction });

    await eventToUpdate.update(newEventInfo, { transaction });
    await transaction.commit();

    await eventToUpdate.reload();
    res.send({
      id: eventToUpdate.id,
      title: eventToUpdate.title,
      startDate: eventToUpdate.startDate,
      endDate: eventToUpdate.endDate
    });
  } catch (err) {
    transaction.rollback();

    if (err.name == "TypeError") {
      res.status(404).send({ error: "Event Id not found" });
    } else {
      console.log(err.stack);
      res.status(500).end();
    }
  }
});

export default router;

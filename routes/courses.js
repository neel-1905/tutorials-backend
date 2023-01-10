const express = require("express");
const router = express.Router();
const verify = require("../middleware/verify");
const { connection } = require("../connection");
const { ObjectId } = require("mongodb");

router.get("/all", verify, async (req, res) => {
  const { db } = await connection();

  const courseExists = await db.collection("courses").find({}).toArray();

  if (!courseExists.length) {
    return res.json({ message: "No courses found", isSuccess: false });
  }

  return res.json({ message: "Courses found", courseExists, isSuccess: true });
});

router.post("/addCourse", verify, async (req, res) => {
  const { db } = await connection();

  const { name, price, duration, description } = req.body;

  if (!name || !price || !duration || !description) {
    return res.json({
      message: "Please fill all the details",
      isSuccess: false,
    });
  }

  const courseExists = await db.collection("courses").findOne({ name });

  if (courseExists) {
    return res.json({ message: "Course already exists", isSuccess: false });
  }

  await db
    .collection("courses")
    .insertOne({ name, price, duration, description });

  return res.json({ message: "Course Added Successfully", isSuccess: true });
});

router.get("/getOne/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;

  const courseExists = await db
    .collection("courses")
    .findOne({ _id: ObjectId(id) });

  if (!courseExists) {
    return res.json({ message: "Course not found", isSuccess: false });
  }

  return res.json({ message: "Course Found", courseExists, isSuccess: true });
});

router.put("/editCourse/:id", verify, async (req, res) => {
  const { db } = await connection();
  const { name, price, duration, description } = req.body;
  const id = req.params.id;

  if (!name || !price || !duration || !description) {
    return res.json({
      message: "Please fill all the details",
      isSuccess: false,
    });
  }

  const courseExists = await db
    .collection("courses")
    .findOne({ _id: ObjectId(id) });

  if (!courseExists) {
    return res.json({ message: "Course not found", isSuccess: false });
  }

  await db
    .collection("courses")
    .updateOne(
      { _id: ObjectId(id) },
      { $set: { name, price, duration, description } }
    );

  return res.json({ message: "Course updated Successfully", isSuccess: true });
});

router.delete("/deleteCourse/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;

  const courseExists = await db
    .collection("courses")
    .findOne({ _id: ObjectId(id) });

  if (!courseExists) {
    return res.json({ message: "Course not found", isSuccess: false });
  }

  await db.collection("courses").deleteOne({ _id: ObjectId(id) });

  return res.json({ message: "Course deleted", isSuccess: true });
});

module.exports = router;

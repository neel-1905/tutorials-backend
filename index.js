const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const userRoute = require("./routes/users");
const courseRoute = require("./routes/courses");
const cors = require("cors");
const { connection } = require("./connection");

app.use(cors());
app.use(express.json());

app.use("/users", userRoute);
app.use("/courses", courseRoute);

app.listen(PORT, async (req, res) => {
  const { db } = await connection();

  const coll = await db.listCollections().toArray();
  if (coll.length) {
    console.log(`App running on Port - ${PORT}`);
  }
});

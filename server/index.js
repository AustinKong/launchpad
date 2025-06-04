const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello from server!",
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

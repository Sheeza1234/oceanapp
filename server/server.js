const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Paddle Cleanup API!");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

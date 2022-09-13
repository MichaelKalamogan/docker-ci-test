const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const pgClient = require("./postgres");
const keys = require("./keys");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// redis

const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get("/", (req, res) => {
  res.send("hi working");
});

app.get("/values/all", async (req, res) => {
  const values = pgClient.query("SELECT * from values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hGetAll("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 50) return res.status(422).send("index too large");

  redisClient.hSet("values", index, "Not calculated yet");
  redisPublisher.publish("insert", index);

  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ calculating: true });
});

app.listen(6000, (err) => {
  console.log("listening at port 6000");
});

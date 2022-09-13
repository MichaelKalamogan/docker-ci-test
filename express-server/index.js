const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");

const pgClient = require("./postgres");
const keys = require("./keys");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// redis

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: "redis://redis:6379",
    retry_strategy: () => 1000,
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get("/", (req, res) => {
  res.send("hi working");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hGetAll("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  console.log(index);
  if (parseInt(index) > 50) return res.status(422).send("index too large");

  await redisClient.HSET("values", index, "Not calculated yet");
  // await redisPublisher.publish("insert", index);

  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ calculating: true });
});

app.listen(6000, (err) => {
  console.log("listening at port 6000");
});

import express from "express";
import cors from "cors";
import { CtoF, getData, getWetBulbTemperature } from "./utils";

const app = express();
app.use(cors({ origin: ["http://127.0.0.1:5500"] }));
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/wbt", async (req, res) => {
  try {
    const temperature = await getWetBulbTemperature();
    res.send(`${CtoF(temperature).toFixed(2)}°F`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/temperature", async (req, res) => {
  try {
    const { temperature_2m } = await getData();
    res.send(`${CtoF(temperature_2m).toFixed(2)}°F`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/humidity", async (req, res) => {
  try {
    const { relative_humidity_2m } = await getData();
    res.send(`${relative_humidity_2m.toFixed(0)}%`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

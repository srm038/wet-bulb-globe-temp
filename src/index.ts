import express from "express";
import cors from "cors";
import { CtoF, getWetBulbTemperature } from "./utils";

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

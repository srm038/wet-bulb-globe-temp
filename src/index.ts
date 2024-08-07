import express from "express";
import cors from "cors";
import { getTemperature } from "./utils";

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

app.get("/temperature", async (req, res) => {
  try {
    console.log(req.params)
    const temperature = await getTemperature();
    res.send(`${temperature}&deg;F`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

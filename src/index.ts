import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/temperature", async (req, res) => {
  try {
    const location = req.query.location; // Assuming the location is passed as a query parameter

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m&temperature_unit=fahrenheit`
    );
    const temperature = response.data.current.temperature_2m;

    res.send(temperature);
  } catch (error) {
    console.error("Error fetching temperature:", error);
    res.status(500).send("Failed to fetch temperature");
  }
});

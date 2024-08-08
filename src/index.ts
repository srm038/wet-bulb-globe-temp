import express from "express";
import path from "path";
import { handleHumidity, handleTemperature, handleWBGT } from "./handler";

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/wbgt", async (req, res) => {
  try {
    if (
      !req.query.latitude ||
      !req.query.longitude ||
      req.query.latitude === "" ||
      req.query.longitude === ""
    ) {
      throw new Error("Location is required");
    }
    const response = await handleWBGT({
      latitude: +req.query.latitude,
      longitude: +req.query.longitude,
    });
    res.send(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.get("/temperature", async (req, res) => {
  try {
    if (
      !req.query.latitude ||
      !req.query.longitude ||
      req.query.latitude === "" ||
      req.query.longitude === ""
    ) {
      throw new Error("Location is required");
    }
    const response = await handleTemperature({
      latitude: +req.query.latitude,
      longitude: +req.query.longitude,
    });
    res.send(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.get("/humidity", async (req, res) => {
  try {
    if (
      !req.query.latitude ||
      !req.query.longitude ||
      req.query.latitude === "" ||
      req.query.longitude === ""
    ) {
      throw new Error("Location is required");
    }
    const response = await handleHumidity({
      latitude: +req.query.latitude,
      longitude: +req.query.longitude,
    });
    res.send(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

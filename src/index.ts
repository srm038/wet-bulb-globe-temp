import express from "express";
import cors from "cors";
import {
  CtoF,
  getCategory,
  getData,
  getWetBulbGlobeTemperature,
  getWetBulbTemperature,
  type LatLong,
} from "./utils";

const html = String.raw;

const app = express();
app.use(cors({ origin: ["http://127.0.0.1:5500", "null"] }));
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
    if (!req.query.latitude || !req.query.longitude) {
      throw new Error("Location is required");
    }
    const location: LatLong = {
      latitude: +req.query.latitude,
      longitude: +req.query.longitude,
    };
    const temperature = await getWetBulbTemperature(location);
    const category = getCategory(temperature);
    res.send(
      html`<div
        hx-get="http://localhost:3000/wbt"
        hx-trigger="location-updated from:body"
        hx-include="#latitude, #longitude"
        hx-swap="outerHTML"
        id="wbt"
        class="cat${category}"
      >
        ${CtoF(temperature).toFixed(2)}&deg;F
      </div>`.toString()
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/wbgt", async (req, res) => {
    try {
      if (!req.query.latitude || !req.query.longitude) {
        throw new Error("Location is required");
      }
      const location: LatLong = {
        latitude: +req.query.latitude,
        longitude: +req.query.longitude,
      };
      const temperature = await getWetBulbGlobeTemperature(location);
      const category = getCategory(CtoF(temperature));
      res.send(
        html`<div
          hx-get="http://localhost:3000/wbgt"
          hx-trigger="location-updated from:body"
          hx-include="#latitude, #longitude"
          hx-swap="outerHTML"
          id="wbgt"
          class="cat${category}"
        >
          ${CtoF(temperature).toFixed(2)}&deg;F
        </div>`.toString()
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
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
    const location: LatLong = {
      latitude: +req.query.latitude,
      longitude: +req.query.longitude,
    };
    const { Ta } = await getData(location);
    res.send(`${CtoF(Ta).toFixed(2)}&deg;F`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/humidity", async (req, res) => {
  try {
    if (!req.query.latitude || !req.query.longitude) {
      throw new Error("Location is required");
    }
    const location: LatLong = {
      latitude: +req.query.latitude,
      longitude: +req.query.longitude,
    };
    const { RH } = await getData(location);
    res.send(`${RH.toFixed(0)}%`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

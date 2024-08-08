import express from "express";
import {
  CtoF,
  getCategory,
  getData,
  getWetBulbGlobeTemperature,
  getWetBulbTemperature,
  html,
  type LatLong,
} from "./utils";

const handleWBT = async (location: LatLong): Promise<string> => {
  const temperature = await getWetBulbTemperature(location);
  const category = getCategory(temperature);
  return html`<div
    hx-get="/wbt"
    hx-trigger="location-updated from:body"
    hx-include="#latitude, #longitude"
    hx-swap="outerHTML"
    id="wbt"
    class="cat${category}"
  >
    ${CtoF(temperature).toFixed(2)}&deg;F
  </div>`.toString();
};

const handleWBGT = async (location: LatLong): Promise<string> => {
  const temperature = await getWetBulbGlobeTemperature(location);
  const category = getCategory(CtoF(temperature));
  return html`<div
    hx-get="/wbgt"
    hx-trigger="location-updated from:body"
    hx-include="#latitude, #longitude"
    hx-swap="outerHTML"
    id="wbgt"
    class="cat${category}"
  >
    ${CtoF(temperature).toFixed(2)}&deg;F
  </div>`.toString();
};

const handleTemperature = async (location: LatLong): Promise<string> => {
  const { Ta } = await getData(location);
  return `${CtoF(Ta).toFixed(2)}&deg;F`;
};

const handleHumidity = async (location: LatLong): Promise<string> => {
  const { RH } = await getData(location);
  return `${RH.toFixed(0)}%`;
};

export { handleWBT, handleWBGT, handleTemperature, handleHumidity };

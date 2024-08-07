import axios from "axios";

export type LatLong = {
  latitude: number;
  longitude: number;
};

const getData = async ({
  latitude,
  longitude,
}: LatLong): Promise<{ Ta: number; RH: number; C: number; SR: number }> => {
  const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
    params: {
      latitude,
      longitude,
      current: "temperature_2m,relative_humidity_2m,cloud_cover",
      hourly: "direct_radiation",
      timezone: "America/Chicago",
      forecast_days: 1,
      forecast_hours: 1,
    },
  });
  const {
    temperature_2m: Ta,
    relative_humidity_2m: RH,
    cloud_cover: C,
  } = response.data.current;
  const SR = response.data.hourly.direct_radiation[0];
  return { Ta, RH, C, SR };
};

const getWetBulbTemperature = async (location: LatLong): Promise<number> => {
  const { Ta, RH } = await getData(location);
  const Tw =
    Ta * Math.atan(0.151977 * (RH + 8.313659) ** 0.5) +
    Math.atan(Ta + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * RH ** 1.5 * Math.atan(0.023101 * RH) -
    4.686035;
  return Tw;
};

const getWetBulbGlobeTemperature = async (
  location: LatLong
): Promise<number> => {
  const Tw = await getWetBulbTemperature(location);
  const { Ta, RH, C, SR } = await getData(location);
  console.log({ Ta, RH, C, SR });
  const Tg = 0.01498 * SR * (1 - C) + 1.184 * Ta - 0.0789 * RH - 2.739;
  const wbgt = 0.7 * Tw + 0.2 * Tg + 0.1 * Ta;
  console.log({ Tw, Tg, wbgt });
  return wbgt;
};

const FtoC = (F: number) => (F - 32) * (5 / 9);
const CtoF = (C: number) => C * (9 / 5) + 32;

const getCategory = (temperature: number): number => {
  if (temperature < 82) {
    return 1;
  } else if (temperature < 82) {
    return 2;
  } else if (temperature < 85) {
    return 3;
  } else if (88 < temperature && temperature < 90) {
    return 4;
  }
  return 5;
};

export {
  getData,
  getWetBulbTemperature,
  FtoC,
  CtoF,
  getCategory,
  getWetBulbGlobeTemperature,
};

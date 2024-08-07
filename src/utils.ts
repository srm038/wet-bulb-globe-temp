import axios from "axios";

const getData = async () => {
  const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
    params: {
      latitude: 52.52,
      longitude: 13.41,
      current: "temperature_2m,relative_humidity_2m",
    },
  });
  const { temperature_2m, relative_humidity_2m } = response.data.current;
  return { temperature_2m, relative_humidity_2m };
};

const getWetBulbTemperature = async () => {
  const { temperature_2m: T, relative_humidity_2m: RH } = await getData();
  const Tw =
    273.15 +
    (T - 273.15) * Math.atan(0.151977 * (RH + 8.313659) ** 0.5) +
    Math.atan(T - 273.15 + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * RH ** 1.5 * Math.atan(0.023101 * RH) -
    4.686035;
  return Tw;
};

const FtoC = (F: number) => (F - 32) * (5 / 9);
const CtoF = (C: number) => C * (9 / 5) + 32;

export { getData, getWetBulbTemperature, FtoC, CtoF };

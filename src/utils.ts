import axios from "axios";

const getTemperature = async () => {
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m&temperature_unit=fahrenheit`
  );
  const temperature = response.data.current.temperature_2m;
  return temperature;
};

export { getTemperature };

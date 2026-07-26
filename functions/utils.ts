export type LatLong = {
  latitude: number;
  longitude: number;
};

export const getData = async ({
  latitude,
  longitude,
}: LatLong): Promise<{
  Ta: number;
  RH: number;
  C: number;
  SR: number;
  Td: number;
  Pa: number;
  Ws: number;
}> => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,cloud_cover,surface_pressure,wind_speed_10m",
    hourly: "direct_radiation,dewpoint_2m",
    timezone: "America/Chicago",
    forecast_days: "1",
    forecast_hours: "1",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  const data: any = await response.json();
  const {
    temperature_2m: Ta,
    relative_humidity_2m: RH,
    cloud_cover: C,
    surface_pressure: Pa,
    wind_speed_10m: Ws,
  } = data.current;
  const SR = data.hourly.direct_radiation[0];
  const Td = data.hourly.dewpoint_2m[0];
  return { Ta, RH, C, SR, Td, Pa, Ws };
};

export const getWetBulbTemperature = async (location: LatLong): Promise<number> => {
  const { Ta, Td, RH, Pa } = await getData(location);
  return calculateWetBulbTemperature(Ta, Td, RH, Pa);
};

export const getWetBulbGlobeTemperature = async (location: LatLong): Promise<number> => {
  const { Ta, RH, C, SR, Td, Pa, Ws } = await getData(location);
  return calculateWetBulbGlobeTemperature(SR, C, Ta, Td, RH, Pa, Ws);
};

export const FtoC = (F: number) => (F - 32) * (5 / 9);
export const CtoF = (C: number) => C * (9 / 5) + 32;

export const getCategory = (temperature: number): number | undefined => {
  if (temperature < 82) return 1;
  if (temperature < 85) return 2;
  if (temperature < 88) return 3;
  if (temperature < 90) return 4;
  if (temperature >= 90) return 5;
};

export const calculateWetBulbTemperature = (
  Ta: number,
  Td: number,
  RH: number,
  Pa: number
) => {
  const Pws = calculateVaporPressureWater(Td);
  let Tw = (243.12 * Math.log(Pws / 6.112)) / (17.62 - Math.log(Pws / 6.112));
  let Phit = calculatePhit(Tw, Ta, Pa);
  while (Math.abs(Phit - Pws) > 0.1) {
    Tw = Tw - (Phit - Pws) / (2 * calculatePder(Tw, Ta, Pa));
    Phit = calculatePhit(Tw, Ta, Pa);
  }
  return (
    Ta * Math.atan(0.151977 * (RH + 8.313659) ** 0.5) +
    Math.atan(Ta + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * RH ** 1.5 * Math.atan(0.023101 * RH) -
    4.686035
  );
};

export const calculateWetBulbGlobeTemperature = (
  SR: number,
  C: number,
  Ta: number,
  Td: number,
  RH: number,
  Pa: number,
  Ws: number
) => {
  const Tw = calculateWetBulbTemperature(Ta, Td, RH, Pa);
  const solarGain = 0.01498 * SR * (1 - C / 100);
  const windFactor = 1 + 0.1 * Math.sqrt(Ws);
  const Tg = solarGain / windFactor + 1.184 * Ta - 0.0789 * RH - 2.739;
  return 0.7 * Tw + 0.2 * Tg + 0.1 * Ta;
};

export const calculateVaporPressureWater = (t: number): number => {
  const b = [
    -5800.2206, 1.3914993, -0.048640239, 0.000041764768, -0.000000014452093,
    6.5459673,
  ];
  const c = [0.4931358, -0.0046094296, 0.000013746454, -0.000000012743214];
  const v =
    t +
    273.15 -
    c[0] -
    c[1] * (t + 273.15) -
    c[2] * (t + 273.15) ** 2 -
    c[3] * (t + 273.15) ** 3;
  return (
    0.01 *
    Math.exp(
      b[0] / v +
        b[1] +
        b[2] * v +
        b[3] * v ** 2 +
        b[4] * v ** 3 +
        b[5] * Math.log(v)
    )
  );
};

export const calculateVaporPressureIce = (t: number): number => {
  const a = [
    -5674.5359, 6.3925247, -9.677843e-3, 0.00000062215701, 2.0747825e-9,
    -9.484024e-13, 4.1635019,
  ];
  return (
    0.01 *
    Math.exp(
      a[0] / (t + 273.15) +
        a[1] +
        a[2] * (t + 273.15) +
        a[3] * (t + 273.15) ** 2 +
        a[4] * (t + 273.15) ** 3 +
        a[5] * (t + 273.15) ** 4 +
        a[6] * Math.log(t + 273.15)
    )
  );
};

export const calculatePhit = (Tw: number, Ta: number, Pa: number) => {
  if (Tw > 0) {
    return calculateVaporPressureWater(Tw) - 0.000662 * Pa * (Ta - Tw);
  } else {
    return calculateVaporPressureIce(Tw) - 0.000583 * Pa * (Ta - Tw);
  }
};

export const calculatePder = (Tw: number, Ta: number, Pa: number) => {
  const Phit = calculatePhit(Tw, Ta, Pa);
  if (Tw > 0) {
    return 10 * (calculateVaporPressureWater(Tw + 0.1) - 0.000662 * Ta * (Ta - (Tw + 0.1)) - Phit);
  } else {
    return 10 * (calculateVaporPressureIce(Tw + 0.1) - 0.000583 * Ta * (Ta - (Tw + 0.1)) - Phit);
  }
};

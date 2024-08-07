import { expect, test, describe } from "bun:test";
import {
  calculatePder,
  calculatePhit,
  calculateVaporPressureIce,
  calculateVaporPressureWater,
  calculateWetBulbGlobeTemperature,
  calculateWetBulbTemperature,
  CtoF,
  FtoC,
  getCategory,
  getData,
  getWetBulbGlobeTemperature,
  getWetBulbTemperature,
} from "../utils";

describe("temperature", () => {
  test("FtoC", () => {
    expect(FtoC(32)).toBe(0);
    expect(FtoC(212)).toBe(100);
  });
  test("CtoF", () => {
    expect(CtoF(0)).toBe(32);
    expect(CtoF(100)).toBe(212);
  });
});

describe("calculations", () => {
  test("calculateWetBulbTemperature", () => {
    const Tw = calculateWetBulbTemperature(25, 20, 40, 1000);
    expect(Tw).toBeCloseTo(16.384);
  });

  test("calculateWetBulbGlobeTemperature", () => {
    const wbgt = calculateWetBulbGlobeTemperature(800, 20, FtoC(100), FtoC(78), 38, 1000);
    expect(wbgt).toBeCloseTo(FtoC(88), -1);
  });

  test("calculateVaporPressureWater", () => {
    const vp = calculateVaporPressureWater(25);
    expect(vp).toBeCloseTo(31.82, 0);
  });

  test("calculateVaporPressureIce", () => {
    const vp = calculateVaporPressureIce(-10);
    expect(vp).toBeCloseTo(2.59, 0);
  });

  test("calculatePhit", () => {
    const phit = calculatePhit(25, 50, 2.5);
    expect(phit).toBeCloseTo(31.82, 0);
  });

  test("calculatePder", () => {
    const pder = calculatePder(25, 50, 2.5);
    expect(pder).toBeCloseTo(-6, 0);
  });
});

describe("live data", () => {
  test("getData", async () => {
    const data = await getData({ latitude: 37.7749, longitude: -122.4194 });
    expect(data).toHaveProperty("Ta");
    expect(data).toHaveProperty("RH");
    expect(data).toHaveProperty("C");
    expect(data).toHaveProperty("SR");
  });

  test("getwetBulbTemperature", async () => {
    const Tw = await getWetBulbTemperature({
      latitude: 37.7749,
      longitude: -122.4194,
    });
    expect(Tw).toBeGreaterThan(0);
  });

  test("getWetBulbGlobeTemperature", async () => {
    const wbgt = await getWetBulbGlobeTemperature({
      latitude: 37.7749,
      longitude: -122.4194,
    });
    expect(wbgt).toBeGreaterThan(0);
  });
});

test("getCategory", () => {
  expect(getCategory(81)).toBe(1);
  expect(getCategory(83)).toBe(3);
  expect(getCategory(88)).toBe(4);
  expect(getCategory(90)).toBe(5);
});

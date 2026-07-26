import {
  calculateWetBulbGlobeTemperature,
  CtoF,
  getCategory,
  getData,
} from "./utils";

const html = String.raw;

const WBGT_MIN = 60;
const WBGT_MAX = 100;
const WBGT_RANGE = WBGT_MAX - WBGT_MIN;

const catColor: Record<number, string> = {
  1: "#95a5a6",
  2: "#27ae60",
  3: "#f1c40f",
  4: "#e74c3c",
  5: "#1a1a1a",
};

const catBoundary = [82, 85, 88, 90];

function wbgtTrackGradient(): string {
  const stops: string[] = [];
  let prev = WBGT_MIN;
  for (const boundary of catBoundary) {
    const cat = getCategory(boundary - 0.1)!;
    const startDeg = 90 + ((prev - WBGT_MIN) / WBGT_RANGE) * 180;
    const endDeg = 90 + ((boundary - WBGT_MIN) / WBGT_RANGE) * 180;
    stops.push(`${catColor[cat]} ${startDeg}deg ${endDeg}deg`);
    prev = boundary;
  }
  const startDeg = 90 + ((prev - WBGT_MIN) / WBGT_RANGE) * 180;
  stops.push(`${catColor[5]} ${startDeg}deg 270deg`);
  return `conic-gradient(from 180deg at 50% 100%, ${stops.join(", ")})`;
}

const gauge = (
  id: string,
  label: string,
  value: number,
  display: string,
  cls: string,
  min: number,
  max: number,
) => {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const angle = 90 + pct * 1.8;
  return html` <div
    id="${id}"
    class="gauge ${cls}"
    style="--pct: ${pct}; --angle: ${angle}deg"
  >
    <div class="gauge-track">
      <div class="gauge-fill"></div>
      <div class="gauge-needle"></div>
    </div>
    <div class="gauge-value">${display}</div>
    <div class="gauge-label">${label}</div>
  </div>`;
};

const wbgtGauge = (wbgtF: number, category: number) => {
  const pct = Math.max(
    0,
    Math.min(100, ((wbgtF - WBGT_MIN) / WBGT_RANGE) * 100),
  );
  const angle = 90 + pct * 1.8;
  const trackGradient = wbgtTrackGradient();
  return html` <div
    id="gauge-wbgt"
    class="gauge gauge--wbgt cat${category}"
    style="--pct: ${pct}; --angle: ${angle}deg"
  >
    <div class="gauge-track" style="background: ${trackGradient}">
      <div class="gauge-needle"></div>
    </div>
    <div class="gauge-value">${wbgtF.toFixed(1)}&deg;F</div>
    <div class="gauge-label">WBGT</div>
  </div>`;
};

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");

  if (!latitude || !longitude) {
    return new Response("Location is required", { status: 400 });
  }

  try {
    const location = { latitude: +latitude, longitude: +longitude };
    const { Ta, RH, C, SR, Td, Pa, Ws } = await getData(location);
    const wbgt = calculateWetBulbGlobeTemperature(SR, C, Ta, Td, RH, Pa, Ws);
    const wbgtF = CtoF(wbgt);
    const category = getCategory(wbgtF) ?? 1;

    const body = html`
      ${wbgtGauge(wbgtF, category)}
      ${gauge(
        "gauge-temp",
        "Temperature",
        CtoF(Ta),
        `${CtoF(Ta).toFixed(1)}°F`,
        "gauge--temp",
        -20,
        120,
      )}
      ${gauge("gauge-rh", "Humidity", RH, `${RH.toFixed(0)}%`, "gauge--rh", 0, 100)}
      ${gauge("gauge-cloud", "Cloud Cover", C, `${C.toFixed(0)}%`, "gauge--cloud", 0, 100)}
      ${gauge(
        "gauge-wind",
        "Wind Speed",
        Ws * 0.621371,
        `${(Ws * 0.621371).toFixed(1)} mph`,
        "gauge--wind",
        0,
        50,
      )}
      ${gauge(
        "gauge-radiation",
        "Direct Radiation",
        SR,
        `${SR.toFixed(0)} W/m²`,
        "gauge--radiation",
        0,
        1400,
      )}
      ${gauge(
        "gauge-dewpoint",
        "Dewpoint",
        CtoF(Td),
        `${CtoF(Td).toFixed(1)}°F`,
        "gauge--dewpoint",
        -20,
        100,
      )}
    `;

    return new Response(body, {
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

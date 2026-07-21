import {
  getData,
  CtoF,
  getCategory,
  getWetBulbGlobeTemperature,
} from "./utils";

const html = String.raw;

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");

  if (!latitude || !longitude) {
    return new Response("Location is required", { status: 400 });
  }

  try {
    const location = { latitude: +latitude, longitude: +longitude };
    const [weather, wbgt] = await Promise.all([
      getData(location),
      getWetBulbGlobeTemperature(location),
    ]);

    const category = getCategory(CtoF(wbgt));
    const body = html`<div
      id="metrics"
      hx-get="/data"
      hx-trigger="location-updated from:body, every 15m"
      hx-include="#latitude, #longitude"
      hx-swap="outerHTML"
    >
      <div id="temperature">${CtoF(weather.Ta).toFixed(2)}&deg;F</div>
      <div id="rh">${weather.RH.toFixed(0)}%</div>
      <div id="wbgt" class="cat${category}">
        ${CtoF(wbgt).toFixed(2)}&deg;F
      </div>
    </div>`;

    return new Response(body, {
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

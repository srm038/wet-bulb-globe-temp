import { getWetBulbGlobeTemperature, CtoF, getCategory } from "./utils";

const html = String.raw;

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");

  if (!latitude || !longitude) {
    return new Response("Location is required", { status: 400 });
  }

  try {
    const temperature = await getWetBulbGlobeTemperature({
      latitude: +latitude,
      longitude: +longitude,
    });
    const category = getCategory(CtoF(temperature));
    const body = html`<div
      hx-get="/wbgt"
      hx-trigger="location-updated from:body"
      hx-include="#latitude, #longitude"
      hx-swap="outerHTML"
      id="wbgt"
      class="cat${category}"
    >
      ${CtoF(temperature).toFixed(2)}&deg;F
    </div>`;
    return new Response(body, {
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

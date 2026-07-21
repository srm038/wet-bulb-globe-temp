import { getData, CtoF } from "./utils";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");

  if (!latitude || !longitude) {
    return new Response("Location is required", { status: 400 });
  }

  try {
    const { Ta } = await getData({ latitude: +latitude, longitude: +longitude });
    return new Response(`${CtoF(Ta).toFixed(2)}&deg;F`, {
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

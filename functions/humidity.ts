import { getData } from "./utils";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");

  if (!latitude || !longitude) {
    return new Response("Location is required", { status: 400 });
  }

  try {
    const { RH } = await getData({ latitude: +latitude, longitude: +longitude });
    return new Response(`${RH.toFixed(0)}%`, {
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

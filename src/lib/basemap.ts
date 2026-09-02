// Shared CARTO dark basemap for the two public Leaflet maps.
//
// CARTO now gates its tile endpoint behind an API key. The key is a public,
// referrer-restricted one — it has to reach the browser to sign tile requests,
// so it is a NEXT_PUBLIC_ variable and is inlined into the client bundle at
// build time. Restrict it by domain in the CARTO dashboard, not by hiding it.
//
// Without the variable set the plain URL is used, which still renders but with
// an "API KEY REQUIRED" watermark burned into every tile. The parameter is
// `key`, not `api_key`: a wrong name is accepted silently and watermarked.
const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const apiKey = process.env.NEXT_PUBLIC_CARTO_API_KEY

export const BASEMAP_TILE_URL = apiKey
  ? `${CARTO_DARK_TILES}?key=${encodeURIComponent(apiKey)}`
  : CARTO_DARK_TILES

export const BASEMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

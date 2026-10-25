// Turns map coordinates into a street address using OpenStreetMap's free
// Nominatim service (no API key). Uses fetch, not your axiosInstance,
// because that instance points at the DummyJSON base URL.
export async function reverseGeocode(lat, lng) {
  const url =
    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1" +
    `&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("Could not look up this location");
  const data = await res.json();
  const a = data.address ?? {};
  return {
    line1: [a.house_number, a.road, a.neighbourhood ?? a.suburb]
      .filter(Boolean)
      .join(", "),
    city: a.city ?? a.town ?? a.village ?? a.state_district ?? "",
    state: a.state ?? "",
    pincode: a.postcode ?? "",
  };
}
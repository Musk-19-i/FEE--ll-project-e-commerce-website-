// DummyJSON prices are in USD. This project displays INR throughout since
// it's an Amazon/Flipkart-style storefront for an Indian audience.
//
// The conversion rate is a fixed constant for demo purposes (not a live FX
// rate) — swap this for a real rate lookup if this ever talks to a real
// payment provider. Everything in Redux state and the filter/sort logic
// still operates on the raw API price; only the view layer converts.
export const USD_TO_INR = 83;

export function toINR(usdPrice) {
  return usdPrice * USD_TO_INR;
}

export function fromINR(inrValue) {
  return inrValue / USD_TO_INR;
}

export function formatINR(usdPrice) {
  const rupees = Math.round(toINR(usdPrice));
  return `₹${rupees.toLocaleString("en-IN")}`;
}

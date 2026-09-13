// DummyJSON prices are in USD. This project displays INR throughout since
// it's an Amazon/Flipkart-style storefront for an Indian audience.

export const USD_TO_INR = 96;

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

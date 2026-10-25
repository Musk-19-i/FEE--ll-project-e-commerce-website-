export const isPhone = (v) => /^[6-9]\d{9}$/.test(v);        // Indian mobile
export const isPincode = (v) => /^[1-9]\d{5}$/.test(v);      // 6-digit PIN
export const isUPI = (v) => /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v);
export const isCVV = (v) => /^\d{3,4}$/.test(v);

// Luhn check: the standard algorithm that tells if a card number is plausible
export function isCardNumber(value) {
  const d = value.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(d)) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// Expects "MM/YY" and not in the past
export function isExpiry(value) {
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!m) return false;
  const lastDay = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59, 59);
  return lastDay >= new Date();
}
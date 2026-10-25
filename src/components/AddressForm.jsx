import { useState } from "react";
import MapPicker from "./MapPicker";
import FormField, { inputCls } from "./FormField";
import { reverseGeocode } from "../utils/geocode";

export default function AddressForm({ address, setAddress, errors }) {
  const [mode, setMode] = useState("map"); // "map" | "manual"
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const set = (field) => (e) =>
    setAddress((a) => ({ ...a, [field]: e.target.value }));

  async function pickPoint(lat, lng) {
    setNotice("");
    setBusy(true);
    setAddress((a) => ({ ...a, lat, lng }));
    try {
      const found = await reverseGeocode(lat, lng);
      // Only overwrite fields we actually got a value for
      setAddress((a) => ({
        ...a,
        line1: found.line1 || a.line1,
        city: found.city || a.city,
        state: found.state || a.state,
        pincode: found.pincode || a.pincode,
      }));
      setNotice("Address filled from the map. Please check it and edit if needed.");
    } catch {
      setNotice("Couldn't fetch the address for this spot. Please fill it in below.");
    } finally {
      setBusy(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setNotice("Your browser doesn't support location. Pick on the map or type it in.");
      return;
    }
    setBusy(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      (pos) => pickPoint(pos.coords.latitude, pos.coords.longitude),
      () => {
        setBusy(false);
        setNotice("Location permission denied. Pick on the map or type it in.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const position = address.lat != null ? [address.lat, address.lng] : null;

  return (
    <div>
      {/* Mode toggle (same look as your variant buttons) */}
      <div className="mb-4 flex gap-2">
        {[
          ["map", "Pick on map"],
          ["manual", "Enter manually"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              mode === key
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "map" && (
        <div className="mb-5">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={busy}
            className="mb-3 rounded-md border border-teal px-3 py-1.5 text-sm font-medium text-teal hover:bg-teal-light disabled:opacity-60"
          >
            {busy ? "Locating…" : "Use my current location"}
          </button>
          <MapPicker position={position} onPick={pickPoint} />
          <p className="mt-2 text-xs text-subink">
            Tap the map or drag the pin to set your delivery spot.
          </p>
        </div>
      )}

      {notice && <p className="mb-4 text-sm text-teal">{notice}</p>}

      {/* The same fields are used in both modes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" error={errors.name}>
          <input className={inputCls(errors.name)} value={address.name} onChange={set("name")} autoComplete="name" />
        </FormField>
        <FormField label="Mobile number" error={errors.phone}>
          <input className={inputCls(errors.phone)} value={address.phone} onChange={set("phone")} inputMode="numeric" maxLength={10} autoComplete="tel" />
        </FormField>
        <FormField label="Address (house no., street, area)" error={errors.line1} className="sm:col-span-2">
          <input className={inputCls(errors.line1)} value={address.line1} onChange={set("line1")} autoComplete="address-line1" />
        </FormField>
        <FormField label="Landmark (optional)" className="sm:col-span-2">
          <input className={inputCls(false)} value={address.line2} onChange={set("line2")} />
        </FormField>
        <FormField label="City" error={errors.city}>
          <input className={inputCls(errors.city)} value={address.city} onChange={set("city")} autoComplete="address-level2" />
        </FormField>
        <FormField label="State" error={errors.state}>
          <input className={inputCls(errors.state)} value={address.state} onChange={set("state")} autoComplete="address-level1" />
        </FormField>
        <FormField label="PIN code" error={errors.pincode}>
          <input className={inputCls(errors.pincode)} value={address.pincode} onChange={set("pincode")} inputMode="numeric" maxLength={6} autoComplete="postal-code" />
        </FormField>
      </div>
    </div>
  );
}
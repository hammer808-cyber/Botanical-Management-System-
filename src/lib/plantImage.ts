/**
 * Shared plant-image helpers.
 *
 * PLANT_PLACEHOLDER is a neutral botanical tile used whenever a plant has
 * no real photo — it beats a random stock photo (or a broken image) every
 * time. Inline SVG data URI: offline-safe, deterministic, zero requests.
 */
export const PLANT_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
      `<rect width="800" height="600" fill="#1d4a2c"/>` +
      `<circle cx="400" cy="300" r="180" fill="#2d6a41" opacity="0.55"/>` +
      `<g fill="none" stroke="#e9f5ec" stroke-width="14" stroke-linecap="round">` +
      `<path d="M400 460 C 400 340, 400 240, 400 160"/>` +
      `<path d="M400 360 C 340 340, 300 300, 285 240"/>` +
      `<path d="M400 360 C 460 340, 500 300, 515 240"/>` +
      `<path d="M400 270 C 355 255, 325 225, 315 180"/>` +
      `<path d="M400 270 C 445 255, 475 225, 485 180"/>` +
      `</g>` +
      `<g fill="#e9f5ec">` +
      `<ellipse cx="285" cy="240" rx="34" ry="20" transform="rotate(-35 285 240)"/>` +
      `<ellipse cx="515" cy="240" rx="34" ry="20" transform="rotate(35 515 240)"/>` +
      `<ellipse cx="315" cy="180" rx="28" ry="17" transform="rotate(-30 315 180)"/>` +
      `<ellipse cx="485" cy="180" rx="28" ry="17" transform="rotate(30 485 180)"/>` +
      `<ellipse cx="400" cy="150" rx="26" ry="40"/>` +
      `</g>` +
      `</svg>`
  );

/**
 * Brand tokens for use in TypeScript (logo colors, metadata, generated assets).
 * Mirrors the CSS custom properties in src/app/tokens.css.
 */
export const palette = {
  navy: "#172B3A", // Foundation Navy
  ivory: "#F7F4EE", // Warm Ivory
  sand: "#E6DED1", // Natural Sand
  brass: "#AA8453", // Muted Brass (decorative accent)
  bronze: "#75552F", // Deep Bronze (primary buttons)
  graphite: "#303538", // Graphite (body text)
  white: "#FFFFFF",
} as const;

export const fonts = {
  heading: "Inter",
  logo: "Montserrat (outlined in the logo files)",
  body: "Inter",
} as const;

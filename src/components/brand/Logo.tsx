import { useId } from "react";
import { palette } from "@/lib/brand";
import { horizontal, monogram, stacked, type LogoLayout } from "./logo-paths";

const layouts = { horizontal, stacked, monogram } satisfies Record<string, LogoLayout>;

/** navy: navy + brass accents (light backgrounds). reverse: ivory + brass (dark backgrounds). mono: one color (currentColor). */
type Tone = "navy" | "reverse" | "mono";

const tones: Record<Tone, { main: string; accent: string }> = {
  navy: { main: palette.navy, accent: palette.brass },
  reverse: { main: palette.ivory, accent: palette.brass },
  mono: { main: "currentColor", accent: "currentColor" },
};

type Props = {
  layout?: keyof typeof layouts;
  tone?: Tone;
  className?: string;
  /** Accessible name. Pass an empty string when the logo is decorative next to visible text. */
  title?: string;
};

export function Logo({ layout = "horizontal", tone = "navy", className, title = "V & A Flooring" }: Props) {
  const l = layouts[layout];
  const { main, accent } = tones[tone];
  const id = useId();
  const decorative = title === "";
  return (
    <svg
      viewBox={`0 0 ${l.width} ${l.height}`}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={decorative ? undefined : id}
      focusable="false"
    >
      {!decorative && <title id={id}>{title}</title>}
      <g fill={main}>
        {l.strokes.map((d, i) => (
          <path key={`s${i}`} d={d} />
        ))}
        {l.name.map((d, i) => (
          <path key={`n${i}`} d={d} />
        ))}
      </g>
      <path fill={accent} d={l.bar} />
      <g fill={accent}>
        {l.amp.map((d, i) => (
          <path key={`a${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}

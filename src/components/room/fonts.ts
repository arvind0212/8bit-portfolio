import { Bricolage_Grotesque, Atkinson_Hyperlegible_Next, Martian_Mono, Silkscreen } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--rf-display" });
const text = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--rf-text" });
const mono = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--rf-mono" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });

export const FONT_VARS = [display.variable, text.variable, mono.variable, pix.variable].join(" ");

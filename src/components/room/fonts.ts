import { Schibsted_Grotesk, Atkinson_Hyperlegible_Next, Atkinson_Hyperlegible_Mono, Silkscreen } from "next/font/google";

const display = Schibsted_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--rf-display" });
const text = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--rf-text" });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], variable: "--rf-mono" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });

export const FONT_VARS = [display.variable, text.variable, mono.variable, pix.variable].join(" ");

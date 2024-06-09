import type { Config } from "tailwindcss";
import tailwind from "./src/styles/tailwind";

export default {
  content: {
    relative: true,
    files: [
      `./index.html`,
      `./src/components/**/*.tsx`,
      `./src/stores/**/*.ts`,
    ],
  },
  darkMode: `class`,
  presets: [tailwind],
} satisfies Config;

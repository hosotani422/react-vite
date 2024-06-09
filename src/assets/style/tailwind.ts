import plugin from "tailwindcss/plugin";

export default {
  theme: {
    colors: {
      transparent: `transparent`,
      current: `currentColor`,
      "theme-fine": `#18d`,
      "theme-care": `#f80`,
      "theme-warn": `#ff0800`,
      "theme-half": `#959595`,
      "font-light": `#383838`,
      "font-dark": `#efefff`,
      "back-light": `#fafafa`,
      "back-dark": `#303030`,
      "mask-light": `rgba(0, 0, 0, 0.3)`,
      "mask-dark": `rgba(255, 255, 255, 0.3)`,
    },
    backgroundImage: {
      "grad-light": `linear-gradient(145deg, #d0d0d0, #e7e7e7)`,
      "grad-dark": `linear-gradient(145deg, #454545, #6a6a6a)`,
    },
    boxShadow: {
      "outer-light": `0px 0px 5px 5px rgba(0, 0, 0, 0.5)`,
      "outer-dark": `0px 0px 5px 5px rgba(255, 255, 255, 0.5)`,
      "inner-light": `0px 0px 5px 5px rgba(0, 0, 0, 0.5) inset`,
      "inner-dark": `0px 0px 5px 5px rgba(255, 255, 255, 0.5) inset`,
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant(`theme-current`, [`&.back`, `&.prev`, `&.next`]);
      addVariant(`theme-light`, [`&.light`, `.light &`]);
      addVariant(`theme-dark`, [`&.dark`, `.dark &`]);
      addVariant(`speed-slow`, [`&.slow`, `.slow &`]);
      addVariant(`speed-just`, [`&.just`, `.just &`]);
      addVariant(`speed-fast`, [`&.fast`, `.fast &`]);
      addVariant(`anime-active`, [`&.v-enter-active`, `&.v-leave-active`]);
      addVariant(`anime-fromto`, [`&.v-enter-from`, `&.v-leave-to`]);
    }),
  ],
};

import Zod from "zod";
import app from "@/stores/page/app";

export default {
  emptySchema: () => {
    return Zod.string().refine(
      (value) => {
        return value.trim().length > 0;
      },
      {
        message: app.temp.i18next.t(`validation.empty`),
      },
    );
  },
};

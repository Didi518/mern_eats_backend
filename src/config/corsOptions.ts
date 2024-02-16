import allowedOrigins from "./allowedOrigins";

const corsOptions = {
  origin: (origin: any, callback: Function) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Bloqué par CORS"));
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;

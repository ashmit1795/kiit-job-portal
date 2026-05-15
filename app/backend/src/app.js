import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import { inngestHandler } from "./inngest/serve.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.set("trust proxy", 1);

// Inngest handler
app.use("/api/inngest", inngestHandler);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;

import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import { validateEmailConfig } from "./emails/email.service.js";
import logger from "./utils/logger.js";

const server = http.createServer(app);

validateEmailConfig();

server.listen(env.PORT, () => {
	logger.info("Server started successfully", {
		port: env.PORT,
		environment: env.NODE_ENV,
		url: `http://localhost:${env.PORT}/`,
	});
});

process.on("unhandledRejection", (err) => {
	logger.error("Unhandled Rejection occurred", {
		message: err.message,
		stack: err.stack,
	});

	process.exit(1);
});

process.on("uncaughtException", (err) => {
	logger.error("Uncaught Exception occurred", {
		message: err.message,
		stack: err.stack,
	});

	process.exit(1);
});

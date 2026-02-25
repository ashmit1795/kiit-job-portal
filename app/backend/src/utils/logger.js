import chalk from "chalk";
import env from "../config/env.js";

class Logger {
	constructor() {
		this.isDevelopment = env.NODE_ENV !== "production";
	}

	getColor(level) {
		switch (level) {
			case "INFO":
				return chalk.blue;
			case "WARN":
				return chalk.yellow;
			case "ERROR":
				return chalk.red;
			case "DEBUG":
				return chalk.magenta;
			default:
				return chalk.white;
		}
	}

	formatDev(level, message, meta) {
		const timestamp = chalk.gray(new Date().toISOString());
		const levelColor = this.getColor(level);

		let output = `${timestamp} ${levelColor(level)}: ${chalk.white(message)}`;

		if (meta) {
			output += `\n${chalk.cyan(JSON.stringify(meta, null, 2))}`;
		}

		return output;
	}

	formatProd(level, message, meta) {
		return JSON.stringify({
			level,
			message,
			...(meta && { meta }),
			timestamp: new Date().toISOString(),
		});
	}

	info(message, meta = null) {
		if (this.isDevelopment) {
			console.log(this.formatDev("INFO", message, meta));
		} else {
			console.log(this.formatProd("INFO", message, meta));
		}
	}

	warn(message, meta = null) {
		if (this.isDevelopment) {
			console.warn(this.formatDev("WARN", message, meta));
		} else {
			console.warn(this.formatProd("WARN", message, meta));
		}
	}

	error(message, meta = null) {
		if (this.isDevelopment) {
			console.error(this.formatDev("ERROR", message, meta));
		} else {
			console.error(this.formatProd("ERROR", message, meta));
		}
	}

	debug(message, meta = null) {
		if (!this.isDevelopment) return;

		console.debug(this.formatDev("DEBUG", message, meta));
	}
}

export default new Logger();

import chalk from "chalk";
import env from "../config/env.js";

/**
 * Logger class for structured and color-coded logging in development and production environments.
 * This class provides methods for logging messages at different levels (info, warn, error, debug) with appropriate formatting based on the environment. In development, logs are color-coded and include timestamps for better readability. In production, logs are output as JSON strings for easier parsing by log management systems. The logger also supports including additional metadata with log messages.
 */
class Logger {
	constructor() {
		this.isDevelopment = env.NODE_ENV !== "production";
	}

	/**
	 * Gets the appropriate color function based on the log level.
	 * @param {string} level - The log level (INFO, WARN, ERROR, DEBUG).
	 * @return {Function} - The color function for the specified log level.
	 */
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

	/**
	 * Formats log messages for development environment with colors and timestamps.
	 * @param {string} level - The log level (INFO, WARN, ERROR, DEBUG).
	 * @param {string} message - The log message.
	 * @param {Object|null} meta - Additional metadata for the log message.
	 * @return {string} - The formatted log message.
	 */
	formatDev(level, message, meta) {
		const timestamp = chalk.gray(new Date().toISOString());
		const levelColor = this.getColor(level);

		let output = `${timestamp} ${levelColor(level)}: ${chalk.white(message)}`;

		if (meta) {
			output += `\n${chalk.cyan(JSON.stringify(meta, null, 2))}`;
		}

		return output;
	}

	/**
	 * Formats log messages for production environment as JSON strings.
	 * @param {string} level - The log level (INFO, WARN, ERROR, DEBUG).
	 * @param {string} message - The log message.
	 * @param {Object|null} meta - Additional metadata for the log message.
	 * @return {string} - The formatted log message.
	 */
	formatProd(level, message, meta) {
		return JSON.stringify({
			level,
			message,
			...(meta && { meta }),
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Logs an info message.
	 * @param {string} message - The log message.
	 * @param {Object|null} meta - Additional metadata for the log message.
	 */
	info(message, meta = null) {
		if (this.isDevelopment) {
			console.log(this.formatDev("INFO", message, meta));
		} else {
			console.log(this.formatProd("INFO", message, meta));
		}
	}

	/**
	 * Logs a warning message.
	 * @param {string} message - The log message.
	 * @param {Object|null} meta - Additional metadata for the log message.
	 */
	warn(message, meta = null) {
		if (this.isDevelopment) {
			console.warn(this.formatDev("WARN", message, meta));
		} else {
			console.warn(this.formatProd("WARN", message, meta));
		}
	}

	/**
	 * Logs an error message.
	 * @param {string} message - The log message.
	 * @param {Object|null} meta - Additional metadata for the log message.
	 */
	error(message, meta = null) {
		if (this.isDevelopment) {
			console.error(this.formatDev("ERROR", message, meta));
		} else {
			console.error(this.formatProd("ERROR", message, meta));
		}
	}

	/**
	 * Logs a debug message (only in development environment).
	 * @param {string} message - The log message.
	 * @param {Object|null} meta - Additional metadata for the log message.
	 */
	debug(message, meta = null) {
		if (!this.isDevelopment) return;

		console.debug(this.formatDev("DEBUG", message, meta));
	}
}

export default new Logger();

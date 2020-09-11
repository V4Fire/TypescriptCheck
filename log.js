const
	process = require('process'),
	core = require('@actions/core'),
	chalk = require('chalk'),
	arg = require('arg');

class AbstractLogger {
	/**
	 * Logs info
	 * @param {...any} args
	 */
	info(...args) {}

	/**
	 * Logs an error
	 * @param {...any} args
	 */
	error(...args) {}

	/**
	 * Logs a warning
	 * @param  {...any} args
	 */
	warning(...args) {}

	/**
	 * Sets a process as failed and logs the specified error message
	 * @param  {...any} args
	 */
	setFailed(...args) {}
}

class Logger extends AbstractLogger {
	/**
	 * Current log engine
	 */
	#engine;

	constructor() {
		super();

		const logger = arg({'--logger': String}, {permissive: true})['--logger'] || 'github';

		switch (logger) {
			case 'github': {
				this.#engine = new GithubActionLogger();
				break;
			}

			case 'cli': {
				this.#engine = new CLILogger();
				break;
			}

			default: {
				this.#engine = new GithubActionLogger();
			}
		}
	}

	/** @override */
	info(...args) {
		this.#engine.info(...args);
	}

	/** @override */
	error(...args) {
		this.#engine.error(...args);
	}

	/** @override */
	warning(...args) {
		this.#engine.warning(...args);
	}

	/** @override */
	setFailed(...args) {
		this.#engine.setFailed(...args);
	}
}

class GithubActionLogger extends AbstractLogger {
	/** @override */
	info(...args) {
		core.info(...args);
	}

	/** @override */
	error(...args) {
		core.error(...args);
	}

	/** @override */
	warning(...args) {
		core.warning(...args);
	}

	/** @override */
	setFailed(...args) {
		core.setFailed(...args);
	}
}

class CLILogger extends AbstractLogger {
	/** @override */
	info(...args) {
		console.log(chalk.blueBright(...args));
	}

	/** @override */
	error(...args) {
		console.log(chalk.redBright(...args));
	}

	/** @override */
	warning(...args) {
		console.log(chalk.yellowBright(...args));
	}

	/** @override */
	setFailed(...args) {
		console.log(chalk.redBright(...args));
		process.exitCode = 1;
	}
}

module.exports = new Logger();

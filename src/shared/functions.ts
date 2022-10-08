import logger from 'jet-logger';

/**
 * Print an error object if it's truthy. Useful for testing.
 *
 * @param err
 */
export function pErr(err?: Error): void {
	if (!!err) {
		logger.err(err);
	}
}

/**
 * Get environment variable
 * @param key {string} - Key
 */
export function getEnv(key: string) {
	if (!process.env[key]) {
		const err = new Error(`You forgot to set ${key} in the environment`);
		pErr(err);
		throw err;
	}
	return process.env[key];
}

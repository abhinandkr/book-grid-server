import logger from 'jet-logger';
import axios from 'axios';

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
 * Make a http get request
 * @param url {string} URL
 * @param params {object} params to the get request
 */
export async function httpGet(url: string, params?: object) {
	return await axios.get(url, params);
}

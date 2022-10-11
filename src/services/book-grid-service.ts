import * as fs from 'fs';
import * as path from 'path';
import {parse} from 'csv-parse';
import axios from 'axios';
import _ from 'lodash';
import NodeCache from 'node-cache';
import {getEnv} from '@shared/functions';

export default class BookGridService {

	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache({
			stdTTL: parseInt(getEnv('CACHE_STD_TTL')!),
		});
	}

	public async getReadBookList(year: string): Promise<any []> {
		const fileName = path.join(
			__dirname, '../resources/goodreads_library_export.csv');
		// eslint-disable-next-line max-len
		const columns = ['Book Id', 'Title', 'Author', 'Author l-f', 'Additional Authors', 'ISBN', 'ISBN13', 'My Rating', 'Average Rating', 'Publisher', 'Binding', 'Number of Pages', 'Year Published', 'Original Publication Year', 'Date Read', 'Date Added', 'Bookshelves', 'Bookshelves with positions', 'Exclusive Shelf', 'My Review', 'Spoiler', 'Private Notes', 'Read Count', 'Owned Copies', 'Cover Art'];
		const parser = fs
			.createReadStream(fileName)
			.pipe(parse({
				delimiter: ',',
				from: 2,
				columns,
			}));

		const result = [];

		function isRead(record: any) {
			return record['Exclusive Shelf'] === 'read';
		}

		function isReadInYear(record: any, year: string) {
			let dateRead: string = record['Date Read'];
			if (!dateRead) {
				dateRead = record['Date Added'];
			}
			return dateRead && (dateRead.slice(0, 4) === year);
		}

		for await (const record of parser) {
			if (isRead(record) && isReadInYear(record, year)) {
				let isbn = record['ISBN'].match(/[0-9X]+/gm);
				if (isbn !== null) {
					isbn = isbn[0];
				}
				result.push({
					isbn,
					myRating: record['My Rating'],
					title: record['Title'],
					coverArtUrl: record['Cover Art'],
				});
			}
		}
		return result;
	}

	// eslint-disable-next-line max-len
	public async getBookThumbnailUrl(isbn: string): Promise<{thumbnailUrl: string, googleBooksUrl: string} | undefined> {
		if (this.cache.has(isbn)) {
			return this.cache.get(isbn);
		}

		const res = await this.sleep(2000, axios.get, getEnv('GOOGLE_BOOKS_URL'), {
			params: {
				key: getEnv('GOOGLE_API_KEY'),
				q: `isbn:${isbn}`,
			},
		});

		const thumbnailUrl = this.getThumbnailImage(res);
		const googleBooksUrl = this.getGoogleBooksUrl(res);
		const ret = {thumbnailUrl, googleBooksUrl};
		if (thumbnailUrl !== null && googleBooksUrl !== null) {
			this.cache.set(isbn, ret);
		}
		return ret;
	}

	private async timeout(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// eslint-disable-next-line max-len
	private async sleep(ms: number, fn: (...params: any) => Promise<any>, ...args: any): Promise<any> {
		await this.timeout(ms);
		return fn(...args);
	}

	private getThumbnailImage(res: any): string {
		return (
			_.get(
				res,
				'data.items[0].volumeInfo.imageLinks.thumbnail',
				_.get(
					res,
					'data.items[1].volumeInfo.imageLinks.thumbnail', null))
		);
	}

	private getGoogleBooksUrl(res: any): string {
		return (
			_.get(
				res,
				'data.items[0].volumeInfo.canonicalVolumeLink',
				_.get(
					res,
					'data.items[1].volumeInfo.infoLink', null))
		);
	}
}

import * as fs from 'fs';
import * as path from 'path';
import {parse} from 'csv-parse';
import axios from 'axios';
import _ from 'lodash';
import NodeCache from 'node-cache';

export default class BookGridService {

	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache({stdTTL: 86400});
	}

	public async getReadBookList(year: string): Promise<any []> {
		const fileName = path.join(
			__dirname, '../../res/goodreads_library_export.csv');
		// eslint-disable-next-line max-len
		const headers = ['Book Id', 'Title', 'Author', 'Author l-f', 'Additional Authors', 'ISBN', 'ISBN13', 'My Rating', 'Average Rating', 'Publisher', 'Binding', 'Number of Pages', 'Year Published', 'Original Publication Year', 'Date Read', 'Date Added', 'Bookshelves', 'Bookshelves with positions', 'Exclusive Shelf', 'My Review', 'Spoiler', 'Private Notes', 'Read Count', 'Owned Copies', 'Cover Art'];
		const parser = fs
			.createReadStream(fileName)
			.pipe(parse({
				delimiter: ',',
				from: 2,
				columns: headers,
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

	public async getBookThumbnailUrl(isbn: string): Promise<string | undefined> {
		const url = `https://www.googleapis.com/books/v1/volumes`;
		const key = 'AIzaSyD9PvKJYFp0YxcvOszMykAUgo58-x4VuJw';

		if (this.cache.has(isbn)) {
			return this.cache.get(isbn);
		}

		const res = await this.sleep(2000, axios.get, url, {
			params: {
				key,
				q: `isbn:${isbn}`,
			},
		});

		const thumbnail = this.getThumbnailImage(res);
		this.cache.set(isbn, thumbnail);
		return thumbnail;
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
		return _.get(
			res,
			'data.items[0].volumeInfo.imageLinks.thumbnail',
			_.get(
				res,
				'data.items[1].volumeInfo.imageLinks.thumbnail', ''));
	}
}

import * as fs from 'fs';
import * as path from 'path';
import {parse} from 'csv-parse';
import axios from 'axios';
import _ from 'lodash';

export default class BookGridService {
	public async getReadBookList(year: string) {
		const fileName = path.join(__dirname, '../../res/goodreads_library_export.csv');
		const headers = ['Book Id', 'Title', 'Author', 'Author l-f', 'Additional Authors', 'ISBN', 'ISBN13', 'My Rating', 'Average Rating', 'Publisher', 'Binding', 'Number of Pages', 'Year Published', 'Original Publication Year', 'Date Read', 'Date Added', 'Bookshelves', 'Bookshelves with positions', 'Exclusive Shelf', 'My Review', 'Spoiler', 'Private Notes', 'Read Count', 'Owned Copies'];
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
				const myRating = record['My Rating'];
				const title = record['Title'];
				result.push({isbn, myRating, title});
			}
		}
		return result;
	}

	public async getBookThumbnailUrl(isbn: string) {
		const url = `https://www.googleapis.com/books/v1/volumes`;

		const googleApiAsyncTask = this.getAsyncTask(
			5000,
			`volumes(${isbn})`,
			axios.get, {
			params: {
				key: 'AIzaSyD9PvKJYFp0YxcvOszMykAUgo58-x4VuJw',
				q: `isbn:${isbn}`,
			},
		});

		const res = await googleApiAsyncTask();

		let thumbnail = _.get(res,
			'data.items[0].volumeInfo.imageLinks.thumbnail',
			'');

		if (thumbnail === '') {
			thumbnail = _.get(res,
				'data.items[1].volumeInfo.imageLinks.thumbnail', '');
		}
		console.log(thumbnail);
		return thumbnail;
	}

	private getAsyncTask(time: number, taskName: string, proc: any, ...args: any) {
		return function timeOut() {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					proc(...args).then((res: any) => {
						console.log(`${taskName} done in ${time} ms`);
						resolve(res);
					}, (err: any) => {
						reject(err);
					});
				}, time);
			});
		};
	}
}

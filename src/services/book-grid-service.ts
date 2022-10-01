import * as fs from 'fs';
import * as path from 'path';
import {parse} from 'csv-parse';

export default class BookGridService {


	constructor() {
		console.log('BookGridService ctor');
	}

	public async getBookData(year: string) {
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
				let isbn = record['ISBN'].match(/[0-9]+/gm);
				if (isbn !== null) {
					isbn = isbn[0];
				}
				const myRating = record['My Rating'];
				const title = record['Title'];
				result.push({isbn, myRating, title});

				// console.log(`${JSON.stringify({
				// 	p: record['ISBN'],
				// 	q: record['Exclusive Shelf'],
				// 	isbn,
				// 	myRating,
				// 	title
				// })}\n`);
			}
			// await new Promise((resolve) => setTimeout(resolve, 100));
		}
		return result;
	}
}

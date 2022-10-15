import {Request, Response, Router} from 'express';
import StatusCodes from 'http-status-codes';
import BookGridService from '@services/book-grid-service';

// eslint-disable-next-line new-cap
const router = Router();
const {OK} = StatusCodes;

export const routes = {
	init: '/init',
	getReadBookList: '/readBookList/:year/:pageNumber/:resultsPerPage',
	getBookThumbnail: '/bookThumbnail/:isbn',
} as const;

const bookGridService = new BookGridService();

router.get(routes.init, async (request: Request, response: Response) => {
	const recordLength = await bookGridService.readData();
	return response
		.set('Access-Control-Allow-Origin', '*')
		.json({recordLength})
		.status(OK);
});

router.get(routes.getReadBookList, async (request: Request, response: Response) => {
	const {year, pageNumber, resultsPerPage} = request.params;
	const bookList = await bookGridService.getReadBookList(year, pageNumber, resultsPerPage);
	return response
		.set('Access-Control-Allow-Origin', '*')
		.json({bookList})
		.status(OK);
});

router.get(routes.getBookThumbnail, async (request: Request, response: Response) => {
	const {isbn} = request.params;
	const googleBookDetails = await bookGridService.getBookThumbnailUrl(isbn);
	return response
		.set('Access-Control-Allow-Origin', '*')
		.json({googleBookDetails})
		.status(OK);
});

export default router;

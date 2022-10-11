import {Request, Response, Router} from 'express';
import StatusCodes from 'http-status-codes';
import BookGridService from '@services/book-grid-service';

// eslint-disable-next-line new-cap
const router = Router();
const {OK} = StatusCodes;

export const routes = {
	getReadBookList: '/readBookList/:year',
	getBookThumbnail: '/bookThumbnail/:isbn',
} as const;

const bookGridService = new BookGridService();

// eslint-disable-next-line max-len
router.get(routes.getReadBookList, async (request: Request, response: Response) => {
	const {year} = request.params;
	const bookList = await bookGridService.getReadBookList(year);
	return response
		.set('Access-Control-Allow-Origin', '*')
		.json({bookList})
		.status(OK);
});

// eslint-disable-next-line max-len
router.get(routes.getBookThumbnail, async (request: Request, response: Response) => {
	const {isbn} = request.params;
	const googleBookDetails = await bookGridService.getBookThumbnailUrl(isbn);
	return response
		.set('Access-Control-Allow-Origin', '*')
		.json({googleBookDetails})
		.status(OK);
});

export default router;

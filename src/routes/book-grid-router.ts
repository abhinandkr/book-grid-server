import {Request, Response, Router} from 'express';
import StatusCodes from 'http-status-codes';
import BookGridService from '@services/book-grid-service';

// eslint-disable-next-line new-cap
const router = Router();
const {OK} = StatusCodes;

export const p = {
	get: '/bookData/:year',
} as const;[]

const bookGridService = new BookGridService();

router.get(p.get, async (request: Request, response: Response) => {
	const {year} = request.params;
	const bookArray = await bookGridService.getBookData(year);
	return response
		.set('Access-Control-Allow-Origin', 'http://localhost:3000')
		.json({bookArray})
		.status(OK);
});

export default router;

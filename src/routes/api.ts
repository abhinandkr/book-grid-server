import {Router} from 'express';
import bookGridRouter from '@routes/book-grid-router';

// Export the base-router
// eslint-disable-next-line new-cap
const baseRouter = Router();

// Setup routers
baseRouter.use('/bookGrid', bookGridRouter);

// Export default.
export default baseRouter;

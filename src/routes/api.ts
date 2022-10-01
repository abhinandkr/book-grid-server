import {Router} from 'express';
import bookGridRouter from '@routes/book-grid-router';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/bookGrid', bookGridRouter);

// Export default.
export default baseRouter;

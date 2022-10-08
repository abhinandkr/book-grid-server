import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import server from './server';
import {getEnv} from '@shared/functions';

// Constants
const serverStartMsg = 'Express server started on port: ';
const port = (parseInt(getEnv('PORT')!) || 4000);

// Start server
server.listen(port, () => {
	logger.info(serverStartMsg + port);
});

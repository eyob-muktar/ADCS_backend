require('express-async-errors');
const winston = require('winston');

module.exports = function () {
	// eslint-disable-next-line no-undef
	process.on('unhandledRejection', (ex) => {
		throw ex;
	});
    
	winston.exceptions.handle(
		new winston.transports.File({ filename: 'uncaughtExceptionLogger.log'})
	);    
	winston.format.colorize();
	winston.format.prettyPrint();
	winston.add( 
		new winston.transports.Console({ colorize:true, prettyPrint: true },
			new winston.transports.File({ filename: 'logger.log'})
		)
	);
   
};
   
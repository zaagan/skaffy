const chalk = require('chalk')
const boxen = require("boxen");
log = console.log;

const logSticker = (message) => {
	const msg = chalk.white.bold(message);
	const boxenOptions = {
		padding: 1,
		margin: 1,
		borderStyle: "round",
		borderColor: "green",
		backgroundColor: "#555555"
	};
	const msgBox = boxen(msg, boxenOptions);
	log(msgBox);
}

const logMessage = (message) => log(chalk.bold.whiteBright(message));

const logHint = (message) => log(chalk.bold.blue(message));

const logSuccess = (message) => log(chalk.bold.green(message));

const logError = (message) => log(chalk.bold.red(message));

const logWarning = (message) => {
	const warning = chalk.keyword('orange');
	log(warning(message));
}

const logHighlights = (message) => log(chalk.bold.yellowBright(message));


const logSamples = () => {
	log(chalk.blue('Hello world!'));
	log(chalk.blue.bgRed.bold('Hello world!'));

	// Pass in multiple arguments
	log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

	// Nest styles
	log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

	// Nest styles of the same type even (color, underline, background)
	log(chalk.green(
		'I am a green line ' +
		chalk.blue.underline.bold('with a blue substring') +
		' that becomes green again!'
	));

	// ES2015 template literal
	log(`
    CPU: ${chalk.red('90%')}
    RAM: ${chalk.green('40%')}
    DISK: ${chalk.yellow('70%')}
  `);

	// Use RGB colors in terminal emulators that support it.
	log(chalk.keyword('orange')('Yay for orange colored text!'));
	log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
	log(chalk.hex('#DEADED').bold('Bold gray!'));

	const error = chalk.bold.red;
	const warning = chalk.keyword('orange');

	log(error('Error!'));
	log(warning('Warning!'));
	const name = 'Sindre';
	log(chalk.green('Hello %s'), name);
}

exports.log = log;
exports.logMessage = logMessage;
exports.logHighlights = logHighlights;
exports.logHint = logHint;
exports.logError = logError;
exports.logSuccess = logSuccess;
exports.logWarning = logWarning;
exports.logSticker = logSticker;

// Usage:
// logger.logSuccess('Current working dir: ' + process.cwd());
// logger.logSuccess('Currently at: ' + __dirname);
// logger.logSuccess(process.env);
// chmod +x cli.js   

const chalk = require('chalk')
const yargs = require("yargs");
const fileHandler = require('./fileHandler')
const logger = require('./logger')
const prompt = require('prompt');

const initializeApp = (appName, appVersion) => {
	return initializeAppFormat1(appName, appVersion);
}
const {
	CONFIG_FILE_NAME
} = require('../config/defaults')


// https://github.com/yargs/yargs/blob/HEAD/docs/api.md
// https://www.npmjs.com/package/yargs

const initializeAppFormat1 = (appName, appVersion) => {
	let options = yargs
		.usage(chalk.bold.greenBright(`${appName} ${appVersion}`))
		.usage("A little scaffolding tool.")

		.option("c", { alias: "create", describe: "create template", type: "string", demandOption: false })

		.option("e", { alias: "edit", describe: "edit template", type: "string", demandOption: false })

		.option("d", { alias: "delete", describe: "delete template", type: "string", demandOption: false })

		.option("l", { alias: "list", describe: "list templates", type: "string", demandOption: false })

		.option("s", { alias: "show", describe: "show detail", type: "string", demandOption: false })

		.option("f", { alias: "fork", describe: "form template", type: "string", demandOption: false })

		.option("u", { alias: "use", describe: "use template", type: "string", demandOption: false })

		.option("i", { alias: "initialize", describe: "initailize the template folder with basic templates", type: "string", demandOption: false })

		.option("d", { alias: "destination", describe: "destination", type: "string", demandOption: false })

		.epilogue('for more information, find our manual at https://github.com/zaagan/skaffy')

		.argv;

	return options;

	
	// Output Format
	// skaffy 1.0.0
	// A little scaffolding tool.
	// Create template: -[c|e|d|s] -t <template-name>

	// Options:
	//       --help                 Show help                                 [boolean]
	//       --version              Show version number                       [boolean]
	//   -c, --create               create template                            [string]
	//   -e, --edit                 edit template                              [string]
	//   -d, --delete               delete template                            [string]
	//   -l, --list                 list templates                             [string]
	//   -s, --show                 show detail                                [string]
	//   -f, --fork                 form template                              [string]
	//   -t, --template             template name                              [string]
	//       --dest, --destination  destination                                [string]

}


// https://github.com/flatiron/prompt
// https://www.npmjs.com/package/prompt
// https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
const initializeTemplateDirectory = (default_template_path, envFilePath, env_variables = [], env_values = [], appName, onInitSuccess) => {

	prompt.message = chalk.bold.yellowBright(appName);
	// prompt.colors = false
	prompt.delimiter = ' → '

	const properties = [
		{
			message: chalk.bold.yellowBright('Where would you like to store your templates:'),
			name: 'templateDirectory',
			type: 'string',
			default: default_template_path,
			warning: 'Template directory is required.'
		}
	];

	prompt.start();

	prompt.get(properties, function (err, result) {
		if (err) { return onErr(err); }

		let newDir = result.templateDirectory;
		if (!newDir) {
			newDir = default_template_path;
		}

		if (!fileHandler.filePathExists(newDir)) {
			fileHandler.createDir(newDir);
		}
		let skaffyConfig = `${newDir}/${CONFIG_FILE_NAME}`;

		env_values.push(newDir);
		fileHandler.updateEnvVariables(envFilePath,
			env_variables, env_values, function () {
				logger.logHint(`Template Directory set to: ${newDir}`);

				if (onInitSuccess) {
					onInitSuccess(newDir)
				}
			})
	});

	function onErr(err) {
		logger.logError(err);
		return 1;
	}
}

exports.initializeApp = initializeApp;
exports.initializeTemplateDirectory = initializeTemplateDirectory;
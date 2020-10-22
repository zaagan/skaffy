#!/usr/bin/env node --no-warnings
require('dotenv').config({ path: __dirname + '/.env' })
// require('dotenv').config();
const { DEFAULT_TEMPLATE_DIR, ENV_VARIABLES, INIT_TYPE } = require('./config/defaults')
let templatesDir = process.env[DEFAULT_TEMPLATE_DIR]; // this is where skaffy templates are at
const { initializeApp, initializeTemplateDirectory } = require('./helper/initializer')

const actions = require('./actions');
const logger = require('./helper/logger')
const fileHandler = require('./helper/fileHandler')
const envFullPath = __dirname + '/.env';
const yargs = require("yargs");
const package = require(__dirname + '/package.json');
const default_template_path = fileHandler.defaultSavePath();
const appName = package.name; // 'skaffy';
const appVersion = package.version;
const workingDir = __dirname;

const [, , ...args] = process.argv

let options = initializeApp(appName, appVersion);

if (!templatesDir) { // [ Initialize template directory ] 
	initializeTemplateDirectory(default_template_path, envFullPath, ENV_VARIABLES, [], appName, function (newPath) {
		options.initialize = INIT_TYPE.NEW
		templatesDir = newPath
		executeCommand();
	});
} else {
	executeCommand();
}

function executeCommand() {
	let config = {
		templatesDir: templatesDir,
		workingDir: __dirname
	};

	if (options.use) actions.useTemplate(options, args, config);

	else if (options.create) actions.createTemplate(options, args);

	else if (options.edit) actions.editTemplate(options, args);

	else if (options.delete) actions.deleteTemplate(options, args);

	else if (options.list) actions.listTemplates(options, args, config);

	else if (options.show) actions.showTemplate(options, args);

	else if (options.fork) actions.forkTemplate(options, args);

	else if (options.initialize) actions.initializeTemplates(options, args, config);

	else yargs.showHelp();
}

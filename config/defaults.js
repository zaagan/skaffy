const CONFIG_FILE_NAME = "skaffy.json";
const TEMPLATE_CONFIG_FILE = "template.json";
const DEFAULT_TEMPLATE_DIR = 'skaffy_templates';

const ENV_VARIABLES = [
	DEFAULT_TEMPLATE_DIR
];
const LIST_TYPE_ALL = 1
const LIST_TYPE_FILE = 2
const LIST_TYPE_DIR = 3

const DEFAULT_FILE_CONFIG = {
	print: true,
	gap: '',
	listType: LIST_TYPE_ALL,
	preScan: true,
	onlyRoot: false
};

const SOURCE_TYPE = {
	folder: 'folder', // Looks for template files in  the template folder
	config: 'config' // Looks for template in the structure.json file
}

const STRUCTURE_TYPE = {
	LINEAR: 'linear',
	hybrid: 'hybrid'
}

const INIT_TYPE = {
	NEW: 'new',
	RESET: 'reset'
};

exports.INIT_TYPE = INIT_TYPE;
exports.SOURCE_TYPE = SOURCE_TYPE;
exports.TEMPLATE_CONFIG_FILE = TEMPLATE_CONFIG_FILE;
exports.CONFIG_FILE_NAME = CONFIG_FILE_NAME;
exports.DEFAULT_TEMPLATE_DIR = DEFAULT_TEMPLATE_DIR;
exports.ENV_VARIABLES = ENV_VARIABLES;
exports.LIST_TYPE_ALL = LIST_TYPE_ALL;
exports.LIST_TYPE_FILE = LIST_TYPE_FILE;
exports.LIST_TYPE_DIR = LIST_TYPE_DIR;
exports.DEFAULT_FILE_CONFIG = DEFAULT_FILE_CONFIG
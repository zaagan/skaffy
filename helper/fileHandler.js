const { create } = require('domain');
const fs = require('fs');
const { formatWithOptions } = require('util');
const ncp = require('ncp').ncp;
const path = require('path')
const logger = require('./logger')
const {
	DEFAULT_FILE_CONFIG,
	LIST_TYPE_ALL,
	LIST_TYPE_FILE,
	LIST_TYPE_DIR
} = require('../config/defaults')


const defaultSavePath = () => {
	let home = require("os").homedir();
	let default_template_dir = 'skaffy_templates';
	return `${home}/${default_template_dir}/`;
}

const createDir = (fullDirPath) => {
	fs.mkdirSync(fullDirPath, { recursive: true }, (error) => {
		if (error) {
			logger.logError(error);
		} else {
			logger.logSuccess(`directory intialized: ${fullDirPath}`);
		}
	})
}

// https://github.com/AvianFlu/ncp
const copyAll = (sourceDir, destinationDir, onSuccess) => {
	ncp(sourceDir, destinationDir, function (err) {
		if (err) {
			return logger.log(err);
		}
	});
	if (onSuccess) onSuccess();
}

const clearDirectory = (dirPath, onSuccess) => {
	fs.rmdir(dirPath, { recursive: true }, (error) => {
		if (error) {
			logger.logError(error);
		}

		if (onSuccess) {
			onSuccess();
		}
	});
}


const listFiles = (dir, filelist, config = DEFAULT_FILE_CONFIG) => {
	let { gap, preScan, listType, onlyRoot, print: printLog } = config;

	let files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function (file) {

		let filePath = dir + '/' + file;

		if (fs.statSync(filePath).isDirectory()) {

			if (listType === LIST_TYPE_ALL || listType === LIST_TYPE_DIR) {
				if (printLog) {
					dirPath = filePath
					if (preScan) {
						dirPath = filePath.match(/([^\/]*)\/*$/)[1]
					}
					logger.logSuccess(`${gap}└── ${dirPath}`)
				}
				filelist.push({ name: file, type: 'dir', dir: dir });
			}

			let newConfig = {
				...config,
				gap: config.gap + '  ',
				preScan: false
			};

			if (!onlyRoot) {
				filelist = listFiles(filePath + '/', filelist, newConfig);
			}
		}
		else {
			if (listType === LIST_TYPE_ALL || listType === LIST_TYPE_FILE) {
				if (printLog) {
					logger.logSuccess(`${gap}├── ${file}`)
				}
				filelist.push({ name: file, type: 'file', dir: dir });
			}
		}
	});
	return filelist;
};


const readFileStream = (filePath, onSuccess) => {
	var readStream = fs.createReadStream(filePath, 'utf8');

	let data = '';
	readStream.on('data', function (chunk) {
		data += chunk;
	}).on('end', function () {
		onSuccess(data)
	});
}

const readFileContent = (path, onSuccess) => {
	let fileData = ''
	fs.readFile(path, 'utf8', (err, data) => {
		if (err) {
			logger.logError(err);
			logger.logHint(path);
			return
		}
		onSuccess(data);
		fileData = data
		return data
	})
	return fileData
}


const createFile = (filePath, fileContent, successCallback) => {
	var getDirName = path.dirname
	let fileDirPath = getDirName(filePath)
	if (!filePathExists(fileDirPath)) {
		createDir(getDirName(fileDirPath))
	}

	fs.writeFile(filePath, fileContent, (error) => {
		if (error) {
			logger.logError(error);
		} else {
			if (successCallback)
				successCallback();
			else
				logger.logSuccess(`file created: ${filePath}`);
		}
	})
}

const filePathExists = (path) => {
	return fs.existsSync(path);
}

const updateEnvVariables = (envFullPath, variables, values, successCallback) => {
	var envContents = [];
	if (variables) {
		for (let i = 0; i < variables.length; i++) {
			envContents.push(variables[i] + '=' + values[i]);
		}
		createFile(envFullPath, envContents.join('\n'), successCallback);
	}
}


exports.listFiles = listFiles;
exports.clearDirectory = clearDirectory;
exports.copyAll = copyAll;
exports.readFileStream = readFileStream;
exports.readFileContent = readFileContent;
exports.defaultSavePath = defaultSavePath;
exports.updateEnvVariables = updateEnvVariables;
exports.filePathExists = filePathExists;
exports.createDir = createDir;
exports.createFile = createFile;
const fileHandler = require('../helper/fileHandler')
const prompt = require('prompt')
const chalk = require('chalk')

const logger = require('../helper/logger')
const path = require('path')
const { TEMPLATE_CONFIG_FILE, LIST_TYPE_ALL, DEFAULT_FILE_CONFIG } = require('../config/defaults')
const { HELP, H } = require('../config/keys')
const chartTable = require('terminal-char-table');
const { replaceKeys, replaceContent } = require('../helper/utils')
const { BackgroundColor } = require('chalk')

const displayHelp = () => {
  logger.logHint('syntax:')
  logger.logSuccess('skaffy [-s|--show] [<template-name> | (h)elp]')
}

const showTemplate = (options, args, data) => {
  if (options.show == HELP || options.show == H) {
    displayHelp();
    return;
  }

  let destinationPath = path.resolve('');
  if (options.destination) {
    destinationPath = path.resolve(options.destination);
  }

  let templatesPath = data.templatesDir;
  let config = DEFAULT_FILE_CONFIG;
  config.listType = LIST_TYPE_ALL;
  config.print = false;

  let templateName = options.show;
  let templatePath = path.join(templatesPath, templateName);

  if (fileHandler.filePathExists(templatePath)) {
    let configFilePath = path.join(templatePath, TEMPLATE_CONFIG_FILE);
    // Check if template.json exists
    if (fileHandler.filePathExists(configFilePath)) {
      fileHandler.readFileContent(configFilePath, function (rawData) {
        // logger.logMessage(rawData)
        let configData = JSON.parse(rawData);
        invokeTemplate(configData);
      });
    } else {
      logger.logError(`template.json file not found at path ${templatePath}`)
    }

  }
  else {
    logger.logError(`Invalid template name. Unable to locate the template in ${templatePath}`)
    logger.logHint("Try 'skaffy --list t' to list the available templates.")
  }

  function invokeTemplate(configData) {
    let keys = configData['keys'];

    logger.logHint('**** Test mode ****');
    // Ask questions  to the user :
    prompt.message = chalk.bold.yellowBright('skaffy');
    prompt.delimiter = ' → '
    prompt.start();
    prompt.get(keys, function (err, result) {
      if (err) { return onErr(err); }
      implementPromptParams(configData, result);
    });

    function onErr(err) {
      logger.logError(err);
      return 1;
    }
  }

  function implementPromptParams(configData, keyValues) {
    let preDelimeter = configData['pre-delimeter'];
    let postDelimeter = configData['post-delimeter'];
    let table = new chartTable();

    table.append(['template name', configData['name']]);

    if (configData['tags']) table.append(['tags', configData['tags'].join()]);

    if (configData['description']) table.append(['description', configData['description']]);

    if (configData['source']) table.append(['source type', configData['source']]);

    if (configData['keys']) {
      table.append(['keys', '']);
      let keys = configData['keys'];

      for (const key of keys) {
        let keyData = `${preDelimeter}${key['name']}${postDelimeter}`;
        if (key['required']) {
          keyData += ' | required';
        }
        table.append([key['kid'] ? key['kid'] : '', keyData]);
      }
    }

    if (configData['structure']) {
      table.append(['structure', '']);

      let fileStructure = configData['structure'];
      for (let index = 0; index < fileStructure.length; index++) {
        let fileFolderPath = fileStructure[index];
        let newPath = path.join(destinationPath, fileFolderPath)
        let replacedPath = replaceKeys(preDelimeter, postDelimeter, keyValues, newPath)

        if (!fileHandler.filePathExists(replacedPath)) {
          let lastChar = replacedPath.charAt(replacedPath.length - 1);
          if (lastChar === '/') {
            table.append(['', `${replacedPath}    (dir)`]);
          } else {
            table.append(['', `${replacedPath}    (file)`]);
          }
        }
      }
    }

    let totalFiles = []
    fileHandler.listFiles(templatePath, totalFiles, config);
    let filteredFiles = totalFiles.filter(x => x.name !== TEMPLATE_CONFIG_FILE)

    if (filteredFiles && filteredFiles.length > 0) {
      table.append(['user definitions', '']);

      for (let index = 0; index < filteredFiles.length; index++) {
        let element = filteredFiles[index];
        let templateFileDirectory = element.dir;

        let subPath = templateFileDirectory.replace(templatePath, '')
        let newPath = path.join(destinationPath, subPath, element.name)
        let replacedPath = replaceKeys(preDelimeter, postDelimeter, keyValues, newPath)
        let originalFilePath = path.join(templateFileDirectory, element.name);

        let newFilePath = replacedPath;

        if (element.type === 'dir') {
          table.append(['', `${newFilePath}    (dir)`]);
        } else {
          if (fileHandler.filePathExists(originalFilePath)) {
            let newReplacedPath = replaceKeys(preDelimeter, postDelimeter, keyValues, newFilePath)

            fileHandler.readFileContent(originalFilePath, function (readContent) {
              let replacedContent = replaceContent(preDelimeter, postDelimeter, keyValues, readContent)

              console.log('')
              console.log('')
              logger.logHint('    ' + newReplacedPath);

              logger.logSticker(replacedContent, {
                margin: 0,
                borderStyle: 'classic',
                borderColor: 'green',
                backgroundColor: 'black'

              });
            })

          } else {
            logger.logError(`Invalid file path. ${originalFilePath}`);
          }
        }
      }
    }

    console.log(table.string(1));
  }
}

module.exports = showTemplate; 
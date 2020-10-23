const fileHandler = require('../helper/fileHandler')
const prompt = require('prompt')
const chalk = require('chalk')
const logger = require('../helper/logger')
const path = require('path')
const { TEMPLATE_CONFIG_FILE, DEFAULT_FILE_CONFIG, LIST_TYPE_ALL, SOURCE_TYPE } = require('../config/defaults')
const { HELP, H } = require('../config/keys')
const { replaceKeys, replaceContent } = require('../helper/utils')

// http://yargs.js.org/
// https://www.codota.com/code/javascript/functions/yargs/Argv/command

const displayHelp = () => {
  logger.logHint('syntax:')
  logger.logSuccess('skaffy -u [template-name] [-d <destination-path>]')
}

const useTemplate = (options, args, data) => {
  if (options.use == HELP || options.use == H) {
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

  let templateName = options.use;
  let templatePath = path.join(templatesPath, templateName);

  // Check if  template folder exists
  if (fileHandler.filePathExists(templatePath)) {

    let configFilePath = path.join(templatePath, TEMPLATE_CONFIG_FILE);
    // Check if  template.json exists
    if (fileHandler.filePathExists(configFilePath)) {
      fileHandler.readFileContent(configFilePath, function (rawData) {
        // logger.logMessage(rawData)
        let configData = JSON.parse(rawData);
        invokeTemplate(configData);
      });
    } else {
      logger.logError(`template.json file not found at path ${templatePath}`)
    }
  } else {
    logger.logError(`Invalid template name. Unable to locate the template in ${templatePath}`)
    logger.logHint("Try 'skaffy --list t' to list the available templates.")
  }

  function invokeTemplate(configData) {
    let keys = configData['keys'];
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

  // Implement the arguments passed by the user and deploy template
  function implementPromptParams(configData, keyValues) {
    let preDelimeter = configData['pre-delimeter'];
    let postDelimeter = configData['post-delimeter'];

    let fileStructure = configData['structure'];
    if (fileStructure && fileStructure.length > 0) {
      for (let index = 0; index < fileStructure.length; index++) {
        let fileFolderPath = fileStructure[index];
        let newPath = path.join(destinationPath, fileFolderPath)
        let replacedPath = replaceKeys(preDelimeter, postDelimeter, keyValues, newPath)

        if (!fileHandler.filePathExists(replacedPath)) {
          let lastChar = replacedPath.charAt(replacedPath.length - 1);
          if (lastChar === '/') {
            fileHandler.createDir(replacedPath)
          } else {
            fileHandler.createFile(replacedPath, '', function () { })
          }
        }
      }
    }

    let totalFiles = []
    fileHandler.listFiles(templatePath, totalFiles, config);

    let filteredFiles = totalFiles.filter(x => x.name !== TEMPLATE_CONFIG_FILE)

    if (filteredFiles && filteredFiles.length > 0) {

      for (let index = 0; index < filteredFiles.length; index++) {
        let element = filteredFiles[index];
        let templateFileDirectory = element.dir;

        let subPath = templateFileDirectory.replace(templatePath, '')
        let newPath = path.join(destinationPath, subPath, element.name)
        let replacedPath = replaceKeys(preDelimeter, postDelimeter, keyValues, newPath)
        let originalFilePath = path.join(templateFileDirectory, element.name);

        let fullFilePath = path.join(templateFileDirectory, element.name);
        let newFilePath = replacedPath;

        if (element.type === 'dir') {
          fileHandler.createDir(newFilePath)
        } else {

          if (fileHandler.filePathExists(originalFilePath)) {
            let newReplacedPath = replaceKeys(preDelimeter, postDelimeter, keyValues, newFilePath)

            fileHandler.readFileContent(originalFilePath, function (readContent) {
              let replacedContent = replaceContent(preDelimeter, postDelimeter, keyValues, readContent)
              fileHandler.createFile(newReplacedPath, replacedContent, function () { });
            })
          } else {
            logger.logError(`Invalid file path. ${originalFilePath}`);
          }
        }

      }
    }
    logger.logHint('Template deployed.')
  }
}

module.exports = useTemplate
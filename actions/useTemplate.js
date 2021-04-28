const fileHandler = require('../helper/fileHandler')
const prompt = require('prompt')
const chalk = require('chalk')
const logger = require('../helper/logger')
const path = require('path')
const { INCLUDE_DIR, TEMPLATE_CONFIG_FILE, DEFAULT_FILE_CONFIG, LIST_TYPE_ALL, SOURCE_TYPE, NEW_LINE } = require('../config/defaults')
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

  // Check if template folder exists
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

    // Deploy file structure
    let fileStructure = configData['structure'];
    // fileStructure = []

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

    // Deploy template files
    let totalFiles = []
    fileHandler.listFiles(templatePath, totalFiles, config);

    let filteredFiles = totalFiles.filter(x => (x.name !== TEMPLATE_CONFIG_FILE))

    filteredFiles = filteredFiles.filter(x => (x.name !== INCLUDE_DIR))
    for (let index = 0; index < filteredFiles.length; index++) {
      console.log(filteredFiles[index].name);
    }
    // filteredFiles = []

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

    // Include content 
    let includeContent = configData['include'];
    if (includeContent && includeContent.length > 0) {
      for (let index = 0; index < includeContent.length; index++) {
        let includeItem = includeContent[index];

        if (isIncludeItemValid(includeItem)) {
          let disabled = includeItem.disabled ? true : false;

          if (!disabled) {

            let onFilePath = includeItem.onFile;
            let contentFile = includeItem.content;
            let newLine = includeItem.newLine;

            let onFileFullPath = path.join(destinationPath, onFilePath)
            let onFileReplacedContent = replaceKeys(preDelimeter, postDelimeter, keyValues, onFileFullPath)
            let contentFullPath = path.join(templatePath, 'include', contentFile);
            contentFullPath = replaceKeys(preDelimeter, postDelimeter, keyValues, contentFullPath);


            if (!fileHandler.filePathExists(onFileReplacedContent)) {
              logger.logError(`The specified content file does not exist -> ${onFileReplacedContent}.`);
              continue;
            }
            if (!fileHandler.filePathExists(contentFullPath)) {
              logger.logError(`The specified content file does not exist -> ${contentFullPath}.`);
              continue;
            }

            // Append content from this file > > > 
            fileHandler.readFileContent(contentFullPath, function (includeContent) {

              // To This file > >
              fileHandler.readFileContent(onFileReplacedContent, function (fileContent) {
                // logger.logHint('To Replace content on :')
                // console.log(fileContent);
                // Replace types : after | before | between
                // occurance : first | last start | end | n
                var keyword = getKeyword(includeItem, fileContent);
                var keywordLength = keyword.length;
                var indexes = getKeywordIndices(includeItem, fileContent);
                var occurance = getOccuranceOf(includeItem);

                if (indexes && indexes.length > 0) {

                  var totalOccurances = indexes.length;
                  let replacePoint = indexes[totalOccurances - 1];
                  // if (replaceAfterOccurance == 'start') replacePoint = 0;
                  if (occurance == 'first') replacePoint = indexes[0];
                  if (occurance == 'last') replacePoint = indexes[totalOccurances - 1];
                  if (occurance && isNumeric(occurance)) {
                    let occuranceNum = parseInt(occurance)
                    replacePoint = indexes[occuranceNum - 1];
                  }

                  // CONTENT TO APPEND
                  let contentToAppend = '';
                  contentToAppend += keyword;
                  if (newLine) contentToAppend += NEW_LINE;
                  contentToAppend += includeContent;
                  if (newLine) contentToAppend += NEW_LINE;

                  // PERFORM REPLACE

                  let fullModifiedContent = ''
                  if (includeItem.after) {
                    let contentAfterIndex = fileContent.substr(replacePoint + keywordLength, fileContent.length)
                    let newContent = fileContent.substr(0, replacePoint) + contentToAppend + contentAfterIndex;
                    fullModifiedContent = replaceContent(preDelimeter, postDelimeter, keyValues, newContent)
                  }

                  if (includeItem.before) {
                    let contentBeforeIndex = fileContent.substr(0, replacePoint - 1);
                    let newContent = contentBeforeIndex + contentToAppend + fileContent.substr(replacePoint + keywordLength, fileContent.length);
                    // let newContent = fileContent.substr(0, replacePoint) + contentToAppend + contentAfterIndex;
                    fullModifiedContent = replaceContent(preDelimeter, postDelimeter, keyValues, newContent)
                  }

                  logger.logSticker(fullModifiedContent, {
                    margin: 0,
                    borderStyle: 'classic',
                    borderColor: 'green',
                    backgroundColor: 'black'
                  });

                  fileHandler.createFile(onFileReplacedContent, fullModifiedContent, function () {

                    logger.logHighlights(`Content written to ${onFileReplacedContent} with ${includeItem.content}`);

                  });
                }
              });

            });
          } else {
            logger.logWarning(`${includeItem.content} was skipped because it was disabled.`);
          }


        } else {
          logger.logError(`Invalid include configuration at ${index} on item ${JSON.parse(includeItem)}`);
        }


      }
    }


    function getKeyword(includeItem) {
      let keyword = '';
      if (includeItem.after) keyword = includeItem.after.keyword;
      if (includeItem.before) keyword = includeItem.before.keyword;
      return keyword;
    }

    function getKeywordIndices(includeItem, fileContent) {
      let keyword = getKeyword(includeItem);
      var indexes = [];
      indexes = getIndicesOf(keyword, fileContent);
      return indexes;
    }

    function getOccuranceOf(includeItem) {
      let occurance = '';
      if (includeItem.after) occurance = includeItem.after.occurance;
      if (includeItem.before) occurance = includeItem.before.occurance;
      return occurance;
    }


    function isNumeric(str) {
      if (typeof str != "string") return false;
      return !isNaN(str) && !isNaN(parseFloat(str))
    }

    function isIncludeItemValid(includeItem) {
      return (includeItem && includeItem.onFile && includeItem.content &&
        (includeItem.after || includeItem.before || includeItem.between));
    }

    function getIndicesOf(searchStr, str, caseSensitive) {
      var searchStrLen = searchStr.length;
      if (searchStrLen == 0) {
        return [];
      }
      var startIndex = 0, index, indices = [];
      if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
      }
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
      }
      return indices;
    }


    logger.logHint('Template deployed.')
  }
}

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

module.exports = useTemplate
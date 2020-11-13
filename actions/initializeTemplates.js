
const fileHandler = require('../helper/fileHandler')
const logger = require('../helper/logger')
const path = require('path')
const {
  CONFIG_FILE_NAME,
  INIT_TYPE,
  DEFAULT_FILE_CONFIG,
  LIST_TYPE_DIR
 } = require('../config/defaults')

const { HELP, H, NEW, RESET, CLEAR } = require('../config/keys')
const {
  MSG_INVALID_COMMAND,
  MSG_INIT_SUCCESS,
  MSG_TEMPLATE_DIR_NOT_FOUND,
  MSG_TEMPLATE_DIR_RESET,
  MSG_TEMPLATE_DIR_CLEARED
} = require('../config/messages')
const { SSL_OP_EPHEMERAL_RSA } = require('constants')

const displayHelp = () => {
  logger.logMessage('syntax:')
  logger.logSuccess('skaffy -i [new|clear|reset]')
  logger.logSuccess('new : initializes template directory and deploys pre-existing templates.')
  logger.logSuccess('clear : clears the template directory.')
  logger.logSuccess('reset : clears and re-deployes template to template directory.')
}

const initializeTemplates = (options, args, data) => {
  if (options.initialize == HELP || options.initialize == H) {
    displayHelp();
    return;
  }

  if (options.initialize == NEW) {

    if (!data || !data.templatesDir) {
      logger.logError(MSG_TEMPLATE_DIR_NOT_FOUND)
      return;
    }

    var configFilePath = path.join(data.templatesDir, CONFIG_FILE_NAME);
    if (fileHandler.filePathExists(configFilePath)) {
      logger.logWarning('Already initialized.')
      return;
    }

    if (!fileHandler.filePathExists(data.templatesDir)) {
      fileHandler.createDir(data.templatesDir)
    }

    // COPY from samples >> template root directory
    let samplesTemplatesDir = path.join(__dirname, '../samples/');
    fileHandler.copyAll(samplesTemplatesDir, data.templatesDir, function () {

      logger.logMessage(`Scanning: ${data.templatesDir}`)
      let totalFiles = []
      fileHandler.listFiles(data.templatesDir, totalFiles);
      logger.logSuccess(MSG_INIT_SUCCESS)
    })

  }
  else if (options.initialize == CLEAR) {
    if (!data || !data.templatesDir) {
      logger.logError(MSG_TEMPLATE_DIR_NOT_FOUND)
      return;
    }
    fileHandler.clearDirectory(data.templatesDir);

    logger.logSuccess(MSG_TEMPLATE_DIR_CLEARED)
  }
   else if (options.initialize == RESET) {
    options.initialize = CLEAR
    initializeTemplates(options, args, data)

    options.initialize = NEW
    initializeTemplates(options, args , data)

  } else {
    logger.logMessage(MSG_INVALID_COMMAND)
  }
}

module.exports = initializeTemplates; 
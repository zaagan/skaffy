const fileHandler = require('../helper/fileHandler')
const logger = require('../helper/logger')
const path = require('path')
const {
  CONFIG_FILE_NAME,
  DEFAULT_FILE_CONFIG,
  LIST_TYPE_ALL,
  LIST_TYPE_DIR,
  LIST_TYPE_FILE,
} = require('../config/defaults')

const {
  A,
  ALL,
  TEMPLATES,
  TEMPLATE,
  T,
  FILES,
  F,
  HELP,
  H
} = require('../config/keys')

const displayHelp = () => {
  logger.logHint('syntax:')
  logger.logSuccess('skaffy [-l|--list] [(a)ll | (t)emplates | (f)iles | (h)elp]')
}

const listTemplates = (options, args, data) => {
  if (options.list == HELP || options.list == H) {
    displayHelp();
    return;
  }

  let config = DEFAULT_FILE_CONFIG;
  config.listType = LIST_TYPE_DIR;

  if (options.list == ALL || options.list == A) {
    config.listType = LIST_TYPE_ALL;
  }

  else if (options.list == TEMPLATE || options.list == TEMPLATES || options.list == T) {
    config.listType = LIST_TYPE_DIR;
    config.onlyRoot = true;
  }

  else if (options.list == FILES || options.list == F) {
    config.listType = LIST_TYPE_FILE;
  }

  let totalFiles = []
  fileHandler.listFiles(data.templatesDir, totalFiles, config);

  logger.logHighlights('END')
}

module.exports = listTemplates; 
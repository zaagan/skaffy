const fileHandler = require('../helper/fileHandler')
const logger = require('../helper/logger')
const path = require('path')
const {
  CONFIG_FILE_NAME
} = require('../config/defaults')


const showTemplate = (options, args, data) => {
  console.log('[TODO]: Show template')

  logger.logHighlights('END')
}

module.exports = showTemplate; 
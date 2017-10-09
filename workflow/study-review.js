const common = require('./review/common')
const secretariat = require('./review/secretariat')
const reviewer = require('./review/reviewer')
const chairman = require('./review/chairman')

module.exports = Object.assign({}, common, secretariat, reviewer, chairman);
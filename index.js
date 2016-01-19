var resolveCollection = require('./resolveCollection')

module.exports = function () {
	var path = process.env.RUNNER_CLI_ITEMS_FILEPATH
	var key = process.env.RUNNER_CLI_CURRENT_KEY
	var args = process.env.RUNNER_CLI_ARGS.split(' ')

	if (path) {
		return resolveCollection(path, args)[key]
	} else {
		throw new Error('Runner not currently running')
	}
}
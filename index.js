module.exports = function () {
	var path = process.env.RUNNER_CLI_CURRENT_ITEMS_FILEPATH
	var key = process.env.RUNNER_CLI_CURRENT_KEY

	if (path) {
		return require(path)[key]
	} else {
		throw new Error('Runner not currently running')
	}
}
#!/usr/bin/env node

var args = process.argv
var dataPath = args[2]
var command = args[3]
var key = args[4]
var spawn = require('./spawn')

if (!command) {
	console.error('Please specify a command')
	return
}

var path = require('path')

var itemsPath = path.resolve(process.cwd(), dataPath)
var items = require(itemsPath)

var keys = Object.keys(items)

if (!Array.isArray(keys)) {
	console.error('Data at ', dataPath, 'Must be an array or an object')
	return
}

var promise

if (key !== 'all') {
	var obj = key && items[key]
	if (obj == undefined) {
		console.log(`${key ? `The key '${key}' isn't defined in ${dataPath}` : 'Please provide a key as the last argument'}. Use '${keys.join(`', '`)}' to run a single one, or 'all' to iterate over all of them.`)
		if (!key) {
			console.log(`The list of keys is based on ${dataPath}`)
		}
		promise = Promise.resolve()
	} else {
		promise = goSerial(command, [key])
	}
} else {
	promise = goSerial(command, keys)
}

promise
.catch(error => {
	console.error(error)
})
.then(function (code) {
	process.exit(code)
})

// Utils

function goParallel(command, keys) {
	var promises = []
	for (var i = 0; i < keys.length; ++i) {
		promises.push(runCommand(command, keys[i]))
	}

	return Promise.all(promises).then(codes => {
		for (var code of codes) {
			if (code > 0) return code
		}
		return 0
	})
}

function goSerial(command, keys, i) {
	i = i || 0
	if (i >= keys.length) return

	var key = keys[i]
	
	return runCommand(command, key).then(function (code) {
		return goSerial(command, keys, i + 1) || Promise.resolve(code)
	})
}

function runCommand(command, key) {
	console.log(`-> Running key '${key}'`)
	return spawn(command, {
		RUNNER_CLI_CURRENT_ITEMS_FILEPATH: itemsPath,
		RUNNER_CLI_CURRENT_KEY: key
	})
}
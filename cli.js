#!/usr/bin/env node

var resolveCollection = require('./resolveCollection')
var path = require('path')
var spawn = require('./spawn')

var args = process.argv
var dataPath = args[2]
var command = args[3]
var userArgs = args.slice(4)

if (!command) {
	console.error('Please specify a command')
	return
}

var itemsPath = path.resolve(process.cwd(), dataPath)
var items = resolveCollection(itemsPath, userArgs)

if (!items) return

var keys = Object.keys(items)

goSerial(command, keys)
	.catch(error => {
		console.error(error)
	})
	.then(function (code) {
		process.exit(code)
	})

// Utils

// This works, but we need to figure out the UI for it
// function goParallel(command, keys) {
// 	var promises = []
// 	for (var i = 0; i < keys.length; ++i) {
// 		promises.push(runCommand(command, keys[i]))
// 	}

// 	return Promise.all(promises).then(codes => {
// 		for (var code of codes) {
// 			if (code > 0) return code
// 		}
// 		return 0
// 	})
// }

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
		RUNNER_CLI_ITEMS_FILEPATH: itemsPath,
		RUNNER_CLI_ARGS: userArgs.join(' '),
		RUNNER_CLI_CURRENT_KEY: key
	})
}
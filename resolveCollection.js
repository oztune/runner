module.exports = function resolveCollection (configFilePath, args) {
	var obj = require(configFilePath)
	var fn

	if (typeof obj === 'function') {
		fn = obj
	} else {
		fn = defaultFunc.bind(null, obj, configFilePath)
	}

	return fn(args)
}

function defaultFunc (collection, dataPath, args) {
	var key = args[0]

	var keys = Object.keys(collection)

	if (!Array.isArray(keys)) {
		console.error('Data at ', dataPath, 'Must be an array or an object')
		return
	}

	if (key === 'all') return collection

	var obj = key && collection[key]
	if (obj == undefined) {
		console.log(`${key ? `The key '${key}' isn't defined in ${dataPath}` : 'Please provide a key as the last argument'}. Use '${keys.join(`', '`)}' to run a single one, or 'all' to iterate over all of them.`)
		if (!key) {
			console.log(`The list of keys is based on ${dataPath}`)
		}

		return null
	}
	
	return { [key]: obj }
}
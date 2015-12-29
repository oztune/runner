var spawn = require('child_process').spawn;

module.exports = function (command, env) {
	env = Object.assign({}, process.env, env)
	var parts = command.split(' ')
	return new Promise(function (resolve) {
		var c = spawn('sh', ['-c', command], { env, stdio: 'inherit' });
		c.on('close', function (code) {
			resolve(code)
		})
	})
}
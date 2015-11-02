'use strict';

var helpers = require('./connections_helpers');
var internal = {};

var PUBLIC_NAMES = ['getOne', 'getItems', 'findByEmail', 'findByAccountId'];

module.exports = function connectionsCreator(appId) {
	var connections = {};

	Object.keys(helpers).forEach(function(key) {
		var fn = helpers[key];
		if (~PUBLIC_NAMES.indexOf(key)) {
			connections[key] = internal.bindFunction(appId, fn);
		}
	});

	return connections;
};

internal.bindFunction = function bindFunction(appId, fn) {
	return function() {
		var params = Array.prototype.slice.call(arguments);
		params = [appId].concat(params);
		return fn.apply(null, params);
	};
};

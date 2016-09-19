'use strict';

var utils = require('./utils');
var Promise = utils.Promise;

exports.create = function create() {
	return new Promise(function(resolve) {
		resolve(utils.uuid());
	});
};

'use strict';

var utils = require('../utils');
var _ = utils._;
var accounts = require('./accounts');
var connections = require('./connections');

module.exports = function apiCreator(appId) {
	if (!appId || !_.isString(appId) || appId.length !== 24) {
		throw new Error('Invalid app id');
	}

	appId = appId.toLowerCase();

	var api = {
		accounts: accounts(appId),
		connections: connections(appId)
	};

	return api;
};

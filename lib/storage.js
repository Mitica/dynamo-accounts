'use strict';

var utils = require('./utils');
var Promise = utils.Promise;
var AccessService = require('./access_service');
var ControlService = require('./control_service');
var config = require('./config');

module.exports = function createStorage(configOptions) {
	if (configOptions) {
		config(configOptions);
	}

	var access = new AccessService();
	var control = new ControlService();

	var storage = {
		// DB admin
		admin: {
			sync: function() {
				return require('./db/create_tables')();
			},
			drop: function(secret) {
				return require('./db/delete_tables')(secret);
			}
		},
		// apps API
		apps: {
			create: function(data) {
				return Promise.resolve(data);
			},
			getById: function(id) {
				return Promise.resolve({ id: id });
			}
		},
		// users API
		users: {
			create: function(appId, data) {
				return control.createUser(appId, data);
			},
			update: function(appId, data) {
				return control.updateUser(appId, data);
			},
			getById: function(appId, id) {
				return access.getUser(appId, id);
			}
		},
		// identities API
		identities: {
			create: function(appId, data) {
				return control.createIdentity(appId, data);
			},
			update: function(appId, data) {
				return control.updateIdentity(appId, data);
			},
			getById: function(appId, id) {
				return access.getIdentity(appId, id);
			}
		}
	};

	return storage;
};

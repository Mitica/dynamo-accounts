'use strict';

require('./db/models');

var UserRecord = require('./db/user_record');
var IdentityRecord = require('./db/identity_record');
var vogels = require('vogels-helpers').access;
var helpers = require('./helpers');

/**
 * Creates a new AccessService object.
 * @class
 */
function AccessService() {}

module.exports = AccessService;

AccessService.prototype.getUser = function(appId, id, options) {

	id = UserRecord.formatId(appId, id);

	return vogels.getItem('DA_User', id, options)
		.then(helpers.getData);
};

AccessService.prototype.getAccounts = function(appId, ids, options) {

	ids = ids.map(function(id) {
		return UserRecord.formatId(appId, id);
	});

	options = options || {};
	options.format = options.format || 'items';

	return vogels.getItems('DA_User', ids, options)
		.then(helpers.getData);
};

AccessService.prototype.getIdentity = function(appId, id, options) {

	id = IdentityRecord.formatId(appId, id);

	return vogels.getItem('DA_Identity', id, options)
		.then(helpers.getData);
};

AccessService.prototype.getIdentities = function(appId, ids, options) {

	ids = ids.map(function(id) {
		return IdentityRecord.formatId(appId, id);
	});

	options = options || {};
	options.format = options.format || 'items';

	return vogels.getItems('DA_Identity', ids, options)
		.then(helpers.getData);
};

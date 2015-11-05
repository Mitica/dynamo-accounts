'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Accounts = require('./common/accounts');
var apiTest = require('./common/api');
var APP_ID = '131313131313131313131313';
var APP_ID2 = '131313131313131313131312';

if (!Accounts) {
	return;
}

describe('Accounts', function() {
	this.timeout(1000 * 60);

	before('createTables', function() {
		return Accounts.createTables();
	});

	after('deleteTables', function() {
		return Accounts.deleteTables('iam-sure').then(function() {
			return Promise.delay(1000 * 1);
		});
	});

	describe('apps', function() {
		describe('#create()', function() {
			it('should create a new app id', function() {
				return Accounts.apps.create().then(function(id) {
					assert.equal(24, id.length);
				});
			});
		});
	});

	apiTest(APP_ID);
	apiTest(APP_ID2);

});

'use strict';

var assert = require('assert');
var utils = require('../lib/utils');
var Promise = utils.Promise;
var Accounts = require('./common/accounts');
var APP_ID = '131313131313131313131313';

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
			return Promise.delay(1000 * 10);
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

	describe('#api()', function() {
		var api = Accounts.api(APP_ID);
		describe('accounts', function() {
			describe('#providerLogin()', function() {
				it('should login', function() {
					return api.accounts.providerLogin({
						id: 'id',
						provider: 'google',
						emails: [{
							value: 'cantea@email.com'
						}],
						username: 'admin'
					}, {}).then(function(account) {
						assert.ok(account);

						return api.accounts.getOne(account.id).then(function(account) {
							assert.ok(account);
						});
					});
				});

			});

			describe('#getOne()', function() {
				it('should not find account', function() {
					return api.accounts.getOne('id').then(function(account) {
						assert.equal(undefined, account);
					});
				});
			});
		});
	});

});

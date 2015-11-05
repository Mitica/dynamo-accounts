'use strict';

var assert = require('assert');
var utils = require('../../lib/utils');
var Promise = utils.Promise;
var Accounts = require('./accounts');

module.exports = function(apiId) {
	describe('#api(' + apiId + ')', function() {
		var api = Accounts.api(apiId);

		describe('#providerLogin()', function() {
			it('should login and create a new Account and Connection', function() {
				return api.providerLogin({
					id: 'id',
					provider: 'google',
					emails: [{
						value: 'cantea@email.com'
					}],
					username: 'admin'
				}, {}).then(function(account) {
					assert.ok(account);
					assert.ok('admin', account.username);
				});
			});

			it('should login and detect existing Connection', function() {
				return api.providerLogin({
					id: 'id',
					provider: 'google',
					emails: [{
						value: 'cantea@email.com'
					}],
					username: 'admin'
				}, {}).then(function(account) {
					assert.ok(account);
					assert.ok('admin', account.username);
				});
			});

			it('should fail adding new Connection to one Account for one provider...', function() {
				return api.providerLogin({
						id: 'id2',
						provider: 'google',
						emails: [{
							value: 'cantea@email.com'
						}],
						username: 'admin'
					}, {})
					.catch(function(error) {
						assert.ok(error);
					})
					.then(function(account) {
						assert.equal(undefined, account);
					});
			});

			it('should identify account by Connection email', function() {
				return api.providerLogin({
						id: 'id2',
						provider: 'google',
						emails: [{
							value: 'cantea@email.com'
						}],
						username: 'admin'
					}, {})
					.then(function(account) {
						assert.ok(account);
						assert.ok('admin', account.username);
					});
			});

			it('should identify account by email for other provider', function() {
				return api.providerLogin({
					id: 'id2',
					provider: 'yahoo',
					emails: [{
						value: 'cantea@email.com'
					}],
					username: 'admin'
				}, {}).then(function(account) {
					assert.ok(account);
					assert.ok('admin', account.username);
				});
			});

			it('should create a new account with a diff username', function() {
				return api.providerLogin({
					id: 'id3',
					provider: 'google',
					emails: [{
						value: 'cantea2@email.com'
					}],
					username: 'admin'
				}, {}).then(function(account) {
					assert.ok(account);
					assert.notEqual('admin', account.username);
				});
			});

			it('should create a new account with username=displayName', function() {
				return api.providerLogin({
					id: 'id5',
					provider: 'google',
					emails: [{
						value: 'cantea5@email.com'
					}],
					username: 'admin',
					displayName: 'Ionel'
				}, {}).then(function(account) {
					assert.ok(account);
					assert.equal('Ionel', account.username);
				});
			});

		});

		describe('access', function() {
			describe('#getAccount()', function() {
				it('should not find account', function() {
					return api.access.getAccount('id').then(function(account) {
						assert.equal(undefined, account);
					});
				});
			});
		});
	});
};

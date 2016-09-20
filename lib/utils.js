'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var crypto = require('crypto');

function sha1(value) {
	return crypto.createHash('sha1').update(value).digest('hex').toLowerCase();
}

exports._ = _;
exports.Promise = Promise;
exports.sha1 = sha1;

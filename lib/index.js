'use strict';

var createTables = require('./create_tables');
var apps = require('./apps');
var api = require('./api');
var vogels = require('vogels');
var AWS = vogels.AWS;

exports.config = function config(options) {
	var dynamodb;
	if (options instanceof AWS.DynamoDB) {
		dynamodb = options;
	} else {
		dynamodb = new AWS.DynamoDB(options);
	}
	vogels.dynamoDriver(dynamodb);
};

exports.createTables = createTables;
exports.apps = apps;
exports.api = api;
exports.AWS = AWS;

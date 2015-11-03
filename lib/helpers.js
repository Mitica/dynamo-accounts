'use strict';

var schemas = require('./db/schemas');
var utils = require('./utils');
var _ = utils._;
var Joi = require('joi');
var SCHEMAS_KEYS = {};

function getSchema(name) {
	var schema = schemas[name];
	if (!schema) {
		throw new Error('Invalid schema: ' + name);
	}
	return schema;
}

function getSchemaKeys(name) {
	var schema = schemas[name];
	if (!schema) {
		throw new Error('Invalid schema: ' + name);
	}
	return Object.keys(schema);
}

function schemaKeys(name) {
	if (!SCHEMAS_KEYS[name]) {
		SCHEMAS_KEYS[name] = getSchemaKeys(name);
	}

	return SCHEMAS_KEYS[name];
}

/**
 * Validates a data with a schema
 * @param {object} data - Data to validate
 * @param {string} schemaName - Schema name
 * @returns {object} Returns an error or null.
 * @private
 */
function validateData(data, schemaName) {
	var schema = getSchema(schemaName);
	var result = _.isFunction(schema.validate) ? schema.validate(data) : Joi.validate(data, schema);

	return result.error;
}

exports.schemaKeys = schemaKeys;
exports.validateData = validateData;

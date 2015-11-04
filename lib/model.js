'use strict';

/**
 * A function for normalizing model data
 * @callback normalizeDataCallback
 * @param {Object} data
 * @returns {Object} Normalized data.
 */

/**
 * A function for validating model data
 * @callback validateDataCallback
 * @param {Object} data
 */

var utils = require('./utils');
var _ = utils._;
var helpers = require('./helpers/schemas');

var SCOPE_CREATE = 'create';
var SCOPE_UPDATE = 'update';

/**
 * Base model class
 * @param {Object} config - Model config object.
 * @param {normalizeDataCallback} config.normalizeCreate - Function for normalizing data on create status.
 * @param {normalizeDataCallback} config.normalizeUpdate - Function for normalizing data on update status.
 * @param {validateDataCallback} config.validateCreate - Function for validating data on create status.
 * @param {validateDataCallback} config.validateUpdate - Function for validating data on update status.
 * @param {String} config.name - Model's name.
 * @param {Object} data - Model's data object.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @class
 */
function Model(config, data, scope) {
	if (data instanceof Model) {
		return data;
	}
	if (_.isPlainObject(data)) {
		this.data = data;
	} else {
		throw new Error('Model must contain a data object');
	}
	if (_.isPlainObject(config) && _.isString(config.name)) {
		this.config = config;
	} else {
		throw new Error('Model must contain a config object');
	}

	scope = scope || SCOPE_CREATE;

	if ([SCOPE_CREATE, SCOPE_UPDATE].indexOf(scope) < 0) {
		throw new Error('Invalid model scope: ' + scope);
	}

	this.scope = scope;

	return this;
}

/**
 * Creates a model.
 * @param {Function} Creator - Model constructor.
 * @param {Object} data - Model's data object.
 * @param {String} scope - Model's scope. Can be `create` or `update`.
 * @returns {Model} Returns an object created with constructor `Creator`.
 */
Model.create = function(Creator, data, scope) {
	if (data instanceof Model) {
		return data;
	}
	return new Creator(data, scope);
};

Model.prototype.isCreating = function() {
	return this.scope === SCOPE_CREATE;
};

Model.prototype.isUpdating = function() {
	return this.scope === SCOPE_UPDATE;
};

/**
 * Base normalize a model data.
 * @private
 * @returns {Model} Returns this.
 */
Model.prototype.baseNormalize = function() {
	var data = this.getData();
	var name = this.config.name + 'Schema';
	if (this.isUpdating()) {
		name = 'Update' + name;
	}
	var keys = helpers.schemaKeys(name);
	this.data = _.pick(data, keys);
	return this;
};

/**
 * Normalize a model data.
 * @returns {Model} Returns this.
 */
Model.prototype.normalize = function() {
	var data = this.getData();
	if (this.isCreating()) {
		if (this.config.normalizeCreate) {
			this.data = this.config.normalizeCreate(data);
		}
	} else {
		if (this.config.normalizeUpdate) {
			this.data = this.config.normalizeUpdate(data);
		}
	}
	return this.baseNormalize();
};

/**
 * Base validate a Model's data object.
 * @private
 * @returns {Model} Returns this.
 */
Model.prototype.baseValidate = function() {
	var schemaName = [this.config.name, 'Schema'].join('');
	if (this.isUpdating()) {
		schemaName = 'Update' + schemaName;
	}

	var data = this.getData();
	var error = helpers.validateData(data, schemaName);
	if (error) {
		throw error;
	}

	return this;
};

/**
 * Validate a Model's data object.
 * @returns {Model} Returns this.
 */
Model.prototype.validate = function() {
	this.baseValidate();
	var data = this.getData();
	if (this.isCreating()) {
		if (this.config.validateCreate) {
			this.config.validateCreate(data);
		}
	} else {
		if (this.config.validateUpdate) {
			this.config.validateUpdate(data);
		}
	}
	return this;
};

/**
 * Get model's data object.
 * @returns {Object} Returns the model's data object.
 */
Model.prototype.getData = function() {
	return this.data;
};

module.exports = Model;

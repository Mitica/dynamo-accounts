'use strict';

var Joi = require('joi');

var UserSchema = {
	// hash(appId:accounts_id)
	id: Joi.string().trim().min(36).max(40).required(),
	appId: Joi.string().trim().min(16).max(40).required(),

	email: Joi.string().trim().lowercase().email(),
	username: Joi.string().trim().min(3).max(50),
	displayName: Joi.string().trim().min(3).max(100).required(),
	familyName: Joi.string().trim().max(50),
	givenName: Joi.string().trim().max(50),
	middleName: Joi.string().trim().max(50),
	gender: Joi.valid('male', 'female'),
	status: Joi.string().trim().max(50).default('active'),
	role: Joi.string().trim().max(50).default('user'),
	createdAt: Joi.number().integer().min(1).default(Date.now, 'time of creation'),
	updatedAt: Joi.number().integer().min(1),
	lastLoginAt: Joi.number().integer().min(1),
	metadata: Joi.string().trim().max(1000)
};

var UpdateUserSchema = {
	id: Joi.string().trim().min(36).max(40).required(),
	email: Joi.string().trim().lowercase().email().not(null),
	username: Joi.string().trim().min(3).max(50).not(null),
	displayName: Joi.string().trim().min(3).max(100).not(null),
	familyName: Joi.string().trim().max(50),
	givenName: Joi.string().trim().max(50),
	middleName: Joi.string().trim().max(50),
	gender: Joi.valid('male', 'female'),
	status: Joi.string().trim().max(50).not(null),
	role: Joi.string().trim().max(50).not(null),
	photo: Joi.string().trim().max(255),
	updatedAt: Joi.number().integer().min(0).default(Date.now, 'time of updating'),
	lastLoginAt: Joi.number().integer().min(0).not(null),
	metadata: Joi.string().trim().max(1000)
};

var IdentitySchema = {
	// hash(appId:accounts_id)
	id: Joi.string().trim().min(36).max(40).lowercase().required(),
	appId: Joi.string().trim().min(16).max(40).required(),
	userId: Joi.string().trim().min(36).max(40).required(),

	type: Joi.string().trim().min(1).max(100).required(),
	name: Joi.string().min(2).max(255).lowercase().require(),
	value: Joi.string().min(2).max(255).required(),
	// hash(appId:accounts_key)
	key: Joi.string().min(32).max(40).lowercase().required(),

	profile: Joi.object(),
	createdAt: Joi.number().integer().min(1).default(Date.now, 'time of creation'),
	updatedAt: Joi.number().integer().min(1),
	metadata: Joi.string().trim().max(1000)
};

var UpdateIdentitySchema = {
	// hash(appId:accounts_id)
	id: Joi.string().trim().min(36).max(40).lowercase().required(),
	profile: Joi.object(),
	updatedAt: Joi.number().integer().min(1).default(Date.now, 'time of updating').not(null),
	metadata: Joi.string().trim().max(1000)
};

exports.UserSchema = UserSchema;
exports.UpdateUserSchema = UpdateUserSchema;
exports.IdentitySchema = IdentitySchema;
exports.UpdateIdentitySchema = UpdateIdentitySchema;

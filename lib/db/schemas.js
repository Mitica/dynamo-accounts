'use strict';

var Joi = require('joi');

var UserSchema = {
	// hash(appId:accounts_id)
	id: Joi.string().trim().min(36).max(40).required(),
	appId: Joi.string().trim().min(16).max(40).required(),

	data: Joi.object().min(1).max(25).required(),

	createdAt: Joi.number().integer().min(1).required(),
	updatedAt: Joi.number().integer().min(1).required(),
	lastLoginAt: Joi.number().integer().min(1)
};

var UpdateUserSchema = {
	// hash(appId:accounts_id)
	id: Joi.string().trim().min(36).max(40).required(),
	// data: Joi.object().min(1).max(25).invalid(null),

	updatedAt: Joi.number().integer().min(1).default(Date.now, 'time of updating'),
	lastLoginAt: Joi.number().integer().min(1).not(null)
};

var IdentitySchema = {
	// hash(appId:accounts_id)
	id: Joi.string().trim().min(36).max(40).lowercase().required(),
	appId: Joi.string().trim().min(16).max(40).required(),
	// hash(appId:accounts_userId)
	userId: Joi.string().trim().min(36).max(40).required(),

	data: Joi.object().min(1).max(25).required(),

	createdAt: Joi.number().integer().min(1).required(),
	updatedAt: Joi.number().integer().min(1).required(),
	lastLoginAt: Joi.number().integer().min(1)
};

var UpdateIdentitySchema = {
	// hash(appId:accounts_id)
	id: Joi.string().trim().min(36).max(40).lowercase().required(),
	// data: Joi.object().min(1).max(25).invalid(null),

	updatedAt: Joi.number().integer().min(1).default(Date.now, 'time of updating'),
	lastLoginAt: Joi.number().integer().min(1).not(null)
};

exports.UserSchema = UserSchema;
exports.UpdateUserSchema = UpdateUserSchema;
exports.IdentitySchema = IdentitySchema;
exports.UpdateIdentitySchema = UpdateIdentitySchema;

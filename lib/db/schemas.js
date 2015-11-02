'use strict';

var Joi = require('joi');

var AccountSchema = {
	// const ObjectID
	id: Joi.string().trim().length(24).lowercase().alphanum().required(),
	appId: Joi.string().trim().length(24).lowercase().alphanum().required(),
	// UUID
	key: Joi.string().trim().length(36).lowercase().required(),

	email: Joi.string().trim().min(5).max(100).lowercase().email().required(),
	username: Joi.string().trim().min(3).max(50).lowercase().required(),

	displayName: Joi.string().trim().min(3).max(100),
	familyName: Joi.string().trim().max(50),
	givenName: Joi.string().trim().max(50),
	middleName: Joi.string().trim().max(50),

	gender: Joi.valid('male', 'female'),
	status: Joi.valid('active', 'blocked').default('active').required(),
	role: Joi.string().trim().default('user').required(),

	photo: Joi.string().trim().max(255),

	customData: Joi.string().trim().max(800),

	// keys:
	// SHA1(appId:id)
	ukey__id: Joi.string().trim().length(40).lowercase().required(),
	// SHA1(appId:key)
	ukey__key: Joi.string().trim().length(40).lowercase().required(),
	// SHA1(appId:email)
	ukey__email: Joi.string().trim().length(40).lowercase().required(),
	// SHA1(appId:username)
	ukey__username: Joi.string().trim().length(40).lowercase().required()
};

var AccountConnectionSchema = {
	// const SHA1(appId:providerName:providerProfileId)
	id: Joi.string().trim().length(40).lowercase().required(),
	appId: Joi.string().trim().length(24).lowercase().alphanum().required(),
	accountId: Joi.string().trim().length(24).lowercase().alphanum().required(),

	providerName: Joi.string().trim().max(20).lowercase().alphanum().required(),
	providerProfileId: Joi.string().trim().max(255).required(),

	email: Joi.string().trim().min(5).max(100).lowercase().email().required(),
	username: Joi.string().trim().min(3).max(50),

	displayName: Joi.string().trim().min(3).max(100),
	familyName: Joi.string().trim().max(50),
	givenName: Joi.string().trim().max(50),
	middleName: Joi.string().trim().max(50),

	gender: Joi.valid('male', 'female'),

	photo: Joi.string().trim().max(255),

	profileUrl: Joi.string().trim().max(255),

	// accessToken:refreshToken, or token:tokenSecret, or identifier, or... IN JSON format
	accessData: Joi.string().trim().max(800).required(),

	// SHA1(appId:email)
	key__email: Joi.string().trim().length(40).lowercase().required(),
	// SHA1(appId:provider:email)
	ukey__email: Joi.string().trim().length(40).lowercase().required(),
	// SHA1(id:accountId)
	ukey__id: Joi.string().trim().length(40).lowercase().required()
};

exports.AccountSchema = AccountSchema;
exports.AccountConnectionSchema = AccountConnectionSchema;

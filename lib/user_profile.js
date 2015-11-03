'use strict';

/**
 * UserProfile module
 * @module user_profile
 */

var _ = require('./utils')._;

/**
 * Converts an UserProfile to AccountRecord
 * @param {object} profile - User profile
 * @returns {AccountRecord}
 */
function convertToAccount(profile) {
	var data = _.pick(profile, ['displayName', 'username', 'gender']);

	if (profile.name) {
		data.familyName = profile.name.familyName;
		data.givenName = profile.name.givenName;
		data.middleName = profile.name.middleName;
	}

	if (profile.emails && profile.emails.length > 0) {
		data.email = profile.emails[0].value;
	}
	if (profile.photos && profile.photos.length > 0) {
		data.photo = profile.photos[0].value;
	}

	return data;
}

/**
 * Converts an UserProfile to AccountConnectionRecord
 * @param {object} profile - User profile
 * @returns {AccountConnectionRecord}
 */
function convertToAccountConnection(profile) {
	var data = _.pick(profile, ['profileUrl', 'displayName', 'username', 'gender']);

	if (profile.name) {
		data.familyName = profile.name.familyName;
		data.givenName = profile.name.givenName;
		data.middleName = profile.name.middleName;
	}

	data.providerName = profile.provider;
	data.providerProfileId = profile.id;

	if (profile.emails && profile.emails.length > 0) {
		data.email = profile.emails[0].value;
	}
	if (profile.photos && profile.photos.length > 0) {
		data.photo = profile.photos[0].value;
	}

	return data;
}

exports.convertToAccountConnection = convertToAccountConnection;
exports.convertToAccount = convertToAccount;

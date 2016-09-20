'use strict';

exports.getData = function(item) {
	if (!item) {
		return item;
	}
	if (Array.isArray(item)) {
		return item.map(function(it) {
			return it.data;
		});
	}
	return item.data;
};

exports.formatUpdateExpression = function createUpdateExpression(params, data) {
	params.UpdateExpression = '';
	var setExp = [];
	var removeExp = [];
	params.ExpressionAttributeValues = {};
	params.ExpressionAttributeNames = { '#data': 'data' };

	Object.keys(data).forEach(function(key) {
		if (key !== 'id' && data[key] !== undefined) {
			if (data[key] === null) {
				removeExp.push('#data.' + key);
			} else {
				setExp.push('#data.' + key + ' = :' + key);
				params.ExpressionAttributeValues[':' + key] = data[key];
			}
		}
	});

	if (setExp.length > 0) {
		params.UpdateExpression += 'SET ' + setExp.join(', ') + ' ';
	}
	if (removeExp.length > 0) {
		params.UpdateExpression += 'REMOVE ' + removeExp.join(', ');
	}

	return params;
};

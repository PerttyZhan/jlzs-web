var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {
	fetchTagList (per_page, page, search, sort) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/tag')
			.query({per_page: per_page})
			.query({page: page})
			.query({search: search})
			.query({sort: sort})
			.end((err, res) => {
				res || (res = {})
				deferred.resolve(res.body || {});
			})
		return deferred.promise;
	}
}
var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {
	fetchHotestTag () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/web_index_hottag')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchTagBlog (params) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/search_all')
			.query(params)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	}
}
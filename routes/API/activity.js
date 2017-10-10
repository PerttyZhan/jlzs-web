var request = require('superagent');
var Q = require('q');
var config = require('../config');
var util = require('../util');

module.exports = {
	fetctActivity () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/sort_newactivities')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchIndexFiveBlog () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/activities_five')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	}
}
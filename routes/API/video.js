var request = require('superagent');
var Q = require('q');
var config = require('../config');
var util = require('../util');

module.exports = {
	fetchVideo () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/web_movies_order')
			.query({per_page: 100})
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise; 
	},
	fetchMaxWeight () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/max_weight')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchOneVideo (id) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/web_movies/${id}`)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	}
}
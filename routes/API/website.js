var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {
	fetchAll () {
		var deferred = Q.defer();

		request
			.get(config.api_url + '/website')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchCarousel (choice) {
		var deferred = Q.defer();

		request
			.get(config.api_url + '/web_carousel')
			.query({choice: choice})
			.end((err, res) => {
				deferred.resolve(res.body)
			})

		return deferred.promise;
	}
}
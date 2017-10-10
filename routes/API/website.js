var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {
	fetchAll () {
		var deferred = Q.defer();

		request
			.get(config.api_url + '/website')
			.end((err, res) => {
				deferred.resolve(res.body.data);
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
	},
	fetchWxConifg (url) {
		var deferred = Q.defer();

		request
			.get(config.api_url + '/signature')
			.query({url: url})
			.end((err, res) => {
				deferred.resolve(res.body)
			})

		return deferred.promise;
	},
	fetchChain () {
		var deferred = Q.defer();

		request
			.get(config.api_url + '/chain_index')
			.end((err, res) => {
				deferred.resolve(res.body)
			})

		return deferred.promise;
	}
}
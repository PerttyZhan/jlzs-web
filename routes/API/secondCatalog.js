var request = require('superagent');
var Q = require('q');
var async = require('async');
var config = require('../config');
var util = require('../util');

module.exports = {
	getTypesBlog (choice) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/sort')
			.query({choice: choice})
			.end((err, res) => {
				async.map(res.body, (item, cb) => {
					request
						.get(config.api_url + '/web_index')
						.query({choice: choice, sort_id: item.id})
						.end((err, res) => {
							util.formatTimer(res.body);
							cb(null, {
								id: item.id,
								name: item.sort,
								blog: res.body
							})
						})
				},  (err, results) => {
					deferred.resolve(results);
				})
			})
		return deferred.promise;
	},
	fetchVideoTypeBlog () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/sort')
			.query({choice: 'movies'})
			.end((err, res) => {
				async.map(res.body, (item, cb) => {
					request
						.get(config.api_url + '/movies_five')
						.query({choice: 'movies', sort_id: item.id})
						.end((err, res) => {
							cb(null, {
								id: item.id,
								name: item.sort,
								blog: res.body
							})
						})
				},  (err, results) => {
					deferred.resolve(results);
				})
			})
		return deferred.promise;
	},
	getType (choice) {
		var deferred = Q.defer();

		request
			.get(config.api_url + '/sort')
			.query({choice: choice})
			.end((err, res) => {
				deferred.resolve(res.body);
			})

		return deferred.promise;
	}
}
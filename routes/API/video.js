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
				util.formatVideoTime(res.body)
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchOneAboutVideo (id) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/mv_ab_tag/${id}`)
			.end((err, res) => {
				var data = res.body.data;
				for (var i = 0; i < data.length; i++) {
					util.formatVideoTime(data[i])
				}
				deferred.resolve(data);
			})
		return deferred.promise;
	},
	fetchVideoSearch (search) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/mv_search')
			.query({search: search})
			.end((err, res) => {
				var data = res.body.data;
				for (var i = 0; i < data.length; i++) {
					util.formatVideoTime(data[i])
				}
				deferred.resolve(data);
			})
		return deferred.promise;
	},
	fetchVideoByTagId (id) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/mv_tag')
			.query({tag_id: id})
			.end((err, res) => {
				var data = res.body.data;
				for (var i = 0; i < data.length; i++) {
					util.formatVideoTime(data[i])
				}
				deferred.resolve(data);
			})
		return deferred.promise;
	}
}
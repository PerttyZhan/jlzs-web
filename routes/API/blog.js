var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {

	fetchLastestBlog () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/web_index_new')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchHotestBlog () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/web_index_hot')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchBlog (params) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/web')
			.query(params)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	searchBlog (params) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/web_search')
			.query(params)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchOneBlog (id, params) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/web/${id}`)
			.query(params)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchOneRelativeBlog (id, params) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/web_about/${id}`)
			.query(params)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	}
}
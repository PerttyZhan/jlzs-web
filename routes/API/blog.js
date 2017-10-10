var request = require('superagent');
var Q = require('q');
var config = require('../config');
var util = require('../util');

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
				util.formatTimer(res.body.data);
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchVideoBlog (params) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/web')
			.query(params)
			.end((err, res) => {
				util.formatTimer(res.body.data);
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
				util.formatTimer(res.body.data);
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
	},
	fetchFiveArticle () {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/activities_five`)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchTwoArticle (name) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/sort_two`)
			.query({choice: name})
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	updateLikeBlog (id, choice) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/like/${id}`)
			.query({choice: choice})
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise; 
	},
	fetchIndexFiveActivity () {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/new_activities_five')
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	},
	fetchAboutAc (id) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/Newactivitiesabout_sort/${id}`)
			.end((err, res) => {
				deferred.resolve(res.body);
			})
		return deferred.promise;
	}
}
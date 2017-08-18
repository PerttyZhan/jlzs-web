var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {
	getList (name) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/secondcatalog')
			.query({search: `onecatalog,=,${name}`})
			.end((err, res) => {
				res || (res = {})
				deferred.resolve(res.body || {});
			})
		return deferred.promise;
	},
	getSecondCatalogBlog (name) {
		var deferred = Q.defer();
		request
			.get(config.api_url + '/secondcatalog/blog')
			.query({search: `onecatalog,=,${name}`})
			.end((err, res) => {
				res || (res = {})
				deferred.resolve(res.body || []);
			})
		return deferred.promise;
	}
}
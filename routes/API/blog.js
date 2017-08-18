var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {
	fetchBlogList (per_page, page, search, sort, select) {
		var deferred = Q.defer();
		
		console.log(per_page);

		request
			.get(config.api_url + '/blog')
			.query({per_page: per_page})
			.query({page: page})
			.query({search: search})
			.query({sort: sort})
			.query({select: select})
			.end((err, res) => {
				res || (res = {})
				deferred.resolve(res.body || {});
			})
		return deferred.promise;
	},
	fetchRelativeList (id, num) {
		var deferred = Q.defer();

		request
			.get(config.api_url + `/blog/${id}/relative`)
			.end((err, res) => {
				console.log('bbbb')
				deferred.resolve(res.body || []);
			})

		return deferred.promise;
	},
	fetchOne (id) {
		var deferred = Q.defer();

		request
			.get(config.api_url + `/blog/${id}`)
			.end((err, res) => {
				res || (res = {})
				deferred.resolve(res.body || {});
			})

		return deferred.promise;
	},
	updateBlogRead (id) {

		request
			.post(config.api_url + `/blog/${id}/inc`)
			.send({api_token: 'jlzs', name: 'reads'})
			.end((err, res) => {
				// if (err) {console.log(err)}
					// console.log(res.status)
			})
	}
}
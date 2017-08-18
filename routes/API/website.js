var request = require('superagent');
var Q = require('q');
var config = require('../config');

module.exports = {
	fetchOne (name) {
		var deferred = Q.defer();
		request
			.get(config.api_url + `/website/${name}`)
			.end((err, res) => {
				res || (res = {})
				deferred.resolve(res.body || {});
			})
		return deferred.promise;
	}
}
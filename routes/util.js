
var moment = require('moment');
const oneCatalog = {
	'information': '产业',
	'report': '特写',
	'activities': '活动'
}
moment.locale('zh-cn');

module.exports = {
	addOnecatalogName (blog) {
		var key = blog.difference;

		return oneCatalog[key] || '';
	},
	formatTimer (blog) {
		var i, l, b;

		blog || (blog = []);

		for (i = 0, l = blog.length; i < l; i++) {
			b = blog[i];

			b.formattimer = moment(b.created_at).fromNow();
		}
	},
	formatVideoTime (b) {
		var time = b.uploadmovies && b.uploadmovies.time;

		b.time = moment(time * 1000 - (8 * 60 * 60 * 1000)).format('mm:ss')
	}
}

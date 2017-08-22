
const oneCatalog = {
	'information': '产业',
	'report': '特写',
	'activities': '活动'
}

module.exports = {
	addOnecatalogName (blog) {
		var key = blog.difference;

		return oneCatalog[key] || '';
	}
}

const oneCatalog = {
	'news': '资讯',
	'report': '报道',
	'activity': '活动'
}

module.exports = {
	addOnecatalogName (data) {
		if (Array.isArray(data)) {
			data.forEach(d => {
				if ( oneCatalog[d.onecatalog] ) {
					d.onecatalogname = oneCatalog[d.onecatalog];
				}
			})
		}
		else {
			if ( oneCatalog[data.onecatalog] ) {
				data.onecatalogname = oneCatalog[data.onecatalog];
			}
		}
		
	}
}
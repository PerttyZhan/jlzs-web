var Q = require('q');

var util = require('./util');
var config = require('./config');

var website = require('./API/website');
var blog = require('./API/blog');
var secondCatalog = require('./API/secondCatalog');
var tag = require('./API/tag');

var templates = require('./API/template');

module.exports = function (app) {
	
	app.route('/')
		.get((req, res) => {
			Q.all([
				website.fetchAll(),
				website.fetchCarousel('index'),

				blog.fetchLastestBlog(),
				blog.fetchHotestBlog(),
				tag.fetchHotestTag(),

				secondCatalog.getTypesBlog('information'),
				secondCatalog.getTypesBlog('report'),
				secondCatalog.getTypesBlog('activity'),
				secondCatalog.getType('about'),
			])
			.spread((website, indexCarousel, lastBlog, hotBlog, hotTag, newsCatalog, reportCatalog, activityCatalog, aboutType) => {
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('index', { 
					key: 'home',
  					website: websiteJson,

  					banner: indexCarousel.data,
  					lastBlog: lastBlog,
  					hotBlog: hotBlog,
  					hotTag: hotTag,

  					newsCatalog: newsCatalog,
  					reportCatalog: reportCatalog,
  					activityCatalog: activityCatalog,

  					aboutType: aboutType
				});
			})
		})

	app.route('/information')
		.get((req, res) => {
			Q.all([
				website.fetchAll(),
				website.fetchCarousel('recommend'),

				blog.fetchBlog({choice: 'information'}),
				secondCatalog.getType('information'),
				blog.fetchHotestBlog(),
				tag.fetchHotestTag(),

				secondCatalog.getType('about'),
			])
			.spread((website, fancy, blog, catalog, hotBlog, hotTag, aboutType) => {

				var html = templates.inforTemplate(blog);
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('information', {
					key: 'information',
  					website: websiteJson,
  					fancy: fancy.data,
  					hotBlog: hotBlog,
  					hotTag: hotTag,

  					blog: blog,
  					catalog: catalog,
  					blogHtml: html,
  					typeID: null,
  					aboutType: aboutType
				})
			})

		})

	app.route('/report')
		.get((req, res) => {

			Q.all([
				website.fetchAll(),
				website.fetchCarousel('recommend'),

				blog.fetchBlog({choice: 'report'}),
				secondCatalog.getType('report'),
				blog.fetchHotestBlog(),
				tag.fetchHotestTag(),

				secondCatalog.getType('about'),
			])
			.spread((website, fancy, blog, catalog, hotBlog, hotTag, aboutType) => {

				var html = templates.reportTemplate(blog);
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('report', {
					key: 'report',
  					website: websiteJson,
  					fancy: fancy.data,
  					hotBlog: hotBlog,
  					hotTag: hotTag,

  					blog: blog,
  					catalog: catalog,
  					blogHtml: html,
  					typeID: null,
  					aboutType: aboutType
				})
			})

		})

	app.route('/about')
		.get((req, res) => {
			Q.all([
				website.fetchAll(),

				secondCatalog.getTypesBlog('about'),

				secondCatalog.getType('about'),
			])
			.spread((website, catalogBlog, aboutType) => {
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('about', {
					key: 'about',
					website: websiteJson,

					catalog: catalogBlog,

					aboutType: aboutType
				})
			})
		})


	app.route('/activities')
		.get((req, res) => {
			var params = req.params;

			Q.all([
				website.fetchAll(),
				website.fetchCarousel('activities'),

				blog.fetchBlog({choice: 'activities'}),
				secondCatalog.getType('activities'),

				secondCatalog.getType('about'),
			])
			.spread((website, activity, blog, catalog, aboutType) => {
				var websiteJson = {};
				var html = templates.activityTemplate(blog);

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('activities', {
					key: 'activities',
  					website: websiteJson,

  					banner: activity.data,
  					catalog: catalog,
  					typeID: null,
  					blog: blog,
  					blogHtml: html,

  					aboutType: aboutType,
				})
			})

		})

	app.route('/:choice/:sort_id')
		.get((req, res) => {
			var params = req.params;

			if (params.choice === 'activities') {
				Q.all([
					website.fetchAll(),
					website.fetchCarousel('activities'),

					blog.fetchBlog(params),
					secondCatalog.getType('activities'),

					secondCatalog.getType('about'),
				])
				.spread((website, activity, blog, catalog, aboutType) => {
					var websiteJson = {};
					var html = templates.activityTemplate(blog);

					for (var i = 0, l = website.length; i < l; i++) {
						websiteJson[website[i].name] = website[i].values;
					}

					res.render('activities', {
						key: 'activities',
	  					website: websiteJson,

	  					banner: activity.data,
	  					catalog: catalog,
	  					typeID: params.sort_id,
	  					blog: blog,
	  					blogHtml: html,

	  					aboutType: aboutType,
					})
				})
			}
			else {
				Q.all([
					website.fetchAll(),
					website.fetchCarousel('recommend'),

					blog.fetchBlog(params),
					secondCatalog.getType(params.choice),
					blog.fetchHotestBlog(),
					tag.fetchHotestTag(),

					secondCatalog.getType('about'),
				])
				.spread((website, fancy, blog, catalog, hotBlog, hotTag, aboutType) => {

					var templateFn ;
					if (params.choice == 'information') {
						templateFn = templates.inforTemplate;
					}
					else if (params.choice == 'report') {
						templateFn = templates.reportTemplate;
					}
					var websiteJson = {};
					var html = templateFn(blog);

					for (var i = 0, l = website.length; i < l; i++) {
						websiteJson[website[i].name] = website[i].values;
					}

					res.render(params.choice, {
						key: params.choice,
	  					website: websiteJson,
	  					fancy: fancy.data,
	  					hotBlog: hotBlog,
	  					hotTag: hotTag,

	  					blog: blog,
	  					catalog: catalog,
	  					blogHtml: html,
	  					typeID: params.sort_id,
	  					aboutType: aboutType
					})
				})
			}
			
		})

	app.route('/page')
		.get((req, res) => {
			var query = req.query;

			blog.fetchBlog(query)
				.then(data => {
					var html = templates.newsTemplate(data.body);
					res.send(html);
				})

		})

	app.route('/tag/:tag_id/:difference')
		.get((req, res) => {
			var params = req.params;

			Q.all([
				website.fetchAll(),
				website.fetchCarousel('recommend'),

				tag.fetchTagBlog(params),

				blog.fetchHotestBlog(),
				tag.fetchHotestTag(),

				secondCatalog.getType('about'),
			])
			.spread((website, fancy, blog, hotBlog, hotTag, aboutType) => {

				var html = templates.tagTemplate(blog);
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('tag_blog', {
					key: 'tag',
  					website: websiteJson,
  					fancy: fancy.data,
  					hotBlog: hotBlog,
  					hotTag: hotTag,

  					blog: blog,
  					blogHtml: html,
  					tag_id: params.tag_id,
  					diff: params.difference,
  					aboutType: aboutType
				})
			})
		})
	app.route('/tag/search/:tag_id/:difference')
		.get((req, res) => {
			var params = req.params;
			var query = req.query;

			var json = Object.assign(query, params);

			tag.fetchTagBlog(params)
				.then(data => {
					var html = templates.tagTemplate(data.body);

					res.send(html)
				})
		})


	app.route('/search/article/:search')
		.get((req, res) => {
			var params = req.params;

			Q.all([
				website.fetchAll(),
				website.fetchCarousel('recommend'),

				blog.searchBlog(params),

				blog.fetchHotestBlog(),
				tag.fetchHotestTag(),

				secondCatalog.getType('about'),
			])
			.spread((website, fancy, blog, hotBlog, hotTag, aboutType) => {
				var html = templates.tagTemplate(blog);
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('hole_search', {
					key: 'hole',
  					website: websiteJson,
  					fancy: fancy.data,
  					hotBlog: hotBlog,
  					hotTag: hotTag,

  					blog: blog,
  					blogHtml: html,
  					search: params.search,
  					aboutType: aboutType
				})
			})

		})

	app.route('/search/page/:search')
		.get((req, res) => {
			var params = req.params;
			var query = req.query;

			var json = Object.assign(query, params);

			blog.searchBlog(params)
				.then(data => {
					var html = templates.tagTemplate(data.body);
					res.send(html)
				})
		})

	app.route('/:choice/article/:id')
		.get((req, res) => {
			var params = req.params;

			Q.all([
				website.fetchAll(),
				website.fetchCarousel('recommend'),
				blog.fetchHotestBlog(),
				secondCatalog.getType('about'),

				blog.fetchOneBlog(params.id, {choice: params.choice}),
				blog.fetchOneRelativeBlog(params.id, {choice: params.choice})
			])
			.spread((website, fancy, hotBlog, aboutType, detailBlog, relativeBlog) => {
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				detailBlog.typeName = util.addOnecatalogName(detailBlog);

				res.render('article', {
					key: 'article',
					website: websiteJson,
					fancy: fancy.data,
					hotBlog: hotBlog,
					aboutType: aboutType,

					blog: detailBlog,
					relativeBlog: relativeBlog.data
				})
			})			
		})
}
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
				website.fetchOne('copyright'),
				website.fetchOne('des'),
				website.fetchOne('keywords'),
				website.fetchOne('banner'),
				website.fetchOne('title'),

				blog.fetchBlogList(5, 1, 'onecatalog,!=,about|status,=,1', 'created_at,-1'),
				blog.fetchBlogList(5, 1, 'onecatalog,!=,about|status,=,1', 'weight,-1'),
				tag.fetchTagList(7, 1, null, 'relate_num,-1'),
				secondCatalog.getSecondCatalogBlog('news'),
				secondCatalog.getSecondCatalogBlog('report'),
				secondCatalog.getSecondCatalogBlog('activity')
			])
			.spread((cr, des, keywords, bn, title, lastBlog, hotBlog, hotTag, newsCatalog, reportCatalog, activityCatalog) => {

				bn.content || (bn.content = '[]');

				res.render('index', { 
  					title: title.content,
  					key: 'home',

  					copyright: cr.content,
  					des: des.content,
  					keywords: keywords.content,
  					banner: JSON.parse(bn.content),

  					lastBlog: lastBlog.data || [],
  					hotBlog: hotBlog.data || [],
  					hotTag: hotTag.data || [],
  					newsCatalog: newsCatalog,
  					reportCatalog: reportCatalog,
  					activityCatalog: activityCatalog
				});
			})
		})

	app.route('/news')
		.get((req, res) => {

			var query = req.query;
			var search = `onecatalog,=,news|status,=,1`;

			if (query.sc) {
				search += `|secondcatalog,=,${query.sc}`
			}

			Q.all([
				website.fetchOne('copyright'),
				website.fetchOne('des'),
				website.fetchOne('fancyblog'),
				website.fetchOne('keywords'),
				website.fetchOne('title'),

				secondCatalog.getList('news'),
				blog.fetchBlogList(10, 1, search, 'weight,-1'),
				blog.fetchBlogList(5, 1, 'onecatalog,!=,about|status,=,1', 'weight,-1'),
				tag.fetchTagList(7, 1, null, 'relate_num,-1')
			])
			.spread((cr, des, fancy, keywords, title, catalog, blog, hotBlog, hotTag) => {

				var html = templates.newsTemplate(blog);

				fancy.content || (fancy.content = '[]');

				res.render('news', { 
	  				title: title.content,
  					key: 'news',
  					activeCatalogID: query.sc,

  					fancy: JSON.parse(fancy.content),
  					copyright: cr.content,
  					des: des.content,
  					keywords: keywords.content,

  					catalog: catalog.data || [],
  					blog: blog,
  					blogHtml: html,
  					hotBlog: hotBlog.data || [],
  					hotTag: hotTag.data || []
	  			});
			})

		})	


	app.route('/:name/search')
		.get((req, res) => {
			var params = req.params;
			var query = req.query;

			var search = `onecatalog,=,${params.name}|status,=,1`;
			var page = query.page || 1;
			var per_page = query.per_page || 10;

			if (query.secondcatalog) {
				search = search + `|secondcatalog,=,${query.secondcatalog}`;
			}

			blog.fetchBlogList(per_page, page, search, 'weight,-1')
				.then(data => {
					var html = templates.newsTemplate(data);
					res.send(html)
				})
			
		})

	app.route('/report')
		.get((req, res) => {
			var query = req.query;
			var search = `onecatalog,=,report|status,=,1`;

			if (query.sc) {
				search += `|secondcatalog,=,${query.sc}`
			}

			Q.all([
				website.fetchOne('copyright'),
				website.fetchOne('des'),
				website.fetchOne('fancyblog'),
				website.fetchOne('keywords'),
				website.fetchOne('title'),

				secondCatalog.getList('report'),
				blog.fetchBlogList(10, 1, search, 'weight,-1', '-content'),
				blog.fetchBlogList(5, 1, 'onecatalog,!=,about|status,=,1', 'weight,-1', '-content'),
				tag.fetchTagList(7, 1, null, 'relate_num,-1')
			])
			.spread((cr, des, fancy, keywords, title, catalog, blog, hotBlog, hotTag) => {

				var html = templates.newsTemplate(blog);

				fancy.content || (fancy.content = '[]');
				
				res.render('report', { 
	  				title: title.content,
  					key: 'report',
  					activeCatalogID: query.sc,
  					fancy: JSON.parse(fancy.content),

  					copyright: cr.content,
  					des: des.content,
  					keywords: keywords.content,

  					catalog: catalog.data || [],
  					blog: blog,
  					blogHtml: html,
  					hotBlog: hotBlog.data || [],
  					hotTag: hotTag.data || []
	  			});
			})
		})


	app.route('/activity')
		.get((req, res) => {

			var query = req.query;
			var search = `onecatalog,=,activity|status,=,1`;

			if (query.sc) {
				search += `|secondcatalog,=,${query.sc}`
			}

			Q.all([
				website.fetchOne('copyright'),
				website.fetchOne('des'),
				website.fetchOne('keywords'),
				website.fetchOne('activityBanner'),
				website.fetchOne('title'),

				secondCatalog.getList('activity'),
				blog.fetchBlogList(10, 1, search, 'weight,-1', '-content'),
				blog.fetchBlogList(5, 1, 'onecatalog,!=,about|status,=,1', 'weight,-1'),
			])
			.spread((cr, des, keywords, banner, title, catalog, blog, hotBlog) => {

				var html = templates.activityTemplate(blog);

				banner.content || (banner.content = '[]');

				res.render('activity', { 
	  				title: title.content,
  					key: 'activity',
  					activeCatalogID: query.sc,

  					copyright: cr.content,
  					des: des.content,
  					keywords: keywords.content,
  					banner: JSON.parse(banner.content),

  					catalog: catalog.data || [],
  					blog: blog,
  					blogHtml: html,
  					hotBlog: hotBlog.data || []
	  			});
			})

		})

	app.route('/about')
		.get((req, res) => {

			var query = req.query;
			var search = `onecatalog,=,about`;

			if (query.sc) {
				search += `|secondcatalog,=,${query.sc}`
			}

			Q.all([
				website.fetchOne('copyright'),
				website.fetchOne('des'),
				website.fetchOne('keywords'),
				website.fetchOne('title'),

				secondCatalog.getSecondCatalogBlog('about'),
			])
			.spread((cr, des, keywords, title, catalog) => {

				res.render('about', { 
	  				title: title.content,
  					key: 'about',

  					copyright: cr.content,
  					des: des.content,
  					keywords: keywords.content,

  					catalog: catalog,
	  			});
			})
		})

	app.route('/article/:id')
		.get((req, res) => {
			var blog_id = req.params.id;

			blog.updateBlogRead(blog_id);

			Q.all([
				website.fetchOne('copyright'),
				website.fetchOne('des'),
				website.fetchOne('fancyblog'),
				website.fetchOne('keywords'),
				website.fetchOne('title'),
				
				blog.fetchBlogList(5, 1, 'onecatalog,!=,about|status,=,1', 'weight,-1'),
				blog.fetchRelativeList(blog_id, 4),
				blog.fetchOne(blog_id)
			])
			.spread((cr, des, fancy, keywords, title, hotBlog, relativeBlog, blog) => {
				util.addOnecatalogName(blog);

				relativeBlog = relativeBlog.slice(0, 6)
				fancy.content || (fancy.content = '[]');
				
				res.render('article', { 
	  				title: title.content,
  					key: 'article',

  					copyright: cr.content,
  					des: des.content,
  					keywords: keywords.content,
  					fancy: JSON.parse(fancy.content),

  					hotBlog: hotBlog.data || [],
  					blog: blog,
  					relativeBlog: relativeBlog,
  					
  					api: config.api_url
	  			});
			})
		})

	app.route('/tag/:id/blog')
		.get((req, res) => {

			var tag_id = req.params.id;
			var search = `tags,$in,${tag_id}`;

			Q.all([
				website.fetchOne('copyright'),
				website.fetchOne('des'),
				website.fetchOne('fancyblog'),
				website.fetchOne('keywords'),
				website.fetchOne('title'),

				blog.fetchBlogList(10, 1, search, 'weight,-1'),
				blog.fetchBlogList(5, 1, 'onecatalog,!=,about|status,=,1', 'weight,-1'),
				tag.fetchTagList(7, 1, null, 'relate_num,-1'),
			])
			.spread((cr, des, fancy, keywords, title, blog, hotBlog, hotTag) => {

				util.addOnecatalogName(blog);
				var html = templates.tagTemplate(blog);

				fancy.content || (fancy.content = '[]');


				res.render('tag_blog', { 
	  				title: title.content,
  					key: 'tagblog',
  					fancy: JSON.parse(fancy.content),
  					tagid: tag_id,
  					
  					copyright: cr.content,
  					des: des.content,
  					keywords: keywords.content,
  					blog: blog,
  					hotBlog: hotBlog.data || [],
  					hotTag: hotTag.data || [],
  					blogHtml: html
	  			});
			})

		})

	app.route('/tag/:id/search')
		.get((req, res) => {

			var tag_id = req.params.id;
			var query = req.query;

			var search = `tags,$in,${tag_id}|status,=,1`;

			var page = query.page || 1;
			var per_page = query.per_page || 10;

			blog.fetchBlogList(per_page, page, search, 'weight,-1')
				.then(data => {
					var html = templates.newsTemplate(data);
					res.send(html)
				})

		})
}
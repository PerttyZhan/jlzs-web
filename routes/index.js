var Q = require('q');
var Moment = require('moment');
var util = require('./util');
var config = require('./config');

var website = require('./API/website');
var blog = require('./API/blog');
var secondCatalog = require('./API/secondCatalog');
var tag = require('./API/tag');
var video = require('./API/video');
var qrcode = require('./API/qrcode')

var templates = require('./API/template');

module.exports = function (app) {
	
	app.route('/')
		.post((req, res) => {
			console.log(req.body)
		})
		.get((req, res) => {
			Q.all([
				website.fetchAll(),
				website.fetchCarousel('index'),

				blog.fetchHotestBlog(),
				tag.fetchHotestTag(),

				secondCatalog.getTypesBlog('information'),
				secondCatalog.getTypesBlog('report'),
				secondCatalog.getTypesBlog('newactivities'),
				secondCatalog.getType('about'),

				blog.fetchTwoArticle('information'),
				blog.fetchTwoArticle('report'),
				blog.fetchIndexFiveActivity(),
				website.fetchChain()
			])
			.spread((website, indexCarousel, hotBlog, hotTag, newsCatalog, reportCatalog, activityCatalog, aboutType, twoInfor, twoReport, fiveAc, chains) => {
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('index', { 
					key: 'home',
  					website: websiteJson,

  					banner: indexCarousel.data,
  					hotBlog: hotBlog,
  					hotTag: hotTag,

  					newsCatalog: newsCatalog,
  					reportCatalog: reportCatalog,
  					activityCatalog: activityCatalog,
  					twoReport: twoReport,
  					twoInfor: twoInfor,
  					fiveAc: fiveAc,
  					chains: chains,

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

				var html;
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}
				
				html = templates.inforTemplate(blog);

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
  					aboutType: aboutType,
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
  					aboutType: aboutType,
				})
			})

		})

	app.route('/about')
		.get((req, res) => {
			Q.all([
				website.fetchAll(),

				secondCatalog.getTypesBlog('about'),

				secondCatalog.getType('about')
				// website.fetchChain()
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
					aboutType: aboutType,
				})
			})
		})


	app.route('/activities')
		.get((req, res) => {
			var params = req.params;

			Q.all([
				website.fetchAll(),
				website.fetchCarousel('activities'),

				blog.fetchBlog({choice: 'newactivities'}),
				secondCatalog.getType('newactivities'),

				secondCatalog.getType('about'),

			])
			.spread((website, activity, blog, catalog, aboutType) => {

				var websiteJson = {};
				var html, blogData = blog.data, address, blogOne;

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				for (var i = 0, l = blogData.length; i < l; i++) {
					address = '';
					blogOne = blogData[i];
					if (blogOne.province_id) {
						address += blogOne.province.name;
					}
					if (blogOne.city_id) {
						address += blogOne.city.name;
					}
					if ( Moment(blogOne.end_time).isBefore(new Date()) ) {
						blogOne.state = -1
					}
					else if ( Moment(blogOne.start_time).isAfter(new Date() ) ) {
						blogOne.state = 1
					}
					else {
						blogOne.state = 0
					}
					address += blogOne.location;
				}

				html = templates.activityTemplate(blog);

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
				params.choice = 'newactivities';
				Q.all([
					website.fetchAll(),
					website.fetchCarousel('activities'),

					blog.fetchBlog(params),
					secondCatalog.getType('newactivities'),

					secondCatalog.getType('about'),
				])
				.spread((website, activity, blog, catalog, aboutType) => {
					var websiteJson = {};
					var html, blogData = blog.data, address, blogOne;

					for (var i = 0, l = website.length; i < l; i++) {
						websiteJson[website[i].name] = website[i].values;
					}
					for (var i = 0, l = blogData.length; i < l; i++) {
						address = '';
						blogOne = blogData[i];
						if (blogOne.province_id) {
							address += blogOne.province.name;
						}
						if (blogOne.city_id) {
							address += blogOne.city.name;
						}
						if ( Moment(blogOne.end_time).isBefore(new Date()) ) {
							blogOne.state = -1
						}
						else if ( Moment(blogOne.start_time).isAfter(new Date() ) ) {
							blogOne.state = 1
						}
						else {
							blogOne.state = 0
						}
						address += blogOne.location;
					}

					html = templates.activityTemplate(blog);
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

					var templateFn, websiteJson = {}, html = '' ;

					if (params.choice == 'information') {
						templateFn = templates.inforTemplate;
					}
					else if (params.choice == 'report') {
						templateFn = templates.reportTemplate;
					}

					if (templateFn) {
						html = templateFn(blog);
					}

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
			var templateFn;

			if (query.choice == 'information') {
				templateFn = templates.inforTemplate;
			}
			else if (query.choice == 'report') {
				templateFn = templates.reportTemplate;
			}

			blog.fetchBlog(query)
				.then(data => {
					util.formatTimer(data.data)
					var html = templateFn(data);
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
  					aboutType: aboutType,

				})
			})
		})

	app.route('/tag/search/:tag_id/:difference')
		.get((req, res) => {
			var params = req.params;
			var query = req.query;

			var json = Object.assign(query, params);
			
			tag.fetchTagBlog(json)
				.then(data => {
					var html = templates.tagTemplate(data);
					res.send(html)
				})
		})


	app.route('/search/hole/:search')
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
  					aboutType: aboutType,

				})
			})

		})

	app.route('/search/page/:search')
		.get((req, res) => {
			var params = req.params;
			var query = req.query;

			var json = Object.assign(query, params);

			blog.searchBlog(json)
				.then(data => {
					var html = templates.tagTemplate(data);
					res.send(html)
				})
		})

	app.route('/:choice/article/:id')
		.get((req, res) => {
			var params = req.params;

			if (params.choice == 'activities' || params.choice == 'newactivities') {
				Q.all([
					website.fetchAll(),

					blog.fetchOneBlog(params.id, {choice: 'newactivities'}),
					blog.fetchAboutAc(params.id),

					secondCatalog.getType('about'),
				])
				.spread((website, blog, aboutAc, aboutType) => {
					var websiteJson = {};

					for (var i = 0, l = website.length; i < l; i++) {
						websiteJson[website[i].name] = website[i].values;
					}

					// res.send(aboutAc)

					res.render('show_activity',{
						key: 'activities',
						website: websiteJson,
						b: blog,
						aboutAc: aboutAc,
						aboutType: aboutType
					})
				})	
			}
			else {
				Q.all([
					website.fetchAll(),
					website.fetchCarousel('recommend'),
					blog.fetchHotestBlog(),
					secondCatalog.getType('about'),

					blog.fetchOneBlog(params.id, {choice: params.choice}),
					blog.fetchOneRelativeBlog(params.id, {choice: params.choice}),
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
						relativeBlog: relativeBlog.data,
					})
				})
			}
						
		})

	app.route('/article/like/:id')
		.get((req, res) => {
			var id = req.params.id;
			var choice = req.query.choice;

			blog.updateLikeBlog(id, choice)
				.then(data => {
					res.json(data)
				})
		})

	app.route('/website/wx/config')
		.get((req, res) => {
			console.log(req.query.url);

			website
				.fetchWxConifg(req.query.url)
				.then(data => {
					res.json(data)
				})
		})

	app.route('/video')
		.get((req, res) => {
			
			Q.all([
				website.fetchAll(),

				secondCatalog.fetchVideoTypeBlog(),

				secondCatalog.getType('about'),
			])
			.spread((website, types, aboutType) => {
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				// for (var i = 0, l = data.length; i < l; i++) {
				// 	util.formatVideoTime(data[i]);
				// }

				res.render('video', {
					key: 'video',
					website: websiteJson,

					videos: types,

					aboutType: aboutType,
				})
			})
		})

	app.route('/video/c/:id/list')
		.get((req, res) => {
			var params = req.params;	

			Q.all([
				website.fetchAll(),

				blog.fetchVideoBlog({choice: 'movies', sort_id: params.id, per_page: 100}),

				secondCatalog.getType('about'),
			])
			.spread((website, videos, aboutType) => {
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('sortvideo', {
					key: 'video',
					website: websiteJson,

					videos: videos,

					aboutType: aboutType,
				})
			})
		})

	app.route('/video/:id/detail')
		.get((req, res) => {
			var params = req.params;

			Q.all([
				website.fetchAll(),

				video.fetchOneVideo(params.id),

				secondCatalog.getType('about'),
			])
			.spread((website, video, aboutType) => {
				var websiteJson = {};

				for (var i = 0, l = website.length; i < l; i++) {
					websiteJson[website[i].name] = website[i].values;
				}

				res.render('videoplay', {
					key: 'video',
					website: websiteJson,

					video: video,

					aboutType: aboutType,
				})
			})
		})

	app.route('/qrcode').get(qrcode)
}
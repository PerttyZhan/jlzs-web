
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(__dirname, '../../views/template');
const news_tmp = fs.readFileSync(templatePath + '/newsBlog.ejs', 'utf-8');
const activity_tmp = fs.readFileSync(templatePath + '/activity.ejs', 'utf-8');
const tag_tmp = fs.readFileSync(templatePath + '/tagBlog.ejs', 'utf-8');

module.exports = {
	newsTemplate (blog) {
		if (blog.data && blog.data.length ) {
			return ejs.render(news_tmp, blog)
		}
		else {
			return '';
		}
	},
	activityTemplate (blog) {
		if (blog.data && blog.data.length ) {
			return ejs.render(activity_tmp, blog)
		}
		else {
			return '';
		}
	},
	tagTemplate (blog) {
		if (blog.data && blog.data.length ) {
			return ejs.render(tag_tmp, blog)
		}
		else {
			return '';
		}
	}
}
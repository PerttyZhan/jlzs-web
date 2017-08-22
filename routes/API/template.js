
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const templatePath = path.resolve(__dirname, '../../views/template');

const infor_tmp = fs.readFileSync(templatePath + '/informationBlog.ejs', 'utf-8');
const report_tmp = fs.readFileSync(templatePath + '/reportBlog.ejs', 'utf-8');
const activitiesBlog_tmp = fs.readFileSync(templatePath + '/activity.ejs', 'utf-8');

const tag_tmp = fs.readFileSync(templatePath + '/tagBlog.ejs', 'utf-8');

module.exports = {
	inforTemplate (blog) {
		return ejs.render(infor_tmp, blog)
	},
	reportTemplate (blog) {
		return ejs.render(report_tmp, blog)
	},
	activityTemplate (blog) {
		return ejs.render(activitiesBlog_tmp, blog)
	},
	tagTemplate (blog) {
		return ejs.render(tag_tmp, blog)
	}
}
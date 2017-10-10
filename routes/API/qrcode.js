var qr = require('qr-image');

module.exports = function (req, res, next) {
	
	var query = Object.assign( {}, req.query );
	try {
		var img = qr.image(query.text,{size :10});
    	res.writeHead(200, {'Content-Type': 'image/png'});
    	img.pipe(res);
	}
	catch (err) {
		res.writeHead(414, {'Content-Type': 'text/html'});
    	res.end('<h1>414 Request-URI Too Large</h1>');
	}
}
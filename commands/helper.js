module.exports.get_url_extension = function(url) {
	return url.split(/\#|\?/)[0].split('.').pop().trim();
};

module.exports.baseEmbedTemplate = function() {
	const ftitle = 'by food';
	const furl = 'https://cardano.org/';
	const inlineurl = 'https://www.patreon.com/f00ddevelops';
	const inlineText = '$support bot development';
	return [ftitle, furl, inlineurl, inlineText];
};

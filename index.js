var libUrl   = require('url');
var punycode = require('punycode');


var defaultPorts = {
	'http:': 80,
	'https:': 443,
	'ftp:': 21
};

function formatOpts(opts) {
	opts = opts || Object.create(null);

	opts.ignoreParams = opts.ignoreParams ||
		normalize.defaultOptions.ignoreParams || [];

	opts.indexes = opts.indexes ||
		normalize.defaultOptions.indexes || [];

	return opts;
}

function normalizeEncoding(val) {
	return encodeURIComponent(decodeURIComponent(val));
}

function normalizePath(path, ignoreIndex, indexes) {
	if (!path) {
		return '/';
	}

	var result   = [];
	var segments = path.split('/').map(normalizeEncoding);

	// Implementation of: http://tools.ietf.org/html/rfc3986#section-5.2.4
	for (var i = 0; i < segments.length; i++) {
		var segment = segments[i];
		var isLast  = i === segments.length - 1;
		var isFirst = i === 0;

		if (segment === '.' || segment === '..') {
			if (isLast) {
				result.push('');
			} else if (segment === '..') {
				result.pop();

				if (!result.length) {
					result.push('');
				}
			}
		} else if (isFirst || isLast || segment) {
			result.push(segment);
		}
	}

	if (ignoreIndex && indexes.indexOf(result[result.length - 1]) > -1) {
		result[result.length - 1] = '';
	}

	return result.join('/');
}

function normalizeQuery(query, ignoreParams) {
	var segments = [];

	if (!query) {
		return query;
	}

	if (query[0] === '?') {
		query = query.substr(1);
	}

	query.split('&').forEach(function (segment) {
		var bits = segment.split('=');

		if (!segment || ignoreParams.indexOf(bits[0].toLowerCase()) > -1) {
			return;
		}

		segments.push(bits.map(normalizeEncoding).join('='));
	});

	segments.sort();

	return segments.length ? ('?' + segments.join('&')) : '';
}

function normalize(url, opts) {
	opts = formatOpts(opts);

	var u = libUrl.parse(url);

	// Remove unused properties.
	// Prevents them being used by url.format()
	delete u.host;
	delete u.query;

	if (opts.excludeHash) {
		delete u.hash;
	}

	if (u.hostname) {
		u.hostname = punycode.toUnicode(u.hostname).toLowerCase();
	}

	// Remove default ports
	if (u.port == defaultPorts[u.protocol]) {
		u.port = null;
	}

	u.pathname = normalizePath(u.pathname, opts.ignoreIndex, opts.indexes);
	u.search = normalizeQuery(u.search, opts.ignoreParams);

	return libUrl.format(u);
}

/**
 * Normalizers a path.
 *
 * This will strip any host from the path.
 *
 * @param  {string}  path
 * @param  {boolean
 * @param  {Object}  opts
 * @return {string}
 */
normalize.path = function (path, opts) {
	opts = formatOpts(opts);

	var p   = libUrl.parse(path);
	var ret =  normalizePath(p.pathname, opts.ignoreIndex, opts.indexes);

	if (p.search) {
		ret += normalizeQuery(p.search, opts.ignoreParams);
	}

	if (!opts.excludeHash && p.hash) {
		ret += p.hash;
	}

	return ret;
};

/**
 * Returns true if the normalized urlA is
 * equal to the normalized urlB.
 *
 * @param  {string} urlA
 * @param  {string} urlB
 * @param  {Object} opts
 * @return {boolean}
 */
normalize.equals = function (urlA, urlB, opts) {
	// Attempt to save some CPU if don't need to normalise
	if (urlA === urlB) {
		return true;
	}

	return normalize(urlA, opts) === normalize(urlB, opts);
};

normalize.defaultOptions = {
	ignoreParams: [
		// Ignore Google Analytics parameters
		// https://support.google.com/analytics/answer/1033867?hl=en-GB
		'utm_source',
		'utm_medium',
		'utm_term',
		'utm_content',
		'utm_campaign'
	],
	indexes: [
		'index',
		'index.html',
		'index.htm',
		'index.php',
		'index.asp',
		'index.phtml',
		'index.shtml',
		'index.do'
	],
	ignoreIndex: false,
	excludeHash: true
};

module.exports = normalize;

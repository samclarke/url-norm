# URL normalizer

URL normalizer with punycode support.

To install:

	npm install url-norm

Usage:

	var urlNorm = require('url-norm');

	urlNorm('http://www.example.com:80/test/../index.html');
	// Returns: http://www.example.com/index.html
	
	urlNorm.path('/test/../.././root/file.html');
	// Returns: /root/file.html

	urlNorm.equals('http://www.xn--mnich-kva.com/index.html',
		'http://www.münich.com/index.html'); // Returns: true


## Options

**ignoreParams**
Case-insensitive array of query string parameters to strip. Defaults to:

	ignoreParams: [
		'utm_source',
		'utm_medium',
		'utm_term',
		'utm_content',
		'utm_campaign'
	]

**indexes**
An array of indexes that will be stripped if `ignoreIndex` is set to `true`. Defaults to:

	indexes: [
		'index',
		'index.html',
		'index.htm',
		'index.php',
		'index.asp',
		'index.phtml',
		'index.shtml',
		'index.do'
	]

**ignoreIndex**
If to strip the index value from the URL path. Defaults to `false`.

**excludeHash**
If to strip the `#value` from the URL. Defaults to `true`.


## urlNorm(url, [opts])
**string**

Returns the normalized version of `url`.


## urlNorm.path(path, [opts])
**string**

Normalizes a path. If the path has a host it will be stripped from the result


## urlNorm.equals(urlA, urlB, [opts])
**boolean**

Returns true if `urlA` is equal `urlB` when normalized. 


# License

The MIT License (MIT)

Copyright (c) 2014 Sam Clarke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

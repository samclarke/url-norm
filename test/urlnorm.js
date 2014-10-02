var urlnorm = require('../index');
var expect  = require('chai').expect;

describe('URL Normalizer', function () {
	it('should normalize Unicode hosts', function (done) {
		expect(urlnorm('http://www.münich.com/index.html'))
			.to.equal('http://www.münich.com/index.html');

		expect(urlnorm('http://www.xn--mnich-kva.com/index.html'))
			.to.equal('http://www.münich.com/index.html');

		done();
	});

	it('should remove default ports', function (done) {
		expect(urlnorm('http://www.example.com:80/index.html'))
			.to.equal('http://www.example.com/index.html');

		expect(urlnorm('https://www.example.com:443/index.html'))
			.to.equal('https://www.example.com/index.html');

		expect(urlnorm('ftp://www.example.com:21/index.html'))
			.to.equal('ftp://www.example.com/index.html');

		done();
	});

	it('should not remove non-default ports', function (done) {
		expect(urlnorm('http://www.example.com:8080/index.html'))
			.to.equal('http://www.example.com:8080/index.html');

		expect(urlnorm('https://www.example.com:555/index.html'))
			.to.equal('https://www.example.com:555/index.html');

		expect(urlnorm('ftp://www.example.com:101/index.html'))
			.to.equal('ftp://www.example.com:101/index.html');

		done();
	});

	it('should normalize Unicode paths', function (done) {
		expect(urlnorm('http://ar.wikipedia.org/wiki/الصفحة_الرئيسية'))
			.to.equal('http://ar.wikipedia.org/wiki/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9_%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9');

		expect(urlnorm('http://ko.wikipedia.org/wiki/위키백과:대문'))
			.to.equal('http://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC%3A%EB%8C%80%EB%AC%B8');

		done();
	});

	it('should normalize path encodings', function (done) {
		expect(urlnorm('http://www.example.com/%7Eusername/'))
			.to.equal('http://www.example.com/~username/');

		expect(urlnorm('http://www.example.com/परीक्षण/'))
			.to.equal('http://www.example.com/%E0%A4%AA%E0%A4%B0%E0%A5%80%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3/');

		expect(urlnorm('http://www.example.com/%c8%a7%c4%97/'))
			.to.equal('http://www.example.com/%C8%A7%C4%97/');

		done();
	});

	it('should normalize query string encodings', function (done) {
		expect(urlnorm('http://www.example.com/?test=%7E'))
			.to.equal('http://www.example.com/?test=~');

		expect(urlnorm('http://www.example.com/?test=परीक्षण'))
			.to.equal('http://www.example.com/?test=%E0%A4%AA%E0%A4%B0%E0%A5%80%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3');

		expect(urlnorm('http://www.example.com/?test=%c8%a7%c4%97'))
			.to.equal('http://www.example.com/?test=%C8%A7%C4%97');

		done();
	});

	it('should remove ignored query parameters', function (done) {
		expect(urlnorm('http://www.example.com/?utm_source&utm_campaign=123&test'))
			.to.equal('http://www.example.com/?test');

		expect(urlnorm('http://www.example.com/?utm_source&utm_campaign=123'))
			.to.equal('http://www.example.com/');

		done();
	});

	it('should re-order query strings', function (done) {
		expect(urlnorm('http://www.example.com/?a&z=1&c=123&123=1&231'))
			.to.equal('http://www.example.com/?123=1&231&a&c=123&z=1');

		done();
	});

	it('should remove the ? if there is no query string', function (done) {
		expect(urlnorm('http://www.example.com/?'))
			.to.equal('http://www.example.com/');

		done();
	});

	it('should work when given just a path', function (done) {
		expect(urlnorm('/a/b/../c')).to.equal('/a/c');

		done();
	});

	it('should not remove the index by default', function (done) {
		expect(urlnorm('http://www.example.com/index'))
			.to.equal('http://www.example.com/index');

		expect(urlnorm('http://www.example.com/index.html'))
			.to.equal('http://www.example.com/index.html');

		expect(urlnorm('http://www.example.com/index.php'))
			.to.equal('http://www.example.com/index.php');

		done();
	});

	it('should remove indexes when ignoreIndex is set', function (done) {
		expect(urlnorm('http://www.example.com/index', { ignoreIndex: true }))
			.to.equal('http://www.example.com/');

		expect(urlnorm('http://www.example.com/index.html', { ignoreIndex: true }))
			.to.equal('http://www.example.com/');

		expect(urlnorm('http://www.example.com/index.php', { ignoreIndex: true }))
			.to.equal('http://www.example.com/');

		done();
	});

	describe('#path()', function () {
		it('should not strip trailing slashes', function (done) {
			expect(urlnorm.path('/a/')).to.equal('/a/');
			expect(urlnorm.path('/a/b/')).to.equal('/a/b/');

			done();
		});

		it('should normalize dots in relative paths', function (done) {
			expect(urlnorm.path('/a/b/c/./')).to.equal('/a/b/c/');
			expect(urlnorm.path('/a/b/c/.')).to.equal('/a/b/c/');
			expect(urlnorm.path('/a/b/c/../')).to.equal('/a/b/');
			expect(urlnorm.path('/a/b/c/..')).to.equal('/a/b/c/');
			expect(urlnorm.path('/a/b/c/./../../g')).to.equal('/a/g');
			expect(urlnorm.path('/./a/')).to.equal('/a/');
			expect(urlnorm.path('/../../a/')).to.equal('/a/');
			expect(urlnorm.path('../a/')).to.equal('/a/');

			done();
		});

		it('should normalize slashes in relative paths', function (done) {
			expect(urlnorm.path('/a////b///')).to.equal('/a/b/');

			expect(urlnorm.path('////a')).to.equal('/a');
			expect(urlnorm.path('a/////')).to.equal('a/');

			done();
		});

		it('should normalize percent encoded dots', function (done) {
			expect(urlnorm.path('/a/%2E%2E/b/')).to.equal('/b/');

			done();
		});

		it('should discard the host', function (done) {
			expect(urlnorm.path('http://www.example.com/a/./b/')).to.equal('/a/b/');

			done();
		});
	});


	describe('#equals()', function () {
		it('should not strip trailing slashes', function (done) {
			expect(urlnorm.equals('example://a/b/c/%7Bfoo%7D',
				'eXAMPLE://a/./b/../b/%63/%7bfoo%7d')).to.equal(true);

			expect(urlnorm.equals('http://example.com:/',
				'http://example.com:80/')).to.equal(true);


			done();
		});
	});
});

// jshint esversion: 6
const glob = require('glob');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const sanitize = require('sanitize-filename');

if (!fs.existsSync('./exported')) fs.mkdirSync('./exported');

const os = require('os');

const globs = {
	'win32': process.env.APPDATA + '\\Mozilla\\Firefox\\Profiles\\*.default\\',
	// only tested on windows
	'darwin': '~/Library/Application Support/Firefox/Profiles/*.default/',
	'linux': '~/.mozilla/firefox/*.default/'
};

glob(globs[os.platform()], (err, result) => {
	const profile = result[0];

	const db = new sqlite3.Database(profile + '/stylish.sqlite');

	db.each('select * from styles', (err, style) => {
		fs.writeFileSync('./exported/' + sanitize(style.name) + '.css' + (style.enabled ? '' : '.disabled'), style.code);
	});
});

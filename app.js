var express = require('express'),
  app = express(),
  logger = require('morgan'),
  path = require('path'),
  i18n = require('i18next'),
  bodyParser = require('body-parser');

// static resources
var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 7 * oneDay
}));

// use filesys
	i18n.init({
		ns: {
			namespaces: ['ns.common', 'ns.special'],
			defaultNs: 'ns.special'
		},
		resSetPath: 'locales/__lng__/new.__ns__.json',
		saveMissing: true,
		debug: true,
		sendMissingTo: 'fallback',
		preload: ['en', 'de'],
		detectLngFromPath: 0,
		ignoreRoutes: ['img/', 'img', 'img/', '/img/', 'css/', 'i18next/']
		}, function(t) {

			console.log('i18n is initialized.');

	// 		i18n.addRoute('/:lng', ['en'], app, 'get', function(req, res) {
	// 		console.log('SEO friendly route ...');
	// 		res.render('index');
	// 	});

	// 	i18n.addRoute('/:lng/route.imprint', ['en'], app, 'get', function(req, res) {
	// 	console.log("localized imprint route");
	// 	res.render('imprint');
	// });

	});

	// Configuration
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(i18n.handle); // have i18n befor app.router

	app.set('view engine', 'ejs');
	app.set('views', __dirname);

	i18n.registerAppHelper(app)
		.serveClientScript(app)
		.serveDynamicResources(app)
		.serveMissingKeyRoute(app);

	i18n.serveWebTranslate(app, {
		i18nextWTOptions: {
			languages: ['de-DE', 'en-US', 'dev'],
			namespaces: ['ns.common', 'ns.special'],
			resGetPath: "locales/resources.json?lng=__lng__&ns=__ns__",
			resChangePath: 'locales/change/__lng__/__ns__',
			resRemovePath: 'locales/remove/__lng__/__ns__',
			fallbackLng: "dev",
			dynamicLoad: true
		}
	});

app.locals.t = function(key){
    return i18n.t(key);
};

app.get('/', function(req, res) {
	res.render('index', {
		layout: true
	});
});

app.get('/str', function(req, res) {
	res.send('locale: ' + req.locale + '<br /> key nav.home -> ' + req.i18n.t('nav.home'));
});

app.listen(3000);
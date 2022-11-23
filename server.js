require('dotenv').config();
const express = require('express');
const slugify = require('slugify');
const { Stats } = require('./src/Stats');
const Period = require('@js-joda/core').Period;
const LocalDate = require('@js-joda/core').LocalDate;

const app = express();
const db = require('./db');


const httpListenPort = process.env.PORT || 80;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './resources/views');

app.get('/', async (req, res) => {
    const stats = new Stats();
    const packages = await stats.getPackages();

    const today = LocalDate.now();
    const p = Period.parse('P1M');
    const lastMonth = LocalDate.now().minus(p);

    const downloads = [];
    for (package of packages.rows) {
        let count = await stats.getMonthlyStats(package.language, package.library, today.monthValue(), today.year());
        let oldCount = await stats.getMonthlyStats(package.language, package.library, lastMonth.monthValue(), lastMonth.year());
        if (oldCount === undefined) {
            oldCount = {downloads: 0}
        }

        let data = {
            language: package.language,
            library: package.library,
            previous: oldCount.downloads || 0,
            current: count.downloads || 0,
        }
        downloads.push(data);
    }

    res.render('index', {today, lastMonth, downloads});
});

app.get('/api/v0/packages', async (req, res) => {
    const packages = await db.query('SELECT language, library FROM daily_stats GROUP BY language, library');
    let response = {
        _embedded: {
            packages: []
        }
    }
    for(row of packages.rows) {
        response._embedded.packages.push({
            language: row.language,
            library: row.library,
            _links: {
                self: {
                    href: `/api/v0/packages/${row.language}/${slugify(row.library)}`
                }
            }
        })
    }

    res.send(JSON.stringify(response));
});

app.get('/api/v0/packages/:language', async (req, res) => {
    const packages = await db.query('SELECT language, library FROM daily_stats WHERE language=$1 GROUP BY language, library', [req.params.language]);
    let response = {
        _embedded: {
            packages: []
        }
    }
    for(row of packages.rows) {
        response._embedded.packages.push({
            language: row.language,
            library: row.library,
            _links: {
                self: {
                    href: `/api/v0/packages/${row.language}/${slugify(row.library)}`
                }
            }
        })
    }

    res.send(JSON.stringify(response));
});

app.get('/api/v0/packages/:language/:package', async (req, res) => {
    const packages = await db.query('SELECT language, library FROM daily_stats WHERE language=$1 GROUP BY language, library', [req.params.language]);
    let matchedPackage = null;
    for(package of packages.rows) {
        if (slugify(package.library) === req.params.package) {
            matchedPackage = package;
            break;
        }
    }

    if (matchedPackage) {
        const stats = await db.query('SELECT * FROM daily_stats WHERE language=$1 AND library=$2 ORDER BY date ASC', [matchedPackage.language, matchedPackage.library]);
        let response = {
            language: matchedPackage.language,
            library: matchedPackage.library,
            stats: []
        };

        for(stat of stats.rows) {
            response.stats.push({date: stat.date, downloads: stat.downloads})
        }

        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
});

const server = app.listen(httpListenPort, () => {
    const host = server.address().address;
    const port = server.address().port

    console.log("Listening on http://%s:%s", host, port)
})
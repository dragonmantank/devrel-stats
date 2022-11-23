require('dotenv').config();
const { Packagist } = require('./src/packageManager/Packagist');
const { Pypi } = require('./src/packageManager/Pypi');
const { Npm } = require('./src/packageManager/Npm');
const { Nuget } = require('./src/packageManager/Nuget');
const { Rubygems } = require('./src/packageManager/Rubygems');
const { Stats } = require('./src/Stats');
stats = new Stats();

let packages = [
    new Rubygems('nexmo'),
    new Rubygems('vonage'),
    new Rubygems('nexmo_rails'),
    new Rubygems('nexmo-oas-renderer'),
    new Rubygems('nexmo_rack'),
    new Nuget('Nexmo.CSharp.Client'),
    new Packagist('nexmo/client'),
    new Packagist('nexmo/laravel'),
    new Packagist('nexmo/client-core'),
    new Packagist('vonage/client-core'),
    new Packagist('vonage/client'),
    new Pypi('nexmo'),
    new Npm('nexmo'),
    new Npm('vonage'),
    new Npm('nexmo-cli'),
];

(async function() {
    for (let p of packages) {
        stats.saveStats(p.language, p.packageName, await p.fetchStats());
    }
})();
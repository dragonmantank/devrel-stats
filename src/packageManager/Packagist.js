const axios = require('axios');
const db = require('./../../db');
const { PackageManager } = require ('./PackageManager');

class Packagist extends PackageManager {
    language = 'php';
    packageName;

    constructor(packageName) {
        super(packageName);
        this.packageName = packageName;
    }

    fetchStats = async () => {
        try {
            const today = new Date();
            const response = await axios.get(`https://packagist.org/packages/${this.packageName}.json`);
            const newTotal = response.data.package.downloads.total;

            const previousData = await db.query('SELECT downloads FROM packagist_downloads WHERE date = (SELECT MAX(date) FROM packagist_downloads WHERE library = $1) AND library = $1', [this.packageName]);
            let previousTotal = 0;

            if (previousData.rowCount === 1) {
                previousTotal = previousData.rows[0].downloads;
            }

            await db.query(
                'INSERT INTO packagist_downloads (date, library, downloads) VALUES ($1, $2, $3) ON CONFLICT (date, library) DO UPDATE SET downloads=$3 WHERE packagist_downloads.library = $2 AND packagist_downloads.date = $1',
                [today.toISOString().slice(0,10), this.packageName, newTotal]
            );
            return newTotal - previousTotal;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    Packagist: Packagist
}
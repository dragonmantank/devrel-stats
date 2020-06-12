const axios = require('axios');
const db = require('./../../db');
const { PackageManager } = require ('./PackageManager');

class Rubygems extends PackageManager {
    language = 'ruby';
    packageName;

    constructor(packageName) {
        super(packageName);
        this.packageName = packageName;
    }

    fetchStats = async () => {
        try {
            const today = new Date();
            const response = await axios.get(`https://rubygems.org/api/v1/versions/${this.packageName}.json`);
            let newTotal = 0;
            response.data.forEach(blob => {
                newTotal = newTotal + blob.downloads_count;
            });

            const previousData = await db.query('SELECT downloads FROM rubygems_downloads WHERE date = (SELECT MAX(date) FROM rubygems_downloads WHERE library = $1) AND library = $1', [this.packageName]);
            let previousTotal = 0;
            
            if (previousData.rowCount === 1) {
                previousTotal = previousData.rows[0].downloads;
            }

            await db.query(
                'INSERT INTO rubygems_downloads (date, library, downloads) VALUES ($1, $2, $3) ON CONFLICT (date, library) DO UPDATE SET downloads=$3 WHERE rubygems_downloads.library = $2 AND rubygems_downloads.date = $1',
                [today.toISOString().slice(0,10), this.packageName, newTotal]
            );
            return newTotal - previousTotal;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    Rubygems: Rubygems
}
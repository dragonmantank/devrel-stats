const axios = require('axios');
const db = require('./../../db');
const { PackageManager } = require ('./PackageManager');

class Nuget extends PackageManager {
    language = 'dotnet';
    packageName;

    constructor(packageName) {
        super(packageName);
        this.packageName = packageName;
    }

    fetchStats = async () => {
        try {
            const today = new Date();
            const response = await axios.get(`https://api-v2v3search-0.nuget.org/query?q=${this.packageName}`);
            const newTotal = response.data.data[0].totalDownloads;

            const previousData = await db.query('SELECT downloads FROM nuget_downloads WHERE date = (SELECT MAX(date) FROM nuget_downloads WHERE library = $1) AND library = $1', [this.packageName]);
            let previousTotal = 0;
            
            if (previousData.rowCount === 1) {
                previousTotal = previousData.rows[0].downloads;
            }

            await db.query(
                'INSERT INTO nuget_downloads (date, library, downloads) VALUES ($1, $2, $3) ON CONFLICT (date, library) DO UPDATE SET downloads=$3 WHERE nuget_downloads.library = $2 AND nuget_downloads.date = $1',
                [today.toISOString().slice(0,10), this.packageName, newTotal]
            );
            return newTotal - previousTotal;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    Nuget: Nuget
}
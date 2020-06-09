const db = require('./../db');

class Stats {
    saveStats = async (language, packageName, count) => {
        const date = new Date();
        db.query(
            `INSERT INTO daily_stats (date, language, library, downloads) VALUES ($1, $2, $3, $4) ON CONFLICT (date, language, library) DO UPDATE SET downloads = $4 WHERE daily_stats.language = $2 AND daily_stats.library = $3`,
            [date.toISOString().slice(0,10), language, packageName, count]
        );
    }
}

module.exports = {
    Stats: Stats
}
const { response } = require('express');
const LocalDate = require("@js-joda/core").LocalDate;
const Period = require("@js-joda/core").Period;
const db = require('./../db');

class Stats {
    getPackages = async () => {
        const packages = db.query("SELECT language, library FROM daily_stats GROUP BY language, library");
        return packages;
    }

    getMonthlyStats = async (language, library, month, year) => {
        const monthBegin = LocalDate.of(year, month, 1);
        const monthEnd = LocalDate.of(year, month, 1).plusMonths(1);

        const response = await db.query(
            "SELECT language, library, SUM(downloads) AS downloads FROM daily_stats WHERE language = $1 AND library = $2 AND date >= $3 AND date < $4 GROUP BY language, library",
            [language, library, monthBegin.toString(), monthEnd.toString()]
        );

        return response.rows[0];
    }

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
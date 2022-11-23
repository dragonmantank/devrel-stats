const NpmStats = require('download-stats');

const { PackageManager } = require ('./PackageManager');

class Npm extends PackageManager {
    language = 'nodejs';
    packageName;

    constructor(packageName) {
        super(packageName);
        this.packageName = packageName;
    }

    fetchStats = async () => {
        try {
            const wrapper = new Promise((resolve, reject) => {
                NpmStats.get.lastDay(this.packageName, (err, res) => {
                    if (err) reject(err)
                    else {
                        resolve(res);
                    }
                })
            });

            const stats = await Promise.resolve(wrapper);
            return stats.downloads;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    Npm: Npm
}
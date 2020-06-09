const axios = require('axios');
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
            const response = await axios.get(`https://packagist.org/packages/${this.packageName}.json`);
            const data = response.data;
            return data.package.downloads.daily;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    Packagist: Packagist
}
const axios = require('axios');
const { PackageManager } = require ('./PackageManager');

class Pypi extends PackageManager {
    language = 'python';
    packageName;

    constructor(packageName) {
        super(packageName);
        this.packageName = packageName;
    }

    fetchStats = async () => {
        try {
            const response = await axios.get(`https://pypistats.org/api/packages/${this.packageName}/recent`);
            const data = response.data;
            return data.data.last_day;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    Pypi: Pypi
}
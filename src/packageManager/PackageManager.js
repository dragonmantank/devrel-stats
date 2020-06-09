class PackageManager {
    language;
    packageName;
    
    fetchStats = async () => {
        throw "fetchStats has not been implemented";
    }
}

module.exports = {
    PackageManager: PackageManager
}
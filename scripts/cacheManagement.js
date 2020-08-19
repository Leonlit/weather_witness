//check for saved data for the weather
function checkCache (city, type) {
    if (storageSupported) {
        try {
            let storageLocation = `${city}_${type}`;
            let timeStampTemplate = `${storageLocation}_time`;
            let timeStamp = getCacheItem(timeStampTemplate);
            if (timeStamp !== null) {
                //cache has a lifetime of 10min
                if (getCurrTimeStamp() - timeStamp < 600000) {
                    let data = getCacheItem(storageLocation);
                    if (data !== null) {
                        //return the JSON string data
                        return data;
                    }else {
                        throw `There's no data available although the timestamp for item ${storageLocation} is available!`;
                    }
                }
            }
        }catch (ex) {
            console.log(ex);
        }
    }else {
        console.log("Storage are not supported!!!");
    }
    return false;
}

//saving data into local storage
function saveCache (city, type, data) {
    if (storageSupported) {
        let storageLocation = `${city}_${type}`;
        let timeStampTemplate = `${storageLocation}_time`;
        resetCache(storageLocation);
        saveCacheItem(storageLocation, data);
        saveCacheItem(timeStampTemplate, getCurrTimeStamp());
        return true;
    }else {
        console.log("Storage are not supported!!!");
        return false;
    }
}

function getCurrTimeStamp () {
    return Date.now();
}

function storageSupported() {
    return typeof(Storage) !== "undefined"
}

function resetCache (item) {
    deleteCacheItem(item);
    deleteCacheItem(`${item}_time`);
}

function getCacheItem (item) {
    return localStorage.getItem(item);
}

function saveCacheItem (key, item){
       localStorage.setItem(key, item);
}

function deleteCacheItem (item) {
    localStorage.removeItem(item);
}


//check for saved data for the weather
async function checkCache (city, type) {
    if (storageSupported) {
        try {
            const storageLocation = `${city}_${type}`;
            const timeStampTemplate = `${storageLocation}_time`;
            const timeStamp = await getCacheItem(timeStampTemplate);
            if (timeStamp !== null) {
                //cache has a lifetime of 10min
                if (getCurrTimeStamp() - timeStamp < 600000) {
                    const data = await getCacheItem(storageLocation);
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
async function saveCache (city, type, data) {
    if (storageSupported) {
        const storageLocation = `${city}_${type}`;
        const timeStampTemplate = `${storageLocation}_time`;
        await resetCache(storageLocation);
        await saveCacheItem(storageLocation, data);
        await saveCacheItem(timeStampTemplate, getCurrTimeStamp());
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


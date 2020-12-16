const resourcesToLoad = require('./resources/resources.js')

module.exports = class ResourceManager {
    constructor(callback) {
        this.resources = {};
        this.deferArr = [];
        this.loadResources(resourcesToLoad, this.deferArr);
        Promise.all(this.deferArr).then(() => {
            callback();
        });
    }

    get(key) {
        const resource = this.resources[key];
        if (!resource) {
            console.error('Resource ' + key + ' not found!');
        }
        return resource;
    }

    loadResource(location, key, url, deferArr, options) {
        deferArr.push(new Promise((resolve, reject) => {
            location[key] = new Image();
            location[key].onload = () => {
                console.log('Resource loaded: ' + url);
                if (options.flipDirection) {
                    const image = location[key];
                    const c = document.createElement('canvas');
                    c.width = image.width;
                    c.height = image.height;
                    const ctx = c.getContext('2d');
                    ctx.scale(-1,1);
                    ctx.drawImage(image,-image.width,0);
                    location[key + '-FLIPPED'] = new Image();
                    location[key + '-FLIPPED'].onload = () => {
                        console.log('Flipped: ' + url);
                        resolve();
                    };
                    location[key + '-FLIPPED'].src = c.toDataURL();
                }
                else {
                    resolve();
                }
            };
            location[key].onerror = () => {
                console.error('Couldn\'t load resource: ' + url);
                reject();
            };
            
            location[key].src = url;
        }));
    }

    loadResources(resourcesToLoad, deferArr) {
        const resourceUrls = Object.keys(resourcesToLoad);
        for (let i = 0; i < resourceUrls.length; i++) {
            this.loadResource(this.resources, resourceUrls[i], '/resources/' + resourceUrls[i], deferArr,
                resourcesToLoad[resourceUrls[i]]);
        }
    }
};
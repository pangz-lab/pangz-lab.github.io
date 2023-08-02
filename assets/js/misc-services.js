function setDownloadCount(container, afterLoadCallback) {
    AssetManager().getReleases().then((json) => {
        $(container).html(AssetManager().getDownloadCount(json));
        afterLoadCallback();
    });
}

function AssetManager() {
    const appReleaseEndpoint = "https://api.github.com/repos/pangz-lab/verus_miner-release/releases";
    return {
        getReleases: () => {
            return $.getJSON(appReleaseEndpoint);
        },
        getDownloadCount(jsonData) {
            downloadCount = 0;
            jsonData.forEach(e => {
                e['assets'].forEach(asset => {
                    downloadCount += asset['download_count'];
                })
            });

            return downloadCount.toLocaleString('en-US');
        }
    }
}
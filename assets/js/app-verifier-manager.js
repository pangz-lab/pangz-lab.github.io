function updateAppChecksumQR(index) {
    const releaseData = AppVerifierManager().getReleaseData();
    AppVerifierManager().showReleaseQrDetails(
      "appVerifierContainer",
      "#appVerifierVersionSelection",
      "#appVerifierChecksumValue",
      releaseData[index]
    );
}

function AppVerifierManager() {
    const sessionKey = "verusMinerAppReleaseSummary";
    const appReleaseJson = "https://raw.githubusercontent.com/pangz-lab/verus_miner-release/main/app-release.json";
    const repoBaseUrl = "https://github.com/pangz-lab/verus_miner-release/tree/main/";
    const apkDlBaseUrl = "https://github.com/pangz-lab/verus_miner-release/raw/main/";
    // v3.1.0/app.apk
    const getSavedReleaseData = () => {
        return JSON.parse(sessionStorage.getItem(sessionKey));
    }

    return {
        getReleases: () => {
            return $.getJSON(appReleaseJson);
        },
        getLatestReleaseUrl: (version) => {
            return apkDlBaseUrl+version+'/app.apk';
        },
        saveReleaseData:(data) => {
            sessionStorage.setItem(sessionKey, JSON.stringify(data));
        },
        getReleaseData: getSavedReleaseData,
        generateDropdownList: (parentElement, releaseData) => {
            var items = "";
            var index = 0;
            var label = '';
            
            releaseData.forEach(e => {
                label = e.secondaryName;
                if(index == 0) {
                    label += " - latest"
                }
                items += `<li><a  onclick="updateAppChecksumQR(`+index+`)" class="dropdown-item"> 📌 ` + label + `</a></li>`
                index++;
            });
            $(parentElement).html(items);
        },
        showReleaseQrDetails: (qrContainer, versionContainer, versionChecksumContainer, data) => {
            const qrSize = screenWidth < 450 ? screenWidth - 150 : 350;
            const version = data.name;
            const label = data.secondaryName;
            const checksum = data.hash + '-' + data.checksum;
            const versionLink = `<a href="`+repoBaseUrl+version+`" target='_blank'class="link-dark">${label} <i class="bi-box-arrow-in-up-right"></i></a>`;
            $(versionContainer).html(versionLink);
            $(versionChecksumContainer).html(checksum);
            
            const qrContainerRef = document.getElementById(qrContainer);
            qrContainerRef.innerHTML = "";
            var qrcode = new QRCode(qrContainerRef, {
                width : qrSize,
                height : qrSize
            });
            qrcode.makeCode(checksum);
        }

    }
}
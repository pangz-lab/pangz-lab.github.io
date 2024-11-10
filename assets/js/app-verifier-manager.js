function updateAppChecksumQR(index) {
    const releaseData = AppVerifierManager().getReleaseData();
    AppVerifierManager().showReleaseQrDetails(
      "appVerifierContainer",
      "#appVerifierVersionSelection",
      "#appVerifierChecksumValue",
      releaseData[index]
    );
}

function openApkVersionUrl(version) {
    window.open(apkDlBaseUrl + encodeURI(version + '/app.apk') , '_blank');
}

function AppVerifierManager() {
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
            const latestVersion = releaseData[0].name;
            var icon = '📌';
            
            releaseData.forEach(e => {
                label = e.secondaryName;
                icon = '📌';
                if(label.includes(latestVersion)) {
                    label += " - latest";
                    icon = '✅';
                }
                items += `<li><a  onclick="updateAppChecksumQR(`+index+`)" class="dropdown-item"> ${icon} ` + label + `</a></li>`
                index++;
            });
            $(parentElement).html(items);
        },
        generateVersionReleaseButtons: (parentElement, releaseData) => {
            var items = "";
            var label = '';
            const latestVersion = releaseData[0].name;
            
            releaseData.forEach(e => {
                label = e.secondaryName;
                if(label.includes(latestVersion)) {
                    // label = label.split("_")[1];
                    const arch = e.arch;
                    const urlTip = e.version;
                    items += `<button class="btn btn-link btn-sm" type="button" onclick="openApkVersionUrl('${urlTip}')" data-bs-toggle="tooltip" data-bs-placement="top" title="${cpuArchs[arch]}"> 📥${label}</button>`
                }
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
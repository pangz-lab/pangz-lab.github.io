function updateAppChecksumQR(index) {
    const releaseData = AppVerifierManager().getReleaseData();
    AppVerifierManager().showReleaseQrDetails(
      "qr-container",
      "#qr-dd-version",
      "#qr-dd-checksum",
      releaseData[index]
    );
}

function AppVerifierManager() {
    const sessionKey = "verusMinerAppReleaseSummary";
    const appReleaseJson = "https://raw.githubusercontent.com/pangz-lab/verus_miner-release/main/app-release.json";
    const repoBaseUrl = "https://github.com/pangz-lab/verus_miner-release/tree/main/";

    return {
        getReleases: () => {
            return $.getJSON(appReleaseJson);
        },
        saveReleaseData:(data) => {
            sessionStorage.setItem(sessionKey, JSON.stringify(data));
        },
        getReleaseData:() => {
            return JSON.parse(sessionStorage.getItem(sessionKey));
        },
        generateDropdownList: (parentElement, releaseData) => {
            var items = "";
            var index = 0;
            var label = '';
            releaseData.forEach(e => {
                label = e.name;
                if(index == releaseData.length -1) {
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
            const checksum = data.hash + '-' + data.checksum;
            const versionLink = `<a href="`+repoBaseUrl+version+`" target='_blank'class="link-dark">${version} <i class="bi-box-arrow-in-up-right"></i></a>`;
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
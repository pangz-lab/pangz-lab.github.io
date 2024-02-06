function generateQrCodeSetting() {
    const value = MinerSettingManager().createJsonSetting(
      $('#settingName').val(),
      $('#settingMinerName').val(),
      $('#settingWalletAddress').val(),
      $('#settingCpuSelectiontion').val(),
      $('#settingPoolHost').val(),
      $('#settingPoolPort').val(),
      MinerSettingManager().formatCustomParameters($('#customParameters').val()),
    )
    MinerSettingManager().generateSettingQrCode('qrCodeSettingContainer', value);
}

function MinerSettingManager() {

    return {
        initSelection: (parentId, poolHostId, poolPortId) => {
            parentId.bind( "click", function() {
                const v = $(this).val().split(":");
                poolHostId.val(v[0]);
                poolPortId.val(v[1]);
            });

            var text = "";
            miningPools.forEach(e => {
                text = e.host +':'+e.port;
                parentId.append(new Option(text, text));
            });
        },
        createJsonSetting: (name, minerName, walletAddress, cpu, hostServer, hostPort, customParameter) => {
            return JSON.stringify({
                id:"1d01d28c796a",
                name: name,
                version: "v2",
                groupId: 0,
                minerName: minerName,
                cpu: parseInt(cpu),
                walletAddress: walletAddress,
                stratumServer:  {
                    type: 0,
                    hostServer: hostServer,
                    hostPort: parseInt(hostPort)
                },
                monitoringServer:  {type:0,hostServer:"",hostPort:4040},
                enableMonitoring: false,
                enableTemperatureControl: false,
                temperatureThreshold: parseFloat(40.01),
                cooldownTimeAfterTempReached: parseFloat(10.01),
                enableChargeControl: false,
                chargeThreshold: parseFloat(10.01),
                cooldownTimeAfterChargeReached: parseFloat(10.01),
                extraParameters: customParameter,
                active: false,
                note: ""
            });
        },
        formatCustomParameters: (value) => {
          if(value.trim().length == 0) {
            return null;
          }
          var result = [];
          const parameters = value.split(";");
          parameters.forEach(p => {
            const currentPair = p.trim();
            if(currentPair.length > 0) {
              if(!currentPair.includes(' ')) {
                result.push(
                  {
                    flag: currentPair,
                    paramValue: ''
                  }
                );
              } else {
                const pair = currentPair.split(' ');
                const flag = pair[0];
                const indexOfFirst = currentPair.indexOf(' ');
                var value = currentPair.substring(indexOfFirst).trim();

                result.push(
                  {
                    flag: flag,
                    paramValue: value 
                  }
                );
              }
            }
          });
          
          return result.length > 0? result : null;
        },
        generateSettingQrCode: (qrContainer, value) => {
            const qrSize = screenWidth < 450 ? screenWidth - 150 : 350;
            const qrContainerRef = document.getElementById(qrContainer);
            qrContainerRef.innerHTML = "";
            var qrcode = new QRCode(qrContainerRef, {
                width : qrSize,
                height : qrSize
            });
            qrcode.makeCode(value);
        }
    };
}
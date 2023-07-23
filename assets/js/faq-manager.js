const officialDiscordGroup = "https://discord.gg/CRVaEsmp";
const officialVerusCoinsDiscordGroup = "https://discord.gg/veruscoin";
const verusWalletAppLink = "https://verus.io/wallet";
const officialVerusExchanges = "https://verus.io/exchanges";
const appImages = {
    minerBaseScreen:"http://localhost:1010/assets/img/verusminer/gallery/gallery-4.jpg"
};
const faqTemplate = `<li data-aos="fade-up" id="faq-PH_ACCORDION_INDEX">
<i class="bx bx-help-circle icon-help"></i> <a data-bs-toggle="collapse" data-bs-target="#accordion-list-PH_ACCORDION_INDEX" class="collapsed">PH_FAQ_Q<i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>
<div id="accordion-list-PH_ACCORDION_INDEX" class="collapse" data-bs-parent=".accordion-list">
    PH_FAQ_A
</div>
</li>`;
const faqs = [
    {
        q: 'What mobile phones can be used for mining?',
        a: `Any mobiles phone with a <b>64 bit processor(CPU)</b> and <b>64 bit OS</b>.
            <br>
            Usually phones with Android 7 OS versions or higher. You can just install the app and see if your phone is mineable. Message will show up in the main screen to confirm if your device is mineable or not.
            <br><br>
            <b>Follow up question</b> : But why don't you just make a support for 32 bit? device
            <br>
            <b>Answer</b> : No mining software available for that. Majority of the 32 bit phones are not capable of solving the solution required by the Verus Blockchain so there's no use to supporting it.`,
    },
    {
        q: 'Is this the official Verus Coin mining app software.',
        a: 'No.<br>Verus Coin is an open source, community driven project. Like most open source projects, members are voluntarily sharing their resources in every way they can. VerusMiner is an example of this among other Verus mining software.',
    },
    {
        q: 'Is there a group chat where I can ask questions about the app or the Verus Coin technology?',
        a: `Yes.<br>You can go the following links.<br><br>
            1. Official Verus Coin Project discord<a href='${officialVerusCoinsDiscordGroup}' target='_blank'>📌 ${officialVerusCoinsDiscordGroup}<i class="bi-box-arrow-in-up-right"></i></a><br>
            2. Official VerusMiner/VerusBox discord<a href='${officialDiscordGroup}' target='_blank'>📌 ${officialDiscordGroup}<i class="bi-box-arrow-in-up-right"></i></a><br>`,
    },
    {
        q: 'How can I generate my own wallet address?',
        a: `You can download the official wallet for the desktop or mobile app from this link <a href='${verusWalletAppLink}' target='_blank'>📌 ${verusWalletAppLink}<i class="bi-box-arrow-in-up-right"></i></a><br>Follow the steps or join the group chat for support.
        <br>
        <br>
        <div class="alert alert-danger d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
            <div>
            Please note that when generating a new wallet address, you have to secure the <b>24 seed phrase</b> that will show up during the generation process.<br><br>
            "The <b>private key</b> associated with it after the creation should be secured too. <b>DO NOT loose it or share to anyone.</b>"
            </div>
        </div>`,
    },
    {
        q: 'Can I mine using the default wallet address from the app?',
        a: `Yes you can but it is recommended to <b>use your own wallet address</b>.
            <br><br>
            By default, the app is using the Verus Coin Foundation's wallet address. If your miner found a block while using it, it will go directly to the Verus Coin Foundation when paid which means you can give it away as a support to the community or request to send it back to your own wallet address ( because you realized it was such a careless move ).
            <br><br>
            Bottomline, use your own wallet address. It saves everyone's time.`,
    },
    {
        q: 'Can I choose any mining pools?',
        a: `Yes you can.
            <br><br>
            Any mining pools from the list can be used for mining. Take note that each pool has a different <b>payment amount threshold</b> and <b>schedule.</b>`,
    },
    {
        q: 'Is the app paying me for the mining?',
        a: `Yes and no.
            <br><br>
            Technically the payment you receive will be coming from the mining pool you chose to connect.
            <br>
            This app only allows you to use your hardware for mining and connect to the mining pool to send the mining solutions.`,
    },
    {
        q: 'I want to convert my Verus Coin(VRSC) to Bitcoin(BTC). Can I do it?',
        a: `Of course you can.
            <br><br>
            You can use one of the following exchanges.
            <a href='${officialVerusExchanges}' target='_blank'>📌 ${officialVerusExchanges}<i class="bi-box-arrow-in-up-right"></i></a>
            `,
    },
    {
        q: `I am using Nicehash pool for mining. Can I use a non-verus wallet address?`,
        a: `Yes.
            <br><br>
            By default, the app only supports I and R Verus wallet addresses.<br>
            If you want to use a non-verus wallet address, just <b>leave the default wallet address</b> then use the <b>CUSTOM PARAMETERS</b> field to specify like the following.
            <br><br>
            <b><i>-u non-verus-wallet-address;</i></b>
            `,
    },
    {
        q: `My phone says, this mining app has a virus. Is this app legit?`,
        a: `Yes.
            <br><br>
            The thing about mining apps are there's mining binary package included ( whether it's a desktop or mobile) in which the miner algorithm runs on the background.
            <br>
            <br>
            Latest phones have virus scanners that treat this mining algorithms as a virus.
            Just make sure not to skip the verification process before you install the app and you're good to go.
            <br>
            <br>
            <div class="alert alert-danger d-flex align-items-center" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                <div>
                    It is recommended to use a dedicated mining phone and not your personal phones for security reasons.
                </div>
            </div>
            `,
    },
    {
        q: `I let the mining app run in the background while using another app but the mining suddenly closed/stopped.`,
        a: `Ideally, <b>mining phone should only be used for mining</b>.
        <br>
        Running resource intensive apps along with the mining app always causing the phone to kill it's process.
        <br><br>
        If you really need to run, just lower the cpu to the minimum core/threads. The higher the cpu core/thread, the more phone resource it uses, the higher chance your phone will kill it.
        <br><br>
        Again, ideally, mining phone should only be used for mining.`
    },
    {
        q: `The app says, my phone is not mineable. What should I do?`,
        a: `There's a high chance that your phone don't have the requirements to run the miner.
        <br><br>
        You can look for other mobile phones even the ones with a cracked screen as long as the touch is working, have a good battery and can connect to the internet. More importantly has a 64 bit OS and CPU.
        <br>
        Then just try it again.`
    },
    {
        q: `My phone model has 64 bit CPU and OS but why the app says it cannot mine?`,
        a: `Some phone manufacturers are using a 32 bit and 64 bit capable CPUs in their devices however, they only enabled the 32 bit support.
        <br><br>
        One way to work around this is to install a custom ROM that enables the 64 bit instructions.<br>
        This however requires technical skills and lots of patience.
        <br>
        <br>
        If you really are into Verus mining and find the first solution hard but your phone is a throw away, you can probably just sell it or swap from your local marketplace.`
    },
    {
        q: `Where can I find the mining poool website?`,
        a: `You can see it from the app in the <b>MINING WEBSITE</b> section. Click to visit the page.<br>
        <br>
        <center><img src="${appImages.minerBaseScreen}" alt="Miner base screen" style="width:350px;height:800px;"></center>`
    },
    {
        q: `I've been mining for 24 hours now but I don't get paid. Is this is scam?`,
        a: `No. This is not a scam.
        <br><br>
        First, I suggest to do your own research(DYOR).<br>
        Second, understand how the mining app works before coming up to that conclusion.
        <br>
        <br>
        Mining apps are connecting to a mining pool without any special requirements. <b>You don't need to pay anything to start the mining</b>. Just a capable mining device and a valid wallet address.
        This category of mining is called <b>pool mining.</b>
        <br><br>
        Another type of mining which is called <b>solo mining</b> or sometimes called <b>node mining</b> is a mining where not only you need a capable hardware and a wallet address but also 
        requires you to download the whole blockchain data before you can mine. It's a resource intensive process and a tedious to setup as it requires technical skills.
        <br><br>
        Both help secure the blockchain network and have it's own advantages and disadvantages.
        <br><br>
        This app is doing a <b>pool mining</b>. The easy one.
        <br><br>
        Mining app connects to a mining pool. The mining pool sends challenges to the connected miners( your phone and other mining devices ).<br>
        When a miner found a block - means the miner solved the challenge sent by the pool, it get's the majority of the block reward.<br>
        It will become an <b>immature balance</b> first then once confirmed, will become a <b>balance</b>.
        The rest goes to the pool operator and the remaining will be distrubuted to all the miners connected during the time the block was found.
        <br><br>
        Miners accumulate Verus coins while they are connected to the pool. No coins to receive otherwise.<br>Confirmed balance are not yet transferred to your wallet address</b>.
        <br><br>
        Here is the important part.
        <br><br>
        Mining pools have their own <b>payment amount threshold</b> and a <b>payment schedule</b>. Some pay once a day. Some pay 4x a day like the <b>verus.io</b>.
        <br><br>
        The <b>payment amount threshold</b> determines <b>how much balance you need to accumulate</b> before the mining pool pays you on the recurring <b>payment schedule</b>.
        <br><br>
        Once paid, the balance will go to the <b>paid balance</b> and will eventually reflect to your wallet address. You can also see the paid balance from the app in the <b>WALLET BALANCE</b> section.
        <br>
        <br>
        <center><img src="${appImages.minerBaseScreen}" alt="Miner base screen" style="width:350px;height:800px;"></center>`
    }
];

function FaqManager() {
    return {
        initList: (parentContainer) => {
            var faqFormattedList = '';
            index = 1;
            faqs.forEach(item => {
                item
                faqFormattedList += faqTemplate.replaceAll("PH_ACCORDION_INDEX", index)
                .replaceAll("PH_FAQ_Q", item.q)
                .replaceAll("PH_FAQ_A", item.a);
                index++;
            });
            console.log(faqFormattedList);
            parentContainer.html(faqFormattedList);
        }
    }    
}
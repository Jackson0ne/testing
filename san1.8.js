//IMPORT & SET UP MAIN CONTENT
const { ipcRenderer, desktopCapturer, clipboard } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const spawn = require('child_process').spawn;
const { exec } = require('child_process');
// const https = require('https');

var localappdata;

if (process.platform == "win32") {
    localappdata = path.join(process.env.LOCALAPPDATA);
} else if (process.platform == "linux") {
    localappdata = path.join(process.env.HOME,".local","share");

    // !!! Re-add if desktop shortcut/start up shortcut creation method is found
    document.getElementById("desktop").style.display = "none";
    document.getElementById("startwin").style.display = "none";
    // !!! Re-add if Steam can be stopped/restarted via shortcut, and if "SkinV5" regkey exists in "registry.vdf" after changing skin
    document.getElementById("nosteam").style.display = "none";
} else if (process.platform == "darwin") {
    localappdata = path.join(process.env.HOME,"Library","Application Support");

    // !!! Re-add if desktop shortcut/start up shortcut creation method is found
    document.getElementById("desktop").style.display = "none";
    document.getElementById("startwin").style.display = "none";
    // !!! Re-add if Steam can be stopped/restarted via shortcut, and if "SkinV5" regkey exists in "registry.vdf" after changing skin
    document.getElementById("nosteam").style.display = "none";
} else {
    alert(`Steam Achievement Notifier is not supported on ${process.platform}!`);
    ipcRenderer.send("uninstallcomplete");
}

const respath = path.join(process.resourcesPath,"app")

const config = JSON.parse(fs.readFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json")));
const gamestats = JSON.parse(fs.readFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","gamestats.json")));
var launcher;
var regkey;

if (process.platform == "win32") {
    if (fs.existsSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","app"))) {
        regkey = require(path.join(respath,'node_modules','regedit'));
    } else {
        regkey = require('regedit');
    }
    
    launcher = JSON.parse(fs.readFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","launcher.json")));
    launcher["firstlaunch"] = false;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","launcher.json"), JSON.stringify(launcher, null, 2));
}

// fs.writeFileSync(path.join(__dirname,"store","local.json"), "");
const rev = JSON.parse(fs.readFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","version.json")));
document.getElementById("rev").innerHTML = rev.version;

//CURRENT VERSION NUMBER
var thisver = "1.84";
var tag = null;

function CheckUpdate() {
    fetch("https://api.github.com/repos/SteamAchievementNotifier/SteamAchievementNotifier/releases").then(response => response.json()).then((data) => {
        tag = data[0].tag_name
        if (tag > thisver) {
            document.getElementById("updateicon").style.display = "flex";
        }
    });
}

try {
    CheckUpdate();
} catch (err) {
    console.log("%cUnable to check for updates: " + err, "color: red");
}

//////////////////////////
// Auto Update Function //
//////////////////////////

// function UpdateSAN() {
//     var updateurl = `https://github.com/SteamAchievementNotifier/SteamAchievementNotifier/releases/tag/${tag}/SANLauncher(V${tag}).exe`
//     https.get(updateurl, response => {
//         var update = fs.createWriteStream(path.join(os.homedir(),"Downloads",`SANLauncher(V${tag}).exe`))
//         response.pipe(update)
//         update.on("finish", () => {
//             update.close()
//             console.log(`%SANLauncher(V${tag}).exe downloaded successfully to ` + path.join(os.homedir(),"Downloads" + " - Restarting..."), "color: deeppink")
//             ipcRenderer.send('updatecomplete', tag)
//         })
//     })
// }

const shortcut = path.join(os.homedir(),"Desktop","Steam Achievement Notifier (V" + thisver + ").lnk");

function OpenUpdateInBrowser() {
    ipcRenderer.send('update', tag);
}

function LoadVer() {
    document.getElementById("footertext1").innerHTML = `Steam Achievement Notifier (V${thisver})`;
}

LoadVer();

var lang;
var nouser;
var nogame;
var nosound;
var novalue;
var resettitle;
var resetdesc;
var resetbtns;
var traylabel;
var trayshow;
var trayexit;
var secret;

//!!!V1.8 Translations
var achievementunlocked;
var rareachievementunlocked;
var testtitle = "Steam Achievement Notifier";
var testdesc;
var addsound;
var invalid;
var addimage;
var file;
var nofolder;
var novalidaudio;
var soundmode;
var randomised;
var presskey;
var gamecomplete;
var allunlocked;
var custompos;
var settingpos;
var settingposrare;

function LoadLang() {
    document.getElementById("lang").value = config.lang;
    lang = config.lang;

    if (config.lang == "english") {
        document.getElementById("username").innerHTML = "No User Detected";
        document.getElementById("gamestatus").innerHTML = "No Game Detected";
        document.getElementById("soundfile").innerHTML = "Default (No Sound Selected)";
        document.getElementById("soundfilerare").innerHTML = "Default (No Sound Selected)";
        document.getElementById("maincheevsound").innerHTML = "Main Achievement Sound";
        document.getElementById("rarecheevsound").innerHTML = "Rare Achievement Sound";
        document.getElementById("test").innerHTML = "SHOW TEST NOTIFICATION";
        document.getElementById("testrare").innerHTML = "SHOW RARE TEST NOTIFICATION";
        document.getElementById("settingstitle").innerHTML = "SETTINGS";
        document.getElementById("configtitle").innerHTML = "CONFIGURATION";
        document.getElementById("apibox").placeholder = "Enter API Key";
        document.getElementById("steam64box").placeholder = "Enter Steam64ID";
        document.getElementById("other").innerHTML = "OTHER";
        document.getElementById("showscreenshotlbl").innerHTML = "Show Achievement Screenshot";
        document.getElementById("showscreenshotlblrare").innerHTML = "Show Achievement Screenshot";
        document.getElementById("desktoplbl").innerHTML = "Create Desktop Shortcut";
        document.getElementById("startwinlbl").innerHTML = "Start with Windows";
        document.getElementById("startminlbl").innerHTML = "Start Minimized To System Tray";
        document.getElementById("soundonlylbl").innerHTML = "Sound-Only Mode";
        document.getElementById("trackinglbl").innerHTML = 'Show "Now Tracking" Notification';

        nouser = "No User Detected";
        nogame = "No Game Detected";
        nosound = "Default (No Sound Selected)";
        nosoundrare = "Default (No Sound Selected)";
        rareheader = `'Rare Achievement Unlocked!`;
        unlinked = "UNLINKED";
        linked = "LINKED";
        novalue = "Please enter a value";

        second = "second";
        seconds = "seconds";

        tracknotifymsg = "Now tracking achievements for";

        resettitle = "Reset App To Default?";
        resetdesc = `WARNING: This will remove all user settings!`;
        resetbtns = ["Reset","Uninstall","Cancel"];

        traylabel = "No Game Detected";
        trayshow = "Show";
        trayexit = "Exit";

        //!!!1.8 Translations;
        achievementunlocked = "Achievement Unlocked!";
        rareachievementunlocked = "Rare Achievement Unlocked!";
        testdesc = "Your notifications are working correctly";

        addsound = "Add Selected Sound";
        invalid = 'Invalid File Type';
        addimage = 'Add Selected Image';
        file = "FILE";
        nofolder = "Default (No Folder Selected)";
        novalidaudio = "No valid audio files located in ";
        soundmode = "SOUND MODE: ";
        randomised = "RANDOMISED";
        presskey = "...";
        custompos = "Set Custom Screen Position";
        settingpos = "Setting Main Position...";
        settingposrare = "Setting Rare Position...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam Screenshot Keybind:";
        document.getElementById("langlbl").innerHTML = "Language:";
        document.getElementById("raritylbl").innerHTML = "Rarity Percentage: ";
        document.getElementById("nosteamlbl").innerHTML = "Hide Steam Achievement Notification";
        document.getElementById("customiselbl").innerHTML = "CUSTOMISE...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Main';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Rare';
        document.getElementById("customiserstylelbl").innerHTML = "ACHIEVEMENT STYLE:";
        document.getElementById("notifypositionlbl").innerHTML = "SCREEN POSITION:";
        document.getElementById("bgtypelbl").innerHTML = "BACKGROUND TYPE:";
        document.getElementById("colourslbl").innerHTML = "COLOURS";
        document.getElementById("colour1lbl").innerHTML = "Colour 1";
        document.getElementById("colour2lbl").innerHTML = "Colour 2";
        document.getElementById("textcolourlbl").innerHTML = "Text Colour";
        document.getElementById("imgselectlbl").innerHTML = "BACKGROUND IMAGE:"
        document.getElementById("roundnesslbl").innerHTML = "ROUNDNESS:";
        document.getElementById("iconroundnesslbl").innerHTML = "ICON ROUNDNESS:";
        document.getElementById("displaytimelbl").innerHTML = "DISPLAY TIME:";
        document.getElementById("scalelbl").innerHTML = "SCALE:";
        document.getElementById("styledefault").innerHTML = "Default";
        document.getElementById("typesolid").innerHTML = "Solid Colour";
        document.getElementById("typegradient").innerHTML = "Colour Gradient";
        document.getElementById("typeimg").innerHTML = "Background Image";
        document.getElementById("dragposlbl").innerHTML = "Use Custom Screen Position";
        document.getElementById("iconselectlbl").innerHTML = "CUSTOM ICON:";
        document.getElementById("fontsizelbl").innerHTML = "FONT SIZE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Reset Position";

        document.getElementById("customiserstylelblrare").innerHTML = "ACHIEVEMENT STYLE:";
        document.getElementById("notifypositionlblrare").innerHTML = "SCREEN POSITION:";
        document.getElementById("bgtypelblrare").innerHTML = "BACKGROUND TYPE:";
        document.getElementById("rarecolourslbl").innerHTML = "COLOURS";
        document.getElementById("colour1lblrare").innerHTML = "Colour 1";
        document.getElementById("colour2lblrare").innerHTML = "Colour 2";
        document.getElementById("textcolourlblrare").innerHTML = "Text Colour";
        document.getElementById("rareimgselectlbl").innerHTML = "BACKGROUND IMAGE:"
        document.getElementById("roundnesslblrare").innerHTML = "ROUNDNESS:";
        document.getElementById("iconroundnesslblrare").innerHTML = "ICON ROUNDNESS:";
        document.getElementById("displaytimelblrare").innerHTML = "DISPLAY TIME:";
        document.getElementById("scalelblrare").innerHTML = "SCALE:";
        document.getElementById("styledefaultrare").innerHTML = "Default";
        document.getElementById("typesolidrare").innerHTML = "Solid Colour";
        document.getElementById("typegradientrare").innerHTML = "Colour Gradient";
        document.getElementById("typeimgrare").innerHTML = "Background Image";
        document.getElementById("dragposlblrare").innerHTML = "Use Custom Screen Position";
        document.getElementById("rareiconselectlbl").innerHTML = "CUSTOM ICON:";
        document.getElementById("fontsizelblrare").innerHTML = "FONT SIZE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Reset Position";

        document.getElementById("trackopacitylbl").innerHTML = "Tracking Opacity:";
        document.getElementById("resetlbl").innerHTML = "Reset App to Default";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Game Details</a> must also be set to "Public".';
        document.getElementById("allpercentlbl").innerHTML = "Show All Achievement Percentages";
        document.getElementById("iconanimationlbl").innerHTML = "Show Rare Icon Animation";
        document.getElementById("hwalbl").innerHTML = "Disable Hardware Acceleration";
        document.getElementById("nvdalbl").innerHTML = "Enable NVDA Support";
        document.getElementById("gamecompletionlbl").innerHTML = "Show Game Completion Notification";
        document.getElementById("ssoverlaylbl").innerHTML = "Save Screenshots with Overlay";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Path:";
        document.getElementById("opacitylbl").innerHTML = "Notification Opacity:";

        secret = "Secret Achievement!";
        gamecomplete = "Game Complete!";
        allunlocked = "You've unlocked all achievements!";
    } else if (config.lang == "arabic") {
        document.getElementById("username").innerHTML = "???? ?????? ???????????? ???? ????????????";
        document.getElementById("gamestatus").innerHTML = "???? ?????? ???????????? ????????";
        document.getElementById("soundfile").innerHTML = "?????????????? (???? ?????? ?????????? ??????)";
        document.getElementById("soundfilerare").innerHTML = "?????????????? (???? ?????? ?????????? ??????)";
        document.getElementById("maincheevsound").innerHTML = "?????? ?????????????? ??????????????";
        document.getElementById("rarecheevsound").innerHTML = "???????? ?????? ??????????????";
        document.getElementById("test").innerHTML = "?????????? ?????????? ????????????????";
        document.getElementById("testrare").innerHTML = "?????????? ?????????? ???????????? ????????";
        document.getElementById("settingstitle").innerHTML = "??????????????????";
        document.getElementById("configtitle").innerHTML = "??????????????";
        document.getElementById("apibox").placeholder = "???????? API Key";
        document.getElementById("steam64box").placeholder = "???????? Steam64ID";
        document.getElementById("other").innerHTML = "??????";
        document.getElementById("showscreenshotlbl").innerHTML = "?????????? ???????? ??????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "?????????? ???????? ??????????????";
        document.getElementById("desktoplbl").innerHTML = "?????????? ???????????? ?????? ????????????";
        document.getElementById("startwinlbl").innerHTML = "???????? ?????????? Windows";
        document.getElementById("startminlbl").innerHTML = "?????? ???????? ?????? ???????? ????????????";
        document.getElementById("soundonlylbl").innerHTML = "?????? ?????????? ??????";
        document.getElementById("trackinglbl").innerHTML = '?????????? ?????????? "???????????? ????????"';

        nouser = "???? ?????? ???????????? ???? ????????????";
        nogame = "???? ?????? ???????????? ????????";
        nosound = "?????????????? (???? ?????? ?????????? ??????)";
        nosoundrare = "?????????????? (???? ?????? ?????????? ??????)";
        rareheader = `'?????????? ???????? ???? ????????`;
        unlinked = "?????? ????????";
        linked = "????????";
        novalue = "???????? ?????????? ????????";

        second = "??????????";
        seconds = "??????????";

        tracknotifymsg = "???????? ?????????????????? ???????? ????";

        resettitle = "?????????? ?????????? ?????????????? ?????? ????????????????????";
        resetdesc = `??????????: ?????????? ?????? ?????? ?????????? ???????? ?????????????? ????????????????!`;
        resetbtns = ["?????????? ??????","?????????? ??????????????","????????"];

        traylabel = "???? ?????? ???????????? ????????";
        trayshow = "????????";
        trayexit = "????????";

        //!!!1.8 Translations;
        achievementunlocked = "???? ?????? ??????????????!";
        rareachievementunlocked = "?????????? ???????? ???? ????????!";
        testdesc = "?????????????????? ???????????? ???? ???????? ???????? ????????";

        addsound = "?????? ?????????? ????????????";
        invalid = '?????? ?????????? ?????? ????????';
        addimage = '?????????? ???????????? ????????????????';
        file = "??????";
        nofolder = "?????????????? (???? ?????? ?????????? ????????)";
        novalidaudio = "???? ???????? ?????????? ?????????? ?????????? ???? ...";
        soundmode = "?????? ??????????:";
        randomised = "????????????";
        presskey = "...";
        custompos = "???????? ???????? ???????????? ????????????";
        settingpos = "?????????? ???????????? ?????????????? ...";
        settingposrare = "?????????? ???????? ???????? ...";

        document.getElementById("steamkeybindlbl").innerHTML = "???? ???????? ???????????? Steam";
        document.getElementById("langlbl").innerHTML = "??????:";
        document.getElementById("raritylbl").innerHTML = "???????? ????????????:";
        document.getElementById("nosteamlbl").innerHTML = "?????????? ?????????????? Steam";
        document.getElementById("customiselbl").innerHTML = "???????? ???????? ????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">????????????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">????????';
        document.getElementById("customiserstylelbl").innerHTML = "?????????? ??????????????:";
        document.getElementById("notifypositionlbl").innerHTML = "???????? ????????????:";
        document.getElementById("bgtypelbl").innerHTML = "?????? ??????????????:";
        document.getElementById("colourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lbl").innerHTML = "?????????? 1";
        document.getElementById("colour2lbl").innerHTML = "?????????? 2";
        document.getElementById("textcolourlbl").innerHTML = "?????? ????????";
        document.getElementById("imgselectlbl").innerHTML = "???????????? ??????????????:"
        document.getElementById("roundnesslbl").innerHTML = "??????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "?????????? ??????????:";
        document.getElementById("displaytimelbl").innerHTML = "?????? ??????????????:";
        document.getElementById("scalelbl").innerHTML = "????????:";
        document.getElementById("styledefault").innerHTML = "??????????";
        document.getElementById("typesolid").innerHTML = "?????????? ????????????";
        document.getElementById("typegradient").innerHTML = "???????????? ??????????";
        document.getElementById("typeimg").innerHTML = "???????????? ??????????????";
        document.getElementById("dragposlbl").innerHTML = "???????????? ???????? ???????????? ????????????";
        document.getElementById("iconselectlbl").innerHTML = "???????? ??????????:";
        document.getElementById("fontsizelbl").innerHTML = "?????? ????????:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "?????????? ?????????? ????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "?????????? ??????????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "???????? ????????????:";
        document.getElementById("bgtypelblrare").innerHTML = "?????? ??????????????:";
        document.getElementById("rarecolourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lblrare").innerHTML = "?????????? 1";
        document.getElementById("colour2lblrare").innerHTML = "?????????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "?????? ????????";
        document.getElementById("rareimgselectlbl").innerHTML = "???????????? ??????????????:"
        document.getElementById("roundnesslblrare").innerHTML = "??????????????:";
        document.getElementById("iconroundnesslblrare").innerHTML = "?????????? ??????????:";
        document.getElementById("displaytimelblrare").innerHTML = "?????? ??????????????:";
        document.getElementById("scalelblrare").innerHTML = "????????:";
        document.getElementById("styledefaultrare").innerHTML = "??????????";
        document.getElementById("typesolidrare").innerHTML = "?????????? ????????????";
        document.getElementById("typegradientrare").innerHTML = "???????????? ??????????";
        document.getElementById("typeimgrare").innerHTML = "???????????? ??????????????";
        document.getElementById("dragposlblrare").innerHTML = "???????????? ???????? ???????????? ????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "???????? ??????????:";
        document.getElementById("fontsizelblrare").innerHTML = "?????? ????????:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "?????????? ?????????? ????????????";

        document.getElementById("trackopacitylbl").innerHTML = "?????????? ????????????:";
        document.getElementById("resetlbl").innerHTML = "?????????? ?????????? ??????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">???????????? ???????????? </a> ?????? ?????????? ?????????????? ?????? "??????".';
        document.getElementById("allpercentlbl").innerHTML = "?????????? ???????? ?????? ??????????????";
        document.getElementById("iconanimationlbl").innerHTML = "?????????? ???????????? ???????????????? ?????????????????? ??????????????";
        document.getElementById("hwalbl").innerHTML = "?????????? ?????????? ??????????????";
        document.getElementById("nvdalbl").innerHTML = "?????????? ?????? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "?????????? ?????????? ?????????? ????????????";
        document.getElementById("ssoverlaylbl").innerHTML = "?????? ?????????? ???????????? ???? ??????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "????????:";
        document.getElementById("opacitylbl").innerHTML = "???????????? ??????????????:";

        secret = "?????????????? ??????????!";
        gamecomplete = "???????????? ????????????!";
        allunlocked = "?????? ???????? ???????? ??????????????????!";
    } else if (config.lang == "bulgarian") {
        document.getElementById("username").innerHTML = "???????? o?????????? ????????????????????";
        document.getElementById("gamestatus").innerHTML = "???? ?? ?????????????? ????????";
        document.getElementById("soundfile").innerHTML = "???? ???????????????????????? (?????? ???????????? ????????)";
        document.getElementById("soundfilerare").innerHTML = "???? ???????????????????????? (?????? ???????????? ????????)";
        document.getElementById("maincheevsound").innerHTML = "?????????????? ???????????????????? ????????";
        document.getElementById("rarecheevsound").innerHTML = "???????? ???? ?????????? ????????????????????";
        document.getElementById("test").innerHTML = "???????????? ???????????????? ???? ????????";
        document.getElementById("testrare").innerHTML = "?????????????????? ???? ???????????????? ???? ?????????? ????????";
        document.getElementById("settingstitle").innerHTML = "??????????????????";
        document.getElementById("configtitle").innerHTML = "????????????????????????";
        document.getElementById("apibox").placeholder = "???????????????? API Key";
        document.getElementById("steam64box").placeholder = "???????????????? Steam64ID";
        document.getElementById("other").innerHTML = "??????????";
        document.getElementById("showscreenshotlbl").innerHTML = "???????????? ???????????? ???? ????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "???????????? ???????????? ???? ????????????";
        document.getElementById("desktoplbl").innerHTML = "???????? ?????? ???? ???????????????? ????????";
        document.getElementById("startwinlbl").innerHTML = "?????????????????? ?? Windows";
        document.getElementById("startminlbl").innerHTML = "?????????? ??????????????????????";
        document.getElementById("soundonlylbl").innerHTML = "?????????? ???????? ???? ????????";
        document.getElementById("trackinglbl").innerHTML = '"???????? ????????????????????????"';

        nouser = "???????? ???????????? ????????????????????";
        nogame = "???? ?? ?????????????? ????????";
        nosound = "???? ???????????????????????? (?????? ???????????? ????????)";
        nosoundrare = "???? ???????????????????????? (?????? ???????????? ????????)";
        rareheader = `'?????????????????? ?????????? ????????????????????!`;
        unlinked = "????????????????";
        linked = "????????????????";
        novalue = "???????? ???????????????? ????????????????";

        resettitle = "???????????????? ???? ?????????????????????? ???? ?????????????????????????";
        resetdesc = `????????????????????????????: ???????? ???? ???????????????? ???????????? ?????????????????????????? ??????????????????!`;
        resetbtns = ["????????????????","??????????????????????????","??????????????"];
    
        traylabel = "???? ?? ?????????????? ????????";
        trayshow = "????????????";
        trayexit = "??????????";

        //!!!1.8 Translations;
        achievementunlocked = "???????????????????????? ??????????????????!";
        rareachievementunlocked = "?????????????????? ?????????? ????????????????????!";
        testdesc = "???????????? ???????????????? ?????????????? ????????????????";

        addsound = "???????????????? ???????????? ????????";
        invalid = '?????????????????? ?????? ????????';
        addimage = '???????????????? ???? ?????????????? ??????????????????????';
        file = "????????";
        nofolder = "???? ???????????????????????? (???? ?? ?????????????? ??????????)";
        novalidaudio = "???????? ?????????????? ?????????? ??????????????, ???????????????? ???? ?? ";
        soundmode = "?????????? ???? ????????:";
        randomised = "??????????????????????????";
        presskey = "...";
        custompos = "?????????????? ??????????????";
        settingpos = "???????????????? ???? ?????????????? ??????????????...";
        settingposrare = "???????????????? ???? ?????????? ??????????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "?????????? ???? ?????????????? ????????????:";
        document.getElementById("langlbl").innerHTML = "????????:";
        document.getElementById("raritylbl").innerHTML = "?????????? ????????????????: ";
        document.getElementById("nosteamlbl").innerHTML = "???????????????? ???? ???????????????????? ???? Steam";
        document.getElementById("customiselbl").innerHTML = "??????????????????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">??????????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">??????????';
        document.getElementById("customiserstylelbl").innerHTML = "???????? ???? ????????????????????:";
        document.getElementById("notifypositionlbl").innerHTML = "?????????????? ???? ????????????:";
        document.getElementById("bgtypelbl").innerHTML = "?????? ??????:";
        document.getElementById("colourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lbl").innerHTML = "???????? 1";
        document.getElementById("colour2lbl").innerHTML = "???????? 2";
        document.getElementById("textcolourlbl").innerHTML = "???????? ???? ????????????";
        document.getElementById("imgselectlbl").innerHTML = "???????????? ??????????????????????:"
        document.getElementById("roundnesslbl").innerHTML = "????????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "?????????? ????????????????:";
        document.getElementById("displaytimelbl").innerHTML = "?????????? ???? ??????????????????:";
        document.getElementById("scalelbl").innerHTML = "??????????:";
        document.getElementById("styledefault").innerHTML = "???? ????????????????????????";
        document.getElementById("typesolid").innerHTML = "???????????? ????????";
        document.getElementById("typegradient").innerHTML = "???????????? ????????????????";
        document.getElementById("typeimg").innerHTML = "???????????? ??????????????????????";
        document.getElementById("dragposlbl").innerHTML = "?????????????????????? ?????????????????????????????? ??????????????";
        document.getElementById("iconselectlbl").innerHTML = "?????????????????????????????? ??????????:";
        document.getElementById("fontsizelbl").innerHTML = "???????????? ???? ????????????:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "???????????????? ???? ??????????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "???????? ???? ????????????????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "?????????????? ???? ????????????:";
        document.getElementById("bgtypelblrare").innerHTML = "?????? ??????:";
        document.getElementById("rarecolourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lblrare").innerHTML = "???????? 1";
        document.getElementById("colour2lblrare").innerHTML = "???????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "???????? ???? ????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "???????????? ??????????????????????:"
        document.getElementById("roundnesslblrare").innerHTML = "????????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "?????????? ????????????????:";
        document.getElementById("displaytimelblrare").innerHTML = "?????????? ???? ??????????????????:";
        document.getElementById("scalelblrare").innerHTML = "??????????:";
        document.getElementById("styledefaultrare").innerHTML = "???? ????????????????????????";
        document.getElementById("typesolidrare").innerHTML = "???????????? ????????";
        document.getElementById("typegradientrare").innerHTML = "???????????? ????????????????";
        document.getElementById("typeimgrare").innerHTML = "???????????? ??????????????????????";
        document.getElementById("dragposlblrare").innerHTML = "?????????????????????? ?????????????????????????????? ??????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "?????????????????????????????? ??????????:";
        document.getElementById("fontsizelblrare").innerHTML = "???????????? ???? ????????????:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "???????????????? ???? ??????????????????";

        document.getElementById("trackopacitylbl").innerHTML = "??????????????????????????:";
        document.getElementById("resetlbl").innerHTML = "???????????????? ???? ????????????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">?????????????????????? ???? ????????????</a> ???????????? ???? ?? "????????????????".';
        document.getElementById("allpercentlbl").innerHTML = "?????????????????? ???? ???????????? ????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "?????????????????? ???? ???????????????? ???? ?????????? ??????????";
        document.getElementById("hwalbl").innerHTML = "?????????????????????????? ?????????????????????? ??????????????????";
        document.getElementById("nvdalbl").innerHTML = "?????????????????????? ?????????????????????? ???? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "?????????????????? ???? ???????????????? ???? ???????????????????? ???? ????????????";
        document.getElementById("ssoverlaylbl").innerHTML = "?????????????????? ???? ?????????????? ???????????? ?? ????????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "??????:";
        document.getElementById("opacitylbl").innerHTML = "?????????????????????? ???? ????????????????????:";

        secret = "?????????? ????????????????????!";
        gamecomplete = "???????????? ?? ??????????????????!";
        allunlocked = "???????????????????? ???????????? ????????????????????!";
    } else if (config.lang == "schinese") {
        document.getElementById("username").innerHTML = "??????????????????";
        document.getElementById("gamestatus").innerHTML = "??????????????????";
        document.getElementById("soundfile").innerHTML = "???????????????????????????";
        document.getElementById("soundfilerare").innerHTML = "???????????????????????????";
        document.getElementById("maincheevsound").innerHTML = "??????????????????";
        document.getElementById("rarecheevsound").innerHTML = "??????????????????";
        document.getElementById("test").innerHTML = "??????????????????";
        document.getElementById("testrare").innerHTML = "????????????????????????";
        document.getElementById("settingstitle").innerHTML = "??????";
        document.getElementById("configtitle").innerHTML = "??????";
        document.getElementById("apibox").placeholder = "?????? API Key";
        document.getElementById("steam64box").placeholder = "?????? Steam64ID";
        document.getElementById("other").innerHTML = "??????";
        document.getElementById("showscreenshotlbl").innerHTML = "??????????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "??????????????????";
        document.getElementById("desktoplbl").innerHTML = "????????????????????????";
        document.getElementById("startwinlbl").innerHTML = "??? Windows ??????";
        document.getElementById("startminlbl").innerHTML = "??????????????????????????????";
        document.getElementById("soundonlylbl").innerHTML = "???????????????";
        document.getElementById("trackinglbl").innerHTML = '??????????????????????????????';

        nouser = "??????????????????";
        nogame = "??????????????????";
        nosound = "???????????????????????????";
        nosoundrare = "???????????????????????????";
        rareheader = `'?????????????????????`;
        unlinked = "?????????";
        linked = "?????????";
        novalue = "??????????????????";

        resettitle = "??????????????????????????????";
        resetdesc = `??????????????????????????????????????????`;
        resetbtns = ["??????","??????","??????"];

        traylabel = "??????????????????";
        trayshow = "??????";
        trayexit = "??????";

        //!!!1.8 Translations;
        achievementunlocked = "???????????????";
        rareachievementunlocked = "?????????????????????";
        testdesc = "???????????????????????????";

        addsound = "?????????????????????";
        invalid = '??????????????????';
        addimage = '??????????????????';
        file = "??????";
        nofolder = "??????????????????????????????";
        novalidaudio = "?????????????????????????????????";
        soundmode = "???????????????";
        randomised = "??????";
        presskey = "...";
        custompos = "???????????????????????????";
        settingpos = "??????????????????...";
        settingposrare = "??????????????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam???????????????";
        document.getElementById("langlbl").innerHTML = "??????";
        document.getElementById("raritylbl").innerHTML = "????????????";
        document.getElementById("nosteamlbl").innerHTML = "?????? Steam ????????????";
        document.getElementById("customiselbl").innerHTML = "?????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">?????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">?????????';
        document.getElementById("customiserstylelbl").innerHTML = "???????????????";
        document.getElementById("notifypositionlbl").innerHTML = "???????????????";
        document.getElementById("bgtypelbl").innerHTML = "???????????????";
        document.getElementById("colourslbl").innerHTML = "??????";
        document.getElementById("colour1lbl").innerHTML = "?????? 1";
        document.getElementById("colour2lbl").innerHTML = "?????? 2";
        document.getElementById("textcolourlbl").innerHTML = "????????????";
        document.getElementById("imgselectlbl").innerHTML = "????????????"
        document.getElementById("roundnesslbl").innerHTML = "?????????";
        document.getElementById("iconroundnesslbl").innerHTML = "???????????????";
        document.getElementById("displaytimelbl").innerHTML = "???????????????";
        document.getElementById("scalelbl").innerHTML = "?????????";
        document.getElementById("styledefault").innerHTML = "??????";
        document.getElementById("typesolid").innerHTML = "??????";
        document.getElementById("typegradient").innerHTML = "????????????";
        document.getElementById("typeimg").innerHTML = "?????????";
        document.getElementById("dragposlbl").innerHTML = "???????????????????????????";
        document.getElementById("iconselectlbl").innerHTML = "??????????????????";
        document.getElementById("fontsizelbl").innerHTML = "???????????????";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "???????????????";
        document.getElementById("notifypositionlblrare").innerHTML = "???????????????";
        document.getElementById("bgtypelblrare").innerHTML = "???????????????";
        document.getElementById("rarecolourslbl").innerHTML = "??????";
        document.getElementById("colour1lblrare").innerHTML = "?????? 1";
        document.getElementById("colour2lblrare").innerHTML = "?????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "????????????"
        document.getElementById("roundnesslblrare").innerHTML = "?????????";
        document.getElementById("iconroundnesslblrare").innerHTML = "???????????????";
        document.getElementById("displaytimelblrare").innerHTML = "???????????????";
        document.getElementById("scalelblrare").innerHTML = "?????????";
        document.getElementById("styledefaultrare").innerHTML = "??????";
        document.getElementById("typesolidrare").innerHTML = "??????";
        document.getElementById("typegradientrare").innerHTML = "????????????";
        document.getElementById("typeimgrare").innerHTML = "?????????";
        document.getElementById("dragposlblrare").innerHTML = "???????????????????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "??????????????????";
        document.getElementById("fontsizelblrare").innerHTML = "???????????????";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "????????????";

        document.getElementById("trackopacitylbl").innerHTML = "?????????????????????";
        document.getElementById("resetlbl").innerHTML = "???????????????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">????????????</a> ?????????????????????????????????';
        document.getElementById("allpercentlbl").innerHTML = "???????????????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "????????????????????????";
        document.getElementById("hwalbl").innerHTML = "??????????????????";
        document.getElementById("nvdalbl").innerHTML = "?????? NVDA ??????";
        document.getElementById("gamecompletionlbl").innerHTML = "????????????????????????";
        document.getElementById("ssoverlaylbl").innerHTML = "??????????????????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "?????????";
        document.getElementById("opacitylbl").innerHTML = "?????????????????????";

        secret = "???????????????";
        gamecomplete = "???????????????";
        allunlocked = "???????????????????????????";
    } else if (config.lang == "tchinese") {
        document.getElementById("username").innerHTML = "??????????????????";
        document.getElementById("gamestatus").innerHTML = "??????????????????";
        document.getElementById("soundfile").innerHTML = "???????????????????????????";
        document.getElementById("soundfilerare").innerHTML = "???????????????????????????";
        document.getElementById("maincheevsound").innerHTML = "??????????????????";
        document.getElementById("rarecheevsound").innerHTML = "??????????????????";
        document.getElementById("test").innerHTML = "??????????????????";
        document.getElementById("testrare").innerHTML = "????????????????????????";
        document.getElementById("settingstitle").innerHTML = "??????";
        document.getElementById("configtitle").innerHTML = "??????";
        document.getElementById("apibox").placeholder = "?????? API Key";
        document.getElementById("steam64box").placeholder = "?????? Steam64ID";
        document.getElementById("other").innerHTML = "??????";
        document.getElementById("showscreenshotlbl").innerHTML = "??????????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "??????????????????";
        document.getElementById("desktoplbl").innerHTML = "????????????????????????";
        document.getElementById("startwinlbl").innerHTML = "??? Windows ??????";
        document.getElementById("startminlbl").innerHTML = "??????????????????????????????";
        document.getElementById("soundonlylbl").innerHTML = "???????????????";
        document.getElementById("trackinglbl").innerHTML = '??????????????????????????????';

        nouser = "??????????????????";
        nogame = "??????????????????";
        nosound = "???????????????????????????";
        nosoundrare = "???????????????????????????";
        rareheader = `'?????????????????????`;
        unlinked = "?????????";
        linked = "?????????";
        novalue = "??????????????????";

        resettitle = "??????????????????????????????";
        resetdesc = `??????????????????????????????????????????`;
        resetbtns = ["??????","??????","??????"];

        traylabel = "??????????????????";
        trayshow = "??????";
        trayexit = "??????";

        //!!!1.8 Translations;
        achievementunlocked = "???????????????";
        rareachievementunlocked = "?????????????????????";
        testdesc = "???????????????????????????";

        addsound = "?????????????????????";
        invalid = '??????????????????';
        addimage = '??????????????????';
        file = "??????";
        nofolder = "??????????????????????????????";
        novalidaudio = "????????????????????????????????? ";
        soundmode = "???????????????";
        randomised = "??????";
        presskey = "...";
        custompos = "???????????????????????????";
        settingpos = "??????????????????...";
        settingposrare = "??????????????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam???????????????";
        document.getElementById("langlbl").innerHTML = "??????";
        document.getElementById("raritylbl").innerHTML = "???????????? ";
        document.getElementById("nosteamlbl").innerHTML = "?????? Steam ????????????";
        document.getElementById("customiselbl").innerHTML = "?????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">?????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">?????????';
        document.getElementById("customiserstylelbl").innerHTML = "???????????????";
        document.getElementById("notifypositionlbl").innerHTML = "???????????????";
        document.getElementById("bgtypelbl").innerHTML = "???????????????";
        document.getElementById("colourslbl").innerHTML = "??????";
        document.getElementById("colour1lbl").innerHTML = "?????? 1";
        document.getElementById("colour2lbl").innerHTML = "?????? 2";
        document.getElementById("textcolourlbl").innerHTML = "????????????";
        document.getElementById("imgselectlbl").innerHTML = "????????????"
        document.getElementById("roundnesslbl").innerHTML = "?????????";
        document.getElementById("iconroundnesslbl").innerHTML = "???????????????";
        document.getElementById("displaytimelbl").innerHTML = "???????????????";
        document.getElementById("scalelbl").innerHTML = "?????????";
        document.getElementById("styledefault").innerHTML = "Default";
        document.getElementById("typesolid").innerHTML = "??????";
        document.getElementById("typegradient").innerHTML = "????????????";
        document.getElementById("typeimg").innerHTML = "?????????";
        document.getElementById("dragposlbl").innerHTML = "???????????????????????????";
        document.getElementById("iconselectlbl").innerHTML = "??????????????????";
        document.getElementById("fontsizelbl").innerHTML = "???????????????";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "???????????????";
        document.getElementById("notifypositionlblrare").innerHTML = "???????????????";
        document.getElementById("bgtypelblrare").innerHTML = "???????????????";
        document.getElementById("rarecolourslbl").innerHTML = "??????";
        document.getElementById("colour1lblrare").innerHTML = "?????? 1";
        document.getElementById("colour2lblrare").innerHTML = "?????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "????????????"
        document.getElementById("roundnesslblrare").innerHTML = "?????????";
        document.getElementById("iconroundnesslblrare").innerHTML = "???????????????";
        document.getElementById("displaytimelblrare").innerHTML = "???????????????";
        document.getElementById("scalelblrare").innerHTML = "?????????";
        document.getElementById("styledefaultrare").innerHTML = "Default";
        document.getElementById("typesolidrare").innerHTML = "??????";
        document.getElementById("typegradientrare").innerHTML = "????????????";
        document.getElementById("typeimgrare").innerHTML = "?????????";
        document.getElementById("dragposlblrare").innerHTML = "???????????????????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "??????????????????";
        document.getElementById("fontsizelblrare").innerHTML = "???????????????";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "????????????";

        document.getElementById("trackopacitylbl").innerHTML = "?????????????????????";
        document.getElementById("resetlbl").innerHTML = "???????????????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">????????????</a> ?????????????????????????????????';
        document.getElementById("allpercentlbl").innerHTML = "???????????????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "????????????????????????";
        document.getElementById("hwalbl").innerHTML = "??????????????????";
        document.getElementById("nvdalbl").innerHTML = "?????? NVDA ??????";
        document.getElementById("gamecompletionlbl").innerHTML = "????????????????????????";
        document.getElementById("ssoverlaylbl").innerHTML = "??????????????????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "?????????";
        document.getElementById("opacitylbl").innerHTML = "?????????????????????";

        secret = "???????????????";
        gamecomplete = "???????????????";
        allunlocked = "???????????????????????????";
    } else if (config.lang == "czech") {
        document.getElementById("username").innerHTML = "Nebyl Zji??t??n ????dn?? U??ivatel";
        document.getElementById("gamestatus").innerHTML = "Nebyla Zji??t??na ????dn?? Hra";
        document.getElementById("soundfile").innerHTML = "V??choz?? Nastaven?? (Nen?? Vybr??n ????dn?? Zvuk)";
        document.getElementById("soundfilerare").innerHTML = "V??choz?? Nastaven?? (Nen?? Vybr??n ????dn?? Zvuk)";
        document.getElementById("maincheevsound").innerHTML = "Hlavn?? Zvuk";
        document.getElementById("rarecheevsound").innerHTML = "Vz??cn?? Zvuk";
        document.getElementById("test").innerHTML = "ZOBRAZIT OZN??MEN?? O TESTU";
        document.getElementById("testrare").innerHTML = "ZOBRAZIT OZN??MEN?? O VZ??CN??M TESTU";
        document.getElementById("settingstitle").innerHTML = "NASTAVEN??";
        document.getElementById("configtitle").innerHTML = "KONFIGURACE";
        document.getElementById("apibox").placeholder = "Zadejte API Key";
        document.getElementById("steam64box").placeholder = "Zadejte Steam64ID";
        document.getElementById("other").innerHTML = "OSTATN??";
        document.getElementById("showscreenshotlbl").innerHTML = "Zobrazit Sn??mek Obrazovky";
        document.getElementById("showscreenshotlblrare").innerHTML = "Zobrazit Sn??mek Obrazovky";
        document.getElementById("desktoplbl").innerHTML = "Vytvo??en?? Z??stupce na Desktop";
        document.getElementById("startwinlbl").innerHTML = "Spustit P??i Spu??t??n?? Syst??mu Windows";
        document.getElementById("startminlbl").innerHTML = "Start Minimalizov??n";
        document.getElementById("soundonlylbl").innerHTML = "Re??im Pouze Zvuk";
        document.getElementById("trackinglbl").innerHTML = 'Zobrazit Upozorn??n?? ???Sledov??n?????';

        nouser = "Nebyl Zji??t??n ????dn?? U??ivatel";
        nogame = "Nebyla Zji??t??na ????dn?? Hra";
        nosound = "V??choz?? Nastaven?? (Nen?? Vybr??n ????dn?? Zvuk)";
        nosoundrare = "V??choz?? Nastaven?? (Nen?? Vybr??n ????dn?? Zvuk)";
        rareheader = `'Vz??cn?? ??sp??ch Odem??en!`;
        unlinked = "NEP??IPOJEN??";
        linked = "P??IPOJENO";
        novalue = "Zadejte hodnotu";

        resettitle = "Resetovat Aplikaci Na V??choz???";
        resetdesc = `VAROV??N??: T??mto odstran??te v??echna u??ivatelsk?? nastaven??!`;
        resetbtns = ["Resetovat","Odinstalovat","Zru??it"];

        traylabel = "Nebyla Zji??t??na ????dn?? Hra";
        trayshow = "Uk??zat";
        trayexit = "V??stup";

        //!!!1.8 Translations;
        achievementunlocked = "??sp??ch Odem??en!";
        rareachievementunlocked = "Vz??cn?? ??sp??ch Odem??en!";
        testdesc = "Va??e ozn??men?? funguj?? spr??vn??";

        addsound = "P??idat Vybran?? Zvuk";
        invalid = 'Neplatn?? Typ Souboru';
        addimage = 'P??idat Vybran?? Obr??zek';
        file = "SOUBOR";
        nofolder = "V??choz?? (Nen?? Vybr??na ????dn?? Slo??ka)";
        novalidaudio = "????dn?? platn?? zvukov?? soubory um??st??n?? v ";
        soundmode = "RE??IM ZVUKU: ";
        randomised = "N??HODN??";
        presskey = "...";
        custompos = "Nastavit Vlastn?? Pozici";
        settingpos = "Nastaven?? Hlavn?? Pozice...";
        settingposrare = "Nastaven?? Vz??cn?? Pozice...";

        document.getElementById("steamkeybindlbl").innerHTML = "Tla????tko Sn??mku Obrazovky:";
        document.getElementById("langlbl").innerHTML = "Jazyk:";
        document.getElementById("raritylbl").innerHTML = "Procento Vz??cnosti: ";
        document.getElementById("nosteamlbl").innerHTML = "Skryjte Upozorn??n?? Steam";
        document.getElementById("customiselbl").innerHTML = "UPRAVIT...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Hlavn??';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Vz??cn??';
        document.getElementById("customiserstylelbl").innerHTML = "STYL OZN??MEN??:";
        document.getElementById("notifypositionlbl").innerHTML = "POLOHA OBRAZOVKY:";
        document.getElementById("bgtypelbl").innerHTML = "TYP POZAD??:";
        document.getElementById("colourslbl").innerHTML = "BARVY";
        document.getElementById("colour1lbl").innerHTML = "Barva 1";
        document.getElementById("colour2lbl").innerHTML = "Barva 2";
        document.getElementById("textcolourlbl").innerHTML = "Barva Textu";
        document.getElementById("imgselectlbl").innerHTML = "OBR??ZEK ??????NA POZAD??:"
        document.getElementById("roundnesslbl").innerHTML = "ZAOKROUHLEN??:";
        document.getElementById("iconroundnesslbl").innerHTML = "IKONY ZAOKROUHLEN??:";
        document.getElementById("displaytimelbl").innerHTML = "??AS ZOBRAZEN??:";
        document.getElementById("scalelbl").innerHTML = "M??????TKO:";
        document.getElementById("styledefault").innerHTML = "V??choz??";
        document.getElementById("typesolid").innerHTML = "Pln?? Barva";
        document.getElementById("typegradient").innerHTML = "Barevn?? P??echod";
        document.getElementById("typeimg").innerHTML = "Obr??zek Na Pozad??";
        document.getElementById("dragposlbl").innerHTML = "Pou??ijte Vlastn?? Pozici";
        document.getElementById("iconselectlbl").innerHTML = "VLASTN?? IKONA:";
        document.getElementById("fontsizelbl").innerHTML = "VELIKOST P??SMA:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Resetovat Pozici";

        document.getElementById("customiserstylelblrare").innerHTML = "STYL OZN??MEN??:";
        document.getElementById("notifypositionlblrare").innerHTML = "POLOHA OBRAZOVKY:";
        document.getElementById("bgtypelblrare").innerHTML = "TYP POZAD??:";
        document.getElementById("rarecolourslbl").innerHTML = "BARVY";
        document.getElementById("colour1lblrare").innerHTML = "Barva 1";
        document.getElementById("colour2lblrare").innerHTML = "Barva 2";
        document.getElementById("textcolourlblrare").innerHTML = "Barva Textu";
        document.getElementById("rareimgselectlbl").innerHTML = "OBR??ZEK ??????NA POZAD??:"
        document.getElementById("roundnesslblrare").innerHTML = "ZAOKROUHLEN??:";
        document.getElementById("iconroundnesslblrare").innerHTML = "IKONY ZAOKROUHLEN??:";
        document.getElementById("displaytimelblrare").innerHTML = "??AS ZOBRAZEN??:";
        document.getElementById("scalelblrare").innerHTML = "M??????TKO:";
        document.getElementById("styledefaultrare").innerHTML = "V??choz??";
        document.getElementById("typesolidrare").innerHTML = "Pln?? Barva";
        document.getElementById("typegradientrare").innerHTML = "Barevn?? P??echod";
        document.getElementById("typeimgrare").innerHTML = "Obr??zek Na Pozad??";
        document.getElementById("dragposlblrare").innerHTML = "Pou??ijte Vlastn?? Pozici";
        document.getElementById("rareiconselectlbl").innerHTML = "VLASTN?? IKONA:";
        document.getElementById("fontsizelblrare").innerHTML = "VELIKOST P??SMA:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Resetovat Pozici";

        document.getElementById("trackopacitylbl").innerHTML = "Nepr??hlednost:";
        document.getElementById("resetlbl").innerHTML = "Resetovat Aplikaci";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Podrobnosti hry</a> mus?? b??t ???Ve??ejn?????.';
        document.getElementById("allpercentlbl").innerHTML = "Zobrazit V??echna Procenta ??sp??ch??";
        document.getElementById("iconanimationlbl").innerHTML = "Zobrazit Animaci Vz??cn??ch Ikon";
        document.getElementById("hwalbl").innerHTML = "Zak??zat Hardwarovou Akceleraci";
        document.getElementById("nvdalbl").innerHTML = "Povolit Podporu NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Zobrazit Ozn??men?? O Dokon??en?? Hry";
        document.getElementById("ssoverlaylbl").innerHTML = "Ulo??te Sn??mky Obrazovky s P??ekryt??m";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Cesta:";
        document.getElementById("opacitylbl").innerHTML = "Nepr??hlednost Ozn??men??:";

        secret = "Tajn?? ??sp??ch!";
        gamecomplete = "Hra Dokon??ena!";
        allunlocked = "Odemkli jste v??echny ??sp??chy!";
    } else if (config.lang == "danish") {
        document.getElementById("username").innerHTML = "Ingen Bruger Fundet";
        document.getElementById("gamestatus").innerHTML = "Intet Spil Opdaget";
        document.getElementById("soundfile").innerHTML = "Standard (Ingen Lyd Valgt)";
        document.getElementById("soundfilerare").innerHTML = "Standard (Ingen Lyd Valgt)";
        document.getElementById("maincheevsound").innerHTML = "Hovedlyd";
        document.getElementById("rarecheevsound").innerHTML = "Sj??lden Lyd";
        document.getElementById("test").innerHTML = "VIS TEST";
        document.getElementById("testrare").innerHTML = "VIS SJ??LDEN TEST";
        document.getElementById("settingstitle").innerHTML = "INDSTILLINGER";
        document.getElementById("configtitle").innerHTML = "KONFIGURATION";
        document.getElementById("apibox").placeholder = "Indtast API Key";
        document.getElementById("steam64box").placeholder = "Indtast Steam64ID";
        document.getElementById("other").innerHTML = "ANDRE";
        document.getElementById("showscreenshotlbl").innerHTML = "Vis Sk??rmbillede";
        document.getElementById("showscreenshotlblrare").innerHTML = "Vis Sk??rmbillede";
        document.getElementById("desktoplbl").innerHTML = "Opret Genvej Til Desktop";
        document.getElementById("startwinlbl").innerHTML = "Start med Windows";
        document.getElementById("startminlbl").innerHTML = "Start Minimeret Til Systembakken";
        document.getElementById("soundonlylbl").innerHTML = "Kun Lyd-Tilstand";
        document.getElementById("trackinglbl").innerHTML = 'Vis Meddelelse Om "Nu Sporing"';

        nouser = "Ingen Bruger Fundet";
        nogame = "Intet Spil Opdaget";
        nosound = "Standard (Ingen Lyd Valgt)";
        nosoundrare = "Standard (Ingen Lyd Valgt)";
        rareheader = `'Sj??lden Pr??station L??st Op!`;
        unlinked = "ULINKET";
        linked = "LINKET";
        novalue = "Indtast venligst en v??rdi";

        resettitle = "Nulstil Applikation Til Standard?";
        resetdesc = `ADVARSEL: Dette vil fjerne alle brugerindstillinger!`;
        resetbtns = ["Nulstil","Afinstaller","Afbestille"];
    
        traylabel = "Intet Spil Opdaget";
        trayshow = "At Vise";
        trayexit = "Afslut";

        //!!!1.8 Translations;
        achievementunlocked = "Pr??station L??st Op!";
        rareachievementunlocked = "Sj??lden Pr??station L??st Op!";
        testdesc = "Dine meddelelser fungerer korrekt";

        addsound = "Tilf??j Valgt Lyd";
        invalid = 'Ugyldig Filtype';
        addimage = 'Tilf??j Valgt Billede';
        file = "FIL";
        nofolder = "Standard (Ingen Mappe Valgt)";
        novalidaudio = "Der er ingen gyldige lydfiler i ";
        soundmode = "LYDTILSTAND: ";
        randomised = "TILF??LDIG";
        presskey = "...";
        custompos = "Indstil Brugerdefineret Sk??rmposition";
        settingpos = "Indstilling Af Hovedposition...";
        settingposrare = "Indstilling Af Sj??lden Position...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam Sk??rmbillede Knap:";
        document.getElementById("langlbl").innerHTML = "Sprog:";
        document.getElementById("raritylbl").innerHTML = "Sj??ldenhedsprocent: ";
        document.getElementById("nosteamlbl").innerHTML = "Skjul Steam-Meddelelse";
        document.getElementById("customiselbl").innerHTML = "TILPASSER...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Hoved';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Sj??lden';
        document.getElementById("customiserstylelbl").innerHTML = "MEDDELELSESSTIL:";
        document.getElementById("notifypositionlbl").innerHTML = "SK??RMPOSITION:";
        document.getElementById("bgtypelbl").innerHTML = "BAGGRUNDSTYPE:";
        document.getElementById("colourslbl").innerHTML = "FARVER";
        document.getElementById("colour1lbl").innerHTML = "Farve 1";
        document.getElementById("colour2lbl").innerHTML = "Farve 2";
        document.getElementById("textcolourlbl").innerHTML = "Tekst Farve";
        document.getElementById("imgselectlbl").innerHTML = "BAGGRUNDSBILLEDE:"
        document.getElementById("roundnesslbl").innerHTML = "RUNDHED:";
        document.getElementById("iconroundnesslbl").innerHTML = "IKON RUNDHED:";
        document.getElementById("displaytimelbl").innerHTML = "DISPLAY TID:";
        document.getElementById("scalelbl").innerHTML = "ST??RRELSE:";
        document.getElementById("styledefault").innerHTML = "Standard";
        document.getElementById("typesolid").innerHTML = "Ensfarvet";
        document.getElementById("typegradient").innerHTML = "Farvegradient";
        document.getElementById("typeimg").innerHTML = "Baggrundsbillede";
        document.getElementById("dragposlbl").innerHTML = "Brug Brugerdefineret Position";
        document.getElementById("iconselectlbl").innerHTML = "BRUGERDEFINERET IKON:";
        document.getElementById("fontsizelbl").innerHTML = "SKRIFTST??RRELSE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Nulstil Position";

        document.getElementById("customiserstylelblrare").innerHTML = "MEDDELELSESSTIL:";
        document.getElementById("notifypositionlblrare").innerHTML = "SK??RMPOSITION:";
        document.getElementById("bgtypelblrare").innerHTML = "BAGGRUNDSTYPE:";
        document.getElementById("rarecolourslbl").innerHTML = "FARVER";
        document.getElementById("colour1lblrare").innerHTML = "Farve 1";
        document.getElementById("colour2lblrare").innerHTML = "Farve 2";
        document.getElementById("textcolourlblrare").innerHTML = "Tekst Farve";
        document.getElementById("rareimgselectlbl").innerHTML = "BAGGRUNDSBILLEDE:"
        document.getElementById("roundnesslblrare").innerHTML = "RUNDHED:";
        document.getElementById("iconroundnesslblrare").innerHTML = "IKON RUNDHED:";
        document.getElementById("displaytimelblrare").innerHTML = "DISPLAY TID:";
        document.getElementById("scalelblrare").innerHTML = "ST??RRELSE:";
        document.getElementById("styledefaultrare").innerHTML = "Standard";
        document.getElementById("typesolidrare").innerHTML = "Ensfarvet";
        document.getElementById("typegradientrare").innerHTML = "Farvegradient";
        document.getElementById("typeimgrare").innerHTML = "Baggrundsbillede";
        document.getElementById("dragposlblrare").innerHTML = "Brug Brugerdefineret Position";
        document.getElementById("rareiconselectlbl").innerHTML = "BRUGERDEFINERET IKON:";
        document.getElementById("fontsizelblrare").innerHTML = "SKRIFTST??RRELSE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Nulstil Position";

        document.getElementById("trackopacitylbl").innerHTML = "Gennemsigtighed:";
        document.getElementById("resetlbl").innerHTML = "Nulstil Applikation";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Spildetaljer</a> skal ogs?? indstilles til "Offentlig".';
        document.getElementById("allpercentlbl").innerHTML = "Vis Alle Procenter";
        document.getElementById("iconanimationlbl").innerHTML = "Vis Sj??ldne Ikonanimationer";
        document.getElementById("hwalbl").innerHTML = "Deaktiver Hardwareacceleration";
        document.getElementById("nvdalbl").innerHTML = "Aktiver NVDA-support";
        document.getElementById("gamecompletionlbl").innerHTML = "Vis Meddelelse Om Spilafslutning";
        document.getElementById("ssoverlaylbl").innerHTML = "Gem Sk??rmbilleder med Overlay";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Sti:";
        document.getElementById("opacitylbl").innerHTML = "Gennemsigtighed:";

        secret = "Hemmelig Pr??station!";
        gamecomplete = "Spil F??rdig!";
        allunlocked = "Du har l??st op for alle pr??stationer!";
    } else if (config.lang == "dutch") {
        document.getElementById("username").innerHTML = "Geen Gebruiker Gedetecteerd";
        document.getElementById("gamestatus").innerHTML = "Geen Spel Gedetecteerd";
        document.getElementById("soundfile").innerHTML = "Standaard (Geen Geluid Geselecteerd)";
        document.getElementById("soundfilerare").innerHTML = "Standaard (Geen Geluid Geselecteerd)";
        document.getElementById("maincheevsound").innerHTML = "Hoofdgeluid";
        document.getElementById("rarecheevsound").innerHTML = "Zeldzaam Geluid";
        document.getElementById("test").innerHTML = "TOON TESTMELDING";
        document.getElementById("testrare").innerHTML = "TOON ZELDZAME TESTMELDING";
        document.getElementById("settingstitle").innerHTML = "INSTELLINGEN";
        document.getElementById("configtitle").innerHTML = "CONFIGURATIE";
        document.getElementById("apibox").placeholder = "Voer API Key in";
        document.getElementById("steam64box").placeholder = "Voer Steam64ID in";
        document.getElementById("other").innerHTML = "ANDERE";
        document.getElementById("showscreenshotlbl").innerHTML = "Schermafbeelding Prestatie Tonen";
        document.getElementById("showscreenshotlblrare").innerHTML = "Schermafbeelding Prestatie Tonen";
        document.getElementById("desktoplbl").innerHTML = "Snelkoppeling Naar Desktop Maken";
        document.getElementById("startwinlbl").innerHTML = "Begin met Windows";
        document.getElementById("startminlbl").innerHTML = "Start Geminimaliseerd";
        document.getElementById("soundonlylbl").innerHTML = "Alleen Geluidsmodus";
        document.getElementById("trackinglbl").innerHTML = 'Spelmelding Weergeven';

        nouser = "Geen Gebruiker Gedetecteerd";
        nogame = "Geen Spel Gedetecteerd";
        nosound = "Standaard (Geen Geluid Geselecteerd)";
        nosoundrare = "Standaard (Geen Geluid Geselecteerd)";
        rareheader = `'Zeldzame Prestatie Ontgrendeld!`;
        unlinked = "NIET GEKOPPELD";
        linked = "GEKOPPELD";
        novalue = "Voer alstublieft een waarde in";
    
        resettitle = "Toepassing Terugzetten Naar Standaard?";
        resetdesc = `WAARSCHUWING: Hiermee worden alle gebruikersinstellingen verwijderd!`;
        resetbtns = ["Resetten","Verwijderen","Annuleren"];
    
        traylabel = "Geen Spel Gedetecteerd";
        trayshow = "Toon";
        trayexit = "Sluit";

        //!!!1.8 Translations;
        achievementunlocked = "Prestatie Ontgrendeld!";
        rareachievementunlocked = "Zeldzame Prestatie Ontgrendeld!";
        testdesc = "Uw meldingen werken correct";

        addsound = "Geluid Toevoegen";
        invalid = 'Ongeldig Bestandstype';
        addimage = 'Voeg Afbeelding Toe';
        file = "DOSSIER";
        nofolder = "Standaard (Geen Map Geselecteerd)";
        novalidaudio = "Geen geldige audiobestanden in ";
        soundmode = "GELUID MODUS: ";
        randomised = "GERANDOMISEERD";
        presskey = "...";
        custompos = "Aangepaste Schermpositie Instellen";
        settingpos = "Hoofdpositie Instellen...";
        settingposrare = "Zeldzame Positie Instellen...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam Schermafbeelding Knop";
        document.getElementById("langlbl").innerHTML = "Taal:";
        document.getElementById("raritylbl").innerHTML = "Zeldzaamheid: ";
        document.getElementById("nosteamlbl").innerHTML = "Steam-Melding Verbergen";
        document.getElementById("customiselbl").innerHTML = "BEWERK...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Voornaamst';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Zeldzaam';
        document.getElementById("customiserstylelbl").innerHTML = "STIJL VAN MELDINGEN:";
        document.getElementById("notifypositionlbl").innerHTML = "SCHERMPOSITIE:";
        document.getElementById("bgtypelbl").innerHTML = "ACHTERGRONDTYPE:";
        document.getElementById("colourslbl").innerHTML = "KLEUREN";
        document.getElementById("colour1lbl").innerHTML = "Kleur 1";
        document.getElementById("colour2lbl").innerHTML = "Kleur 2";
        document.getElementById("textcolourlbl").innerHTML = "Tekstkleur";
        document.getElementById("imgselectlbl").innerHTML = "ACHTERGROND AFBEELDING:"
        document.getElementById("roundnesslbl").innerHTML = "RONDHEID:";
        document.getElementById("iconroundnesslbl").innerHTML = "ICOON RONDHEID:";
        document.getElementById("displaytimelbl").innerHTML = "WEERGAVETIJD:";
        document.getElementById("scalelbl").innerHTML = "SCHAAL:";
        document.getElementById("styledefault").innerHTML = "Standaard";
        document.getElementById("typesolid").innerHTML = "Effen Kleur";
        document.getElementById("typegradient").innerHTML = "Kleurverloop";
        document.getElementById("typeimg").innerHTML = "Achtergrond Afbeelding";
        document.getElementById("dragposlbl").innerHTML = "Aangepaste Schermpositie Gebruiken";
        document.getElementById("iconselectlbl").innerHTML = "AANGEPASTE ICOON:";
        document.getElementById("fontsizelbl").innerHTML = "LETTERTYPEGROOTTE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Positie Resetten";
        
        document.getElementById("customiserstylelblrare").innerHTML = "STIJL VAN MELDINGEN:";
        document.getElementById("notifypositionlblrare").innerHTML = "SCHERMPOSITIE:";
        document.getElementById("bgtypelblrare").innerHTML = "ACHTERGRONDTYPE:";
        document.getElementById("rarecolourslbl").innerHTML = "KLEUREN";
        document.getElementById("colour1lblrare").innerHTML = "Kleur 1";
        document.getElementById("colour2lblrare").innerHTML = "Kleur 2";
        document.getElementById("textcolourlblrare").innerHTML = "Tekstkleur";
        document.getElementById("rareimgselectlbl").innerHTML = "ACHTERGROND AFBEELDING:"
        document.getElementById("roundnesslblrare").innerHTML = "RONDHEID:";
        document.getElementById("iconroundnesslblrare").innerHTML = "ICOON RONDHEID:";
        document.getElementById("displaytimelblrare").innerHTML = "WEERGAVETIJD:";
        document.getElementById("scalelblrare").innerHTML = "SCHAAL:";
        document.getElementById("styledefaultrare").innerHTML = "Standaard";
        document.getElementById("typesolidrare").innerHTML = "Effen Kleur";
        document.getElementById("typegradientrare").innerHTML = "Kleurverloop";
        document.getElementById("typeimgrare").innerHTML = "Achtergrond Afbeelding";
        document.getElementById("dragposlblrare").innerHTML = "Aangepaste Schermpositie Gebruiken";
        document.getElementById("rareiconselectlbl").innerHTML = "AANGEPASTE ICOON:";
        document.getElementById("fontsizelblrare").innerHTML = "LETTERTYPEGROOTTE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Positie Resetten";
        
        document.getElementById("trackopacitylbl").innerHTML = "Transparantie:";
        document.getElementById("resetlbl").innerHTML = "Applicatie Resetten";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Speldetails</a> moeten ook zijn ingesteld op "Openbaar".';
        document.getElementById("allpercentlbl").innerHTML = "Toon Alle Percentages";
        document.getElementById("iconanimationlbl").innerHTML = "Animatie Van Zeldzame Iconen Weergeven";
        document.getElementById("hwalbl").innerHTML = "Hardwareversnelling Uitschakelen";
        document.getElementById("nvdalbl").innerHTML = "NVDA-Ondersteuning Inschakelen";
        document.getElementById("gamecompletionlbl").innerHTML = "Melding Game-Voltooiing Weergeven";
        document.getElementById("ssoverlaylbl").innerHTML = "Schermafbeeldingen Opslaan met Overlay";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Pad:";
        document.getElementById("opacitylbl").innerHTML = "Transparantie:";

        secret = "Geheime Prestatie!";
        gamecomplete = "Spel Compleet!";
        allunlocked = "Je hebt alle prestaties ontgrendeld!";
    } else if (config.lang == "finnish") {
        document.getElementById("username").innerHTML = "K??ytt??j???? Ei Havaittu";
        document.getElementById("gamestatus").innerHTML = "Peli?? Ei Havaittu";
        document.getElementById("soundfile").innerHTML = "Oletusarvo (Ei ????nt?? Valittuna)";
        document.getElementById("soundfilerare").innerHTML = "Oletusarvo (Ei ????nt?? Valittuna)";
        document.getElementById("maincheevsound").innerHTML = "T??rkein Saavutus ????ni";
        document.getElementById("rarecheevsound").innerHTML = "Harvinainen Saavutus ????ni";
        document.getElementById("test").innerHTML = "N??YT?? TESTI-ILMOITUS";
        document.getElementById("testrare").innerHTML = "N??YT?? HARVINAINEN TESTI-ILMOITUS";
        document.getElementById("settingstitle").innerHTML = "ASETUKSET";
        document.getElementById("configtitle").innerHTML = "KONFIGUROINTI";
        document.getElementById("apibox").placeholder = "Anna APIKey";
        document.getElementById("steam64box").placeholder = "Anna Steam64ID";
        document.getElementById("other").innerHTML = "MUUT";
        document.getElementById("showscreenshotlbl").innerHTML = "N??yt?? Kuvakaappaus";
        document.getElementById("showscreenshotlblrare").innerHTML = "N??yt?? Kuvakaappaus";
        document.getElementById("desktoplbl").innerHTML = "Luo Desktop Pikakuvake";
        document.getElementById("startwinlbl").innerHTML = "Aloita Windowsista";
        document.getElementById("startminlbl").innerHTML = "K??ynnist?? Minimoitu";
        document.getElementById("soundonlylbl").innerHTML = "????nitila";
        document.getElementById("trackinglbl").innerHTML = 'N??yt?? "Nyt Seuranta"-viesti';

        nouser = "K??ytt??j???? Ei Havaittu";
        nogame = "Peli?? Ei Havaittu";
        nosound = "Oletusarvo (Ei ????nt?? Valittuna)";
        nosoundrare = "Oletusarvo (Ei ????nt?? Valittuna)";
        rareheader = `'Harvinainen saavutus avattu!`;
        unlinked = "EI LINKITTY";
        linked = "LINKITTY";
        novalue = "Anna arvo";

        resettitle = "Palautetaanko Sovellus Oletusasetuksiin?";
        resetdesc = `VAROITUS: T??m?? poistaa kaikki k??ytt??j??asetukset!`;
        resetbtns = ["Nollaa","Poista Asennus","Peruuttaa"];
    
        traylabel = "Peli?? Ei Havaittu";
        trayshow = "N??yt??";
        trayexit = "Poistu";

        //!!!1.8 Translations;
        achievementunlocked = "Saavutus Avattu!";
        rareachievementunlocked = "Harvinainen Saavutus Avattu!";
        testdesc = "Ilmoituksesi toimivat oikein";

        addsound = "Lis???? Valittu ????ni";
        invalid = 'V????r?? Tiedostotyyppi';
        addimage = 'Lis???? Valittu Kuva';
        file = "TIEDOSTO";
        nofolder = "Oletus (Ei Valittua Kansiota)";
        novalidaudio = "Ei kelvollisia ????nitiedostoja kansiossa ";
        soundmode = "????NITILA: ";
        randomised = "SATUNNAISTETTU";
        presskey = "...";
        custompos = "Aseta Mukautettu N??yt??n Sijainti";
        settingpos = "Asetetaan P????asentoa...";
        settingposrare = "Asetetaan Harvinaista Paikkaa...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam Kuvakaappauspainike:";
        document.getElementById("langlbl").innerHTML = "Kieli:";
        document.getElementById("raritylbl").innerHTML = "Harvinainen Prosentti: ";
        document.getElementById("nosteamlbl").innerHTML = "Piilota Steam-ilmoitus";
        document.getElementById("customiselbl").innerHTML = "MUOKKAA...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">T??rkein';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Harvinainen';
        document.getElementById("customiserstylelbl").innerHTML = "ILMOITUSTYYLI:";
        document.getElementById("notifypositionlbl").innerHTML = "N??YT??N ASENTO:";
        document.getElementById("bgtypelbl").innerHTML = "TAUSTATYYPPI:";
        document.getElementById("colourslbl").innerHTML = "V??RIT";
        document.getElementById("colour1lbl").innerHTML = "V??ri 1";
        document.getElementById("colour2lbl").innerHTML = "V??ri 2";
        document.getElementById("textcolourlbl").innerHTML = "Tekstin V??ri";
        document.getElementById("imgselectlbl").innerHTML = "TAUSTAKUVA:"
        document.getElementById("roundnesslbl").innerHTML = "PY??RIST??MINEN:";
        document.getElementById("iconroundnesslbl").innerHTML = "IKONIN PY??RIST??MINEN:";
        document.getElementById("displaytimelbl").innerHTML = "ILMOITUSAIKA:";
        document.getElementById("scalelbl").innerHTML = "SKALE:";
        document.getElementById("styledefault").innerHTML = "Vakio";
        document.getElementById("typesolid").innerHTML = "Yksiv??rinen";
        document.getElementById("typegradient").innerHTML = "V??rigradientti";
        document.getElementById("typeimg").innerHTML = "Taustakuva";
        document.getElementById("dragposlbl").innerHTML = "K??yt?? Mukautettua Sijaintia";
        document.getElementById("iconselectlbl").innerHTML = "MUKAUTETTU KUVAKE:";
        document.getElementById("fontsizelbl").innerHTML = "FONTTIKOKO:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Palauta Sijainti";

        document.getElementById("customiserstylelblrare").innerHTML = "ILMOITUSTYYLI:";
        document.getElementById("notifypositionlblrare").innerHTML = "N??YT??N ASENTO:";
        document.getElementById("bgtypelblrare").innerHTML = "TAUSTATYYPPI:";
        document.getElementById("rarecolourslbl").innerHTML = "V??RIT";
        document.getElementById("colour1lblrare").innerHTML = "V??ri 1";
        document.getElementById("colour2lblrare").innerHTML = "V??ri 2";
        document.getElementById("textcolourlblrare").innerHTML = "Tekstin v??ri";
        document.getElementById("rareimgselectlbl").innerHTML = "TAUSTAKUVA:"
        document.getElementById("roundnesslblrare").innerHTML = "PY??RIST??MINEN:";
        document.getElementById("iconroundnesslblrare").innerHTML = "IKONIN PY??RIST??MINEN:";
        document.getElementById("displaytimelblrare").innerHTML = "ILMOITUSAIKA:";
        document.getElementById("scalelblrare").innerHTML = "SKALE:";
        document.getElementById("styledefaultrare").innerHTML = "Vakio";
        document.getElementById("typesolidrare").innerHTML = "Yksiv??rinen";
        document.getElementById("typegradientrare").innerHTML = "V??rigradientti";
        document.getElementById("typeimgrare").innerHTML = "Taustakuva";
        document.getElementById("dragposlblrare").innerHTML = "K??yt?? Mukautettua Sijaintia";
        document.getElementById("rareiconselectlbl").innerHTML = "MUKAUTETTU KUVAKE:";
        document.getElementById("fontsizelblrare").innerHTML = "FONTTIKOKO:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Palauta Sijainti";        

        document.getElementById("trackopacitylbl").innerHTML = "L??pin??kyvyys:";
        document.getElementById("resetlbl").innerHTML = "Nollaa Sovellus";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Pelin tiedot</a> on my??s asetettava "Julkinen".';
        document.getElementById("allpercentlbl").innerHTML = "N??yt?? Kaikki Saavutusprosentit";
        document.getElementById("iconanimationlbl").innerHTML = "N??yt?? Harvinainen Kuvake-Animaatio";
        document.getElementById("hwalbl").innerHTML = "Poista Hardware Acceleration K??yt??st??";
        document.getElementById("nvdalbl").innerHTML = "Ota NVDA-Tuki K??ytt????n";
        document.getElementById("gamecompletionlbl").innerHTML = "N??yt?? Pelin P????ttymisilmoitus";
        document.getElementById("ssoverlaylbl").innerHTML = "Tallenna Kuvakaappaukset Peittokuvalla";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Polku:";
        document.getElementById("opacitylbl").innerHTML = "Ilmoituksen L??pin??kyvyys:";

        secret = "Salainen Saavutus!";
        gamecomplete = "Peli Valmis!";
        allunlocked = "Olet avannut kaikki saavutukset!";
    } else if (config.lang == "french") {
        document.getElementById("username").innerHTML = "Aucun Utilisateur D??tect??";
        document.getElementById("gamestatus").innerHTML = "Aucun Jeu D??tect??";
        document.getElementById("soundfile").innerHTML = "Par D??faut (Aucun Son S??lectionn??)";
        document.getElementById("soundfilerare").innerHTML = "Par D??faut (Aucun Son S??lectionn??)";
        document.getElementById("maincheevsound").innerHTML = "Son Succ??s Normal";
        document.getElementById("rarecheevsound").innerHTML = "Son Succ??s Rare";
        document.getElementById("test").innerHTML = "TEST SUCC??S NORMAL";
        document.getElementById("testrare").innerHTML = "TEST SUCC??S RARE";
        document.getElementById("settingstitle").innerHTML = "PARAM??TRES";
        document.getElementById("configtitle").innerHTML = "CONFIGURATION";
        document.getElementById("apibox").placeholder = "Entrez cl?? API";
        document.getElementById("steam64box").placeholder = "Entrez Steam64ID";
        document.getElementById("other").innerHTML = "AUTRE";
        document.getElementById("showscreenshotlbl").innerHTML = "Afficher la Capture d'??cran";
        document.getElementById("showscreenshotlblrare").innerHTML = "Afficher la Capture d'??cran";
        document.getElementById("desktoplbl").innerHTML = "Cr??e Un Raccourci Bureau";
        document.getElementById("startwinlbl").innerHTML = "D??marrage Automatique";
        document.getElementById("startminlbl").innerHTML = "D??marrage Minimis??";
        document.getElementById("soundonlylbl").innerHTML = "Mode Audio Uniquement";
        document.getElementById("trackinglbl").innerHTML = 'Afficher "Suivi des Succ??s"';

        nouser = "Aucun Utilisateur D??tect??";
        nogame = "Aucun Jeu D??tect??";
        nosound = "Par D??faut (Aucun Son S??lectionn??)";
        nosoundrare = "Par D??faut (Aucun Son S??lectionn??)";
        rareheader = `'Succ??s Rare D??bloqu??!`;
        unlinked = "NON CONNECT??";
        linked = "CONNECT??";
        novalue = "Veuillez entrer une valeur";
        
        resettitle = "R??initialiser l'Application Par D??faut?";
        resetdesc = `AVERTISSEMENT:??Cela supprimera tous les param??tres utilisateur!`;
        resetbtns = ["R??initialiser","D??sinstaller","Annuler"];
    
        traylabel = "Aucun Jeu D??tect??";
        trayshow = "Afficher";
        trayexit = "Sortir";

        //!!!1.8 Translations;
        achievementunlocked = "Succ??s D??v??rouill??!";
        rareachievementunlocked = "Succ??s Rare D??v??rouill??!";
        testdesc = "Vos notifications fonctionnent correctement";

        addsound = "Ajouter Le Son S??lectionn??";
        invalid = 'Type De Fichier Invalide';
        addimage = `Ajouter L'image S??lectionn??e`;
        file = "FICHIER";
        nofolder = "Par D??faut (Aucun Dossier S??lectionn??)";
        novalidaudio = "Aucun fichier audio valide situ?? dans";
        soundmode = "MODE SON: ";
        randomised = "AL??ATOIRE";
        presskey = "...";
        custompos = "D??finir la Position Personnalis??e";
        settingpos = "R??glage Principal...";
        settingposrare = "R??glage Rare...";

        document.getElementById("steamkeybindlbl").innerHTML = "Bouton de Capture d'??cran Steam: ";
        document.getElementById("langlbl").innerHTML = "Langue:";
        document.getElementById("raritylbl").innerHTML = "Pourcentage de Raret??: ";
        document.getElementById("nosteamlbl").innerHTML = "Masquer la Notification Steam";
        document.getElementById("customiselbl").innerHTML = "PERSONNALISER...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Principal';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Rare';
        document.getElementById("customiserstylelbl").innerHTML = "STYLE DE NOTIFICATION:";
        document.getElementById("notifypositionlbl").innerHTML = "POSITION DE L'??CRAN:";
        document.getElementById("bgtypelbl").innerHTML = "TYPE DE FOND:";
        document.getElementById("colourslbl").innerHTML = "COULEURS";
        document.getElementById("colour1lbl").innerHTML = "Couleur 1";
        document.getElementById("colour2lbl").innerHTML = "Couleur 2";
        document.getElementById("textcolourlbl").innerHTML = "Couleur du Texte";
        document.getElementById("imgselectlbl").innerHTML = "IMAGE DE FOND:"
        document.getElementById("roundnesslbl").innerHTML = "RONDEUR:";
        document.getElementById("iconroundnesslbl").innerHTML = "RONDEUR DES IC??NES:";
        document.getElementById("displaytimelbl").innerHTML = "TEMPS D'AFFICHAGE:";
        document.getElementById("scalelbl").innerHTML = "TAILLE:";
        document.getElementById("styledefault").innerHTML = "D??faut";
        document.getElementById("typesolid").innerHTML = "Couleur Unie";
        document.getElementById("typegradient").innerHTML = "D??grad?? de Couleur";
        document.getElementById("typeimg").innerHTML = "Image de Fond";
        document.getElementById("dragposlbl").innerHTML = "Utiliser la Position Personnalis??e";
        document.getElementById("iconselectlbl").innerHTML = "IC??NE PERSONNALIS??E??:";
        document.getElementById("fontsizelbl").innerHTML = "TAILLE DE POLICE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Position de R??initialisation";

        document.getElementById("customiserstylelblrare").innerHTML = "STYLE DE NOTIFICATION:";
        document.getElementById("notifypositionlblrare").innerHTML = "POSITION DE L'??CRAN:";
        document.getElementById("bgtypelblrare").innerHTML = "TYPE DE FOND:";
        document.getElementById("rarecolourslbl").innerHTML = "COULEURS";
        document.getElementById("colour1lblrare").innerHTML = "Couleur 1";
        document.getElementById("colour2lblrare").innerHTML = "Couleur 2";
        document.getElementById("textcolourlblrare").innerHTML = "Couleur du Texte";
        document.getElementById("rareimgselectlbl").innerHTML = "IMAGE DE FOND:"
        document.getElementById("roundnesslblrare").innerHTML = "RONDEUR:";
        document.getElementById("iconroundnesslblrare").innerHTML = "RONDEUR DES IC??NES:";
        document.getElementById("displaytimelblrare").innerHTML = "TEMPS D'AFFICHAGE:";
        document.getElementById("scalelblrare").innerHTML = "TAILLE:";
        document.getElementById("styledefaultrare").innerHTML = "D??faut";
        document.getElementById("typesolidrare").innerHTML = "Couleur Unie";
        document.getElementById("typegradientrare").innerHTML = "D??grad?? de Couleur";
        document.getElementById("typeimgrare").innerHTML = "Image de Fond";
        document.getElementById("dragposlblrare").innerHTML = "Utiliser la Position Personnalis??e";
        document.getElementById("rareiconselectlbl").innerHTML = "IC??NE PERSONNALIS??E??:";
        document.getElementById("fontsizelblrare").innerHTML = "TAILLE DE POLICE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Position de R??initialisation";

        document.getElementById("trackopacitylbl").innerHTML = "Opacit?? de Suivi:";
        document.getElementById("resetlbl").innerHTML = "R??initialiser l'Application";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Les d??tails du jeu</a> doivent ??galement ??tre d??finis sur "Public".';
        document.getElementById("allpercentlbl").innerHTML = "Afficher Tous les Pourcentages";
        document.getElementById("iconanimationlbl").innerHTML = "Afficher l'Animation Des Ic??nes Rares";
        document.getElementById("hwalbl").innerHTML = "D??sactiver l'Acc??l??ration Mat??rielle";
        document.getElementById("nvdalbl").innerHTML = "Activer la Prise en Charge de NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Afficher la Notification de Fin de Jeu";
        document.getElementById("ssoverlaylbl").innerHTML = "Enregistrer des Captures d'??cran avec Superposition";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Chemin:";
        document.getElementById("opacitylbl").innerHTML = "Opacit?? des Notifications:";

        secret = "R??alisation Secr??te!";
        gamecomplete = "Jeu Complet!";
        allunlocked = "Vous avez d??bloqu?? toutes les r??alisations!";
    } else if (config.lang == "german") {
        document.getElementById("username").innerHTML = "Kein Benutzer Erkannt";
        document.getElementById("gamestatus").innerHTML = "Kein Spiel Erkannt";
        document.getElementById("soundfile").innerHTML = "Standard (Kein Ton Ausgew??hlt)";
        document.getElementById("soundfilerare").innerHTML = "Standard (Kein Ton Ausgew??hlt)";
        document.getElementById("maincheevsound").innerHTML = "Ton F??r Normale Errungenschaften";
        document.getElementById("rarecheevsound").innerHTML = "Ton F??r Seltene Errungenschaften";
        document.getElementById("test").innerHTML = "TESTBENACHRICHTIGUNG ANZEIGEN";
        document.getElementById("testrare").innerHTML = "SELTENE TESTBENACHRICHTIGUNG ANZEIGEN";
        document.getElementById("settingstitle").innerHTML = "EINSTELLUNGEN";
        document.getElementById("configtitle").innerHTML = "KONFIGURATION";
        document.getElementById("apibox").placeholder = "API Key eingeben";
        document.getElementById("steam64box").placeholder = "Steam64ID eingeben";
        document.getElementById("other").innerHTML = "SONSTIGES";
        document.getElementById("showscreenshotlbl").innerHTML = "Bildschirmfoto Anzeigen";
        document.getElementById("showscreenshotlblrare").innerHTML = "Bildschirmfoto Anzeigen";
        document.getElementById("desktoplbl").innerHTML = "Desktopverkn??pfung Erstellen";
        document.getElementById("startwinlbl").innerHTML = "Starte mit Windows";
        document.getElementById("startminlbl").innerHTML = "Minimiert Starten";
        document.getElementById("soundonlylbl").innerHTML = "Nur Ton Abspielen";
        document.getElementById("trackinglbl").innerHTML = 'Spielbenachrichtigung Anzeigen';

        nouser = "Kein Benutzer Erkannt";
        nogame = "Kein Spiel Erkannt";
        nosound = "Standard (Kein Ton Ausgew??hlt)";
        nosoundrare = "Standard (Kein Ton Ausgew??hlt)";
        rareheader = `'Seltene Errungenschaft Freigeschaltet!`
        unlinked = "NICHT VERKN??PFT";
        linked = "VERKN??PFT";
        novalue = "Bitte einen Wert eingeben";

        resettitle = "Anwendung Auf Standard Zur??cksetzen?";
        resetdesc = `WARNUNG: Dadurch werden alle Benutzereinstellungen entfernt!`;
        resetbtns = ["Zur??cksetzen","Deinstallieren","K??ndigen"];

        traylabel = "Kein Spiel Erkannt";
        trayshow = "Anzeigen";
        trayexit = "Ausgang";

        //!!!1.8 Translations;
        achievementunlocked = "Errungenschaft!";
        rareachievementunlocked = "Seltener Errungenschaft!";
        testdesc = "Ihre Benachrichtigungen funktionieren ordnungsgem????";

        addsound = "Ton Hinzuf??gen";
        invalid = 'Ung??ltiger Dateityp';
        addimage = 'Bild Hinzuf??gen';
        file = "DATEI";
        nofolder = "Standard (Kein Ordner Ausgew??hlt)";
        novalidaudio = "Es befinden sich keine g??ltigen Audiodateien in ";
        soundmode = "KLANGMODUS: ";
        randomised = "ZUF??LLIG";
        presskey = "...";
        custompos = "Benutzerdefinierte Position";
        settingpos = "Hauptposition Einstellen...";
        settingposrare = "Seltene Position Einstellen...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam Bildschirmfoto Tastenkombination:";
        document.getElementById("langlbl").innerHTML = "Sprache:";
        document.getElementById("raritylbl").innerHTML = "Seltenheitswert: ";
        document.getElementById("nosteamlbl").innerHTML = "Steam Benachrichtigung ausblenden";
        document.getElementById("customiselbl").innerHTML = "BEARBEITEN...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Haupt';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Selten';
        document.getElementById("customiserstylelbl").innerHTML = "BENACHRICHTIGUNGSSTIL:";
        document.getElementById("notifypositionlbl").innerHTML = "BILDSCHIRMPOSITION:";
        document.getElementById("bgtypelbl").innerHTML = "HINTERGRUNDTYP:";
        document.getElementById("colourslbl").innerHTML = "FARBEN";
        document.getElementById("colour1lbl").innerHTML = "Farbe 1";
        document.getElementById("colour2lbl").innerHTML = "Farbe 2";
        document.getElementById("textcolourlbl").innerHTML = "Textfarbe";
        document.getElementById("imgselectlbl").innerHTML = "HINTERGRUNDBILD:"
        document.getElementById("roundnesslbl").innerHTML = "RUNDHEIT:";
        document.getElementById("iconroundnesslbl").innerHTML = "IKONENRUNDHEIT:";
        document.getElementById("displaytimelbl").innerHTML = "ANZEIGEZEIT:";
        document.getElementById("scalelbl").innerHTML = "SKALA:";
        document.getElementById("styledefault").innerHTML = "Standard";
        document.getElementById("typesolid").innerHTML = "Einfarbig";
        document.getElementById("typegradient").innerHTML = "Farbverlauf";
        document.getElementById("typeimg").innerHTML = "Hintergrundbild";
        document.getElementById("dragposlbl").innerHTML = "Benutzerdefinierte Position";
        document.getElementById("iconselectlbl").innerHTML = "BENUTZERDEFINIERTES SYMBOL:";
        document.getElementById("fontsizelbl").innerHTML = "SCHRIFTGR??SSE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Position Zur??cksetzen";

        document.getElementById("customiserstylelblrare").innerHTML = "BENACHRICHTIGUNGSSTIL:";
        document.getElementById("notifypositionlblrare").innerHTML = "BILDSCHIRMPOSITION:";
        document.getElementById("bgtypelblrare").innerHTML = "HINTERGRUNDTYP:";
        document.getElementById("rarecolourslbl").innerHTML = "FARBEN";
        document.getElementById("colour1lblrare").innerHTML = "Farbe 1";
        document.getElementById("colour2lblrare").innerHTML = "Farbe 2";
        document.getElementById("textcolourlblrare").innerHTML = "Textfarbe";
        document.getElementById("rareimgselectlbl").innerHTML = "HINTERGRUNDBILD:"
        document.getElementById("roundnesslblrare").innerHTML = "RUNDHEIT:";
        document.getElementById("iconroundnesslblrare").innerHTML = "IKONENRUNDHEIT:";
        document.getElementById("displaytimelblrare").innerHTML = "ANZEIGEZEIT:";
        document.getElementById("scalelblrare").innerHTML = "SKALA:";
        document.getElementById("styledefaultrare").innerHTML = "Standard";
        document.getElementById("typesolidrare").innerHTML = "Einfarbig";
        document.getElementById("typegradientrare").innerHTML = "Farbverlauf";
        document.getElementById("typeimgrare").innerHTML = "Hintergrundbild";
        document.getElementById("dragposlblrare").innerHTML = "Benutzerdefinierte Position";
        document.getElementById("rareiconselectlbl").innerHTML = "BENUTZERDEFINIERTES SYMBOL:";
        document.getElementById("fontsizelblrare").innerHTML = "SCHRIFTGR??SSE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Position Zur??cksetzen";

        document.getElementById("trackopacitylbl").innerHTML = "Opazit??t:";
        document.getElementById("resetlbl").innerHTML = "Anwendung Zur??cksetzen";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Spieldetails</a> m??ssen ebenfalls auf "??ffentlich" eingestellt sein.';
        document.getElementById("allpercentlbl").innerHTML = "Alle Prozents??tze Anzeigen";
        document.getElementById("iconanimationlbl").innerHTML = "Seltene Symbolanimation Anzeigen";
        document.getElementById("hwalbl").innerHTML = "Hardwarebeschleunigung Deaktivieren";
        document.getElementById("nvdalbl").innerHTML = "NVDA-Unterst??tzung Aktivieren";
        document.getElementById("gamecompletionlbl").innerHTML = "Spielabschlussbenachrichtigung Anzeigen";
        document.getElementById("ssoverlaylbl").innerHTML = "Speichern Sie Bildschirmfoto mit Overlay";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Pfad:";
        document.getElementById("opacitylbl").innerHTML = "Opazit??t der Benachrichtigung:";

        secret = "Geheimer Errungshaft!";
        gamecomplete = "Spiel Abgeschlossen!";
        allunlocked = "Du hast alle Erfolge freigeschaltet!";
    } else if (config.lang == "greek") {
        document.getElementById("username").innerHTML = "?????? ?????????????????????? ??????????????";
        document.getElementById("gamestatus").innerHTML = "?????? ?????????????????????? ????????????????";
        document.getElementById("soundfile").innerHTML = "???????????????????? (?????? ???????? ???????????????? ????????)";
        document.getElementById("soundfilerare").innerHTML = "???????????????????? (?????? ???????? ???????????????? ????????)";
        document.getElementById("maincheevsound").innerHTML = "???????? ???????????? ????????????????????????";
        document.getElementById("rarecheevsound").innerHTML = "?????????????? ???????? ????????????????????????";
        document.getElementById("test").innerHTML = "???????????????? ?????????????????????? ??????????????";
        document.getElementById("testrare").innerHTML = "???????????????? ?????????????????????? ?????????????? ??????????????";
        document.getElementById("settingstitle").innerHTML = "??????????????????";
        document.getElementById("configtitle").innerHTML = "????????????????????";
        document.getElementById("apibox").placeholder = "???????????????????? ???? API Key";
        document.getElementById("steam64box").placeholder = "???????????????????? ???? Steam64ID";
        document.getElementById("other").innerHTML = "????????";
        document.getElementById("showscreenshotlbl").innerHTML = "???????????????? ???????????????????????? ????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "???????????????? ???????????????????????? ????????????";
        document.getElementById("desktoplbl").innerHTML = "???????????????????? Desktop";
        document.getElementById("startwinlbl").innerHTML = "?????????????????? ???? ???? Windows";
        document.getElementById("startminlbl").innerHTML = "???????????? ????????????????????????????????";
        document.getElementById("soundonlylbl").innerHTML = "???????? ???????????????????? ????????";
        document.getElementById("trackinglbl").innerHTML = '???????????????? "???????? ????????????????????????"';

        nouser = "?????? ?????????????????????? ??????????????";
        nogame = "?????? ?????????????????????? ????????????????";
        nosound = "???????????????????? (?????? ???????? ???????????????? ????????)";
        nosoundrare = "???????????????????? (?????? ???????? ???????????????? ????????)";
        rareheader = `'???????????????????? ???????????? ??????????????????!`;
        unlinked = "????????????????????";
        linked = "????????????????????";
        novalue = "???????????????? ???????????????? ????????";
    
        resettitle = "?????????????????? ?????? ?????????????????? ???????? ????????????????????;";
        resetdesc = `??????????????????????????: ???????? ???? ???????????????????? ???????? ?????? ?????????????????? ????????????!`;
        resetbtns = ["??????????????????","??????????????????????????","??????????????"];
    
        traylabel = "?????? ?????????????????????? ????????????????";
        trayshow = "????????????";
        trayexit = "????????????";

        //!!!1.8 Translations;
        achievementunlocked = "??????????????????!";
        rareachievementunlocked = "???????????? ??????????????????!";
        testdesc = "???? ???????????????????????? ?????? ?????????????????????? ??????????";

        addsound = "???????????????? ????????";
        invalid = '???? ?????????????? ?????????? ??????????????';
        addimage = '?????????????????? ????????????';
        file = "????????????";
        nofolder = "???????????????????? (?????? ???????? ???????????????? ??????????????)";
        novalidaudio = "?????? ???????????????? ???????????? ???????????? ???????? ";
        soundmode = "???????????????????? ????????: ";
        randomised = "????????????????????????????";
        presskey = "...";
        custompos = "?????????????? ???????????????????????????? ??????????";
        settingpos = "?????????????? ???????????? ??????????...";
        settingposrare = "?????????????? ?????????????? ??????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "???????????? ?????????????? Steam";
        document.getElementById("langlbl").innerHTML = "????????????:";
        document.getElementById("raritylbl").innerHTML = "???????? ??????????????????????: ";
        document.getElementById("nosteamlbl").innerHTML = "???????????????? ?????????????????????? Steam";
        document.getElementById("customiselbl").innerHTML = "??????????????????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">????????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">??????????????';
        document.getElementById("customiserstylelbl").innerHTML = "???????? ??????????????????????:";
        document.getElementById("notifypositionlbl").innerHTML = "???????? ????????????:";
        document.getElementById("bgtypelbl").innerHTML = "?????????? ????????????????:";
        document.getElementById("colourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lbl").innerHTML = "?????????? 1";
        document.getElementById("colour2lbl").innerHTML = "?????????? 2";
        document.getElementById("textcolourlbl").innerHTML = "?????????? ????????????????";
        document.getElementById("imgselectlbl").innerHTML = "???????????? ????????????:"
        document.getElementById("roundnesslbl").innerHTML = "??????????????????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "?????????????????? ??????????????:";
        document.getElementById("displaytimelbl").innerHTML = "???????????? ??????????????????:";
        document.getElementById("scalelbl").innerHTML = "??????????????:";
        document.getElementById("styledefault").innerHTML = "??????????????";
        document.getElementById("typesolid").innerHTML = "????????????????????";
        document.getElementById("typegradient").innerHTML = "???????????????????? ????????????????";
        document.getElementById("typeimg").innerHTML = "???????????? ????????????";
        document.getElementById("dragposlbl").innerHTML = "?????????????????????????? ????????";
        document.getElementById("iconselectlbl").innerHTML = "?????????????????????????? ??????????????????:";
        document.getElementById("fontsizelbl").innerHTML = "?????????????? ????????????????????????????:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "?????????????????? ??????????";

        document.getElementById("customiserstylelblrare").innerHTML = "???????? ??????????????????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "???????? ????????????:";
        document.getElementById("bgtypelblrare").innerHTML = "?????????? ????????????????:";
        document.getElementById("rarecolourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lblrare").innerHTML = "?????????? 1";
        document.getElementById("colour2lblrare").innerHTML = "?????????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "?????????? ????????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "???????????? ????????????:"
        document.getElementById("roundnesslblrare").innerHTML = "??????????????????????????:";
        document.getElementById("iconroundnesslblrare").innerHTML = "?????????????????? ??????????????:";
        document.getElementById("displaytimelblrare").innerHTML = "???????????? ??????????????????:";
        document.getElementById("scalelblrare").innerHTML = "??????????????:";
        document.getElementById("styledefaultrare").innerHTML = "??????????????";
        document.getElementById("typesolidrare").innerHTML = "????????????????????";
        document.getElementById("typegradientrare").innerHTML = "???????????????????? ????????????????";
        document.getElementById("typeimgrare").innerHTML = "???????????? ????????????";
        document.getElementById("dragposlblrare").innerHTML = "?????????????????????????? ????????";
        document.getElementById("rareiconselectlbl").innerHTML = "?????????????????????????? ??????????????????:";
        document.getElementById("fontsizelblrare").innerHTML = "?????????????? ????????????????????????????:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "?????????????????? ??????????";

        document.getElementById("trackopacitylbl").innerHTML = "????????????????????:";
        document.getElementById("resetlbl").innerHTML = "?????????????????? ??????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">???? ???????????????????????? ????????????????????</a> ???????????? ???? ?????????? "????????????????".';
        document.getElementById("allpercentlbl").innerHTML = "???????????????? ???????? ?????? ????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "???????????????? ?????????????? ???????????????????? ??????????????";
        document.getElementById("hwalbl").innerHTML = "?????????????????????????????? ?????? ???????????????????? ????????????";
        document.getElementById("nvdalbl").innerHTML = "?????????????????????????? ?????? ???????????????????? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "???????????????? ?????????????????????? ?????????????????????? ?????? ????????????????????";
        document.getElementById("ssoverlaylbl").innerHTML = "???????????????????? ???????????????????????? ???????????? ???? ??????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "????????????????:";
        document.getElementById("opacitylbl").innerHTML = "???????????????????? ??????????????????????:";

        secret = "?????????????? ??????????????????!";
        gamecomplete = "???????????????? ????????????????!";
        allunlocked = "???????????????????????? ?????? ???? ??????????????????????!";
    } else if (config.lang == "hungarian") {
        document.getElementById("username").innerHTML = "Nincs Felhaszn??l?? ??szlelve";
        document.getElementById("gamestatus").innerHTML = "Nincs J??t??k ??szlelve";
        document.getElementById("soundfile").innerHTML = "Alap??rtelmezett (Nincs Hang Kiv??lasztva)";
        document.getElementById("soundfilerare").innerHTML = "Alap??rtelmezett (Nincs Hang Kiv??lasztva)";
        document.getElementById("maincheevsound").innerHTML = "F?? ??rtes??t??si Hang";
        document.getElementById("rarecheevsound").innerHTML = "Ritka ??rtes??t??si Hang";
        document.getElementById("test").innerHTML = "TESZT ??ZENET MUTAT??SA";
        document.getElementById("testrare").innerHTML = "RITKA TESZT ??ZENET MUTAT??SA";
        document.getElementById("settingstitle").innerHTML = "BE??LL??T??SOK";
        document.getElementById("configtitle").innerHTML = "KONFIGUR??CI??";
        document.getElementById("apibox").placeholder = "??rja be az API Key-t";
        document.getElementById("steam64box").placeholder = "??rja be a Steam64ID-t";
        document.getElementById("other").innerHTML = "EGY??B";
        document.getElementById("showscreenshotlbl").innerHTML = "K??perny??k??p Megjelen??t??se";
        document.getElementById("showscreenshotlblrare").innerHTML = "K??perny??k??p Megjelen??t??se";
        document.getElementById("desktoplbl").innerHTML = "Parancsikon L??trehoz??sa";
        document.getElementById("startwinlbl").innerHTML = "Futtassa Amikor A Windows Elindul";
        document.getElementById("startminlbl").innerHTML = "Ind??t??s Minimaliz??lva";
        document.getElementById("soundonlylbl").innerHTML = "Csak Hang M??d";
        document.getElementById("trackinglbl").innerHTML = '"Most K??vet??si" ??rtes??t??s';

        nouser = "Nincs Felhaszn??l?? ??szlelve";
        nogame = "Nincs J??t??k ??szlelve";
        nosound = "Alap??rtelmezett (Nincs Hang Kiv??lasztva)";
        nosoundrare = "Alap??rtelmezett (Nincs Hang Kiv??lasztva)";
        rareheader = `'Ritka Teljes??tm??ny Feloldva!`;
        unlinked = "NEM KAPCSOL??DIK";
        linked = "CSATLAKOZTATVA";
        novalue = "Adjon meg egy ??rt??ket";

        resettitle = "Vissza??ll??tja Az Alkalmaz??st Az Alap??rtelmezettre?";
        resetdesc = `FIGYELMEZTET??S: Ezzel elt??vol??tja az ??sszes felhaszn??l??i be??ll??t??st!`;
        resetbtns = ["Vissza??ll??t??s","Elt??vol??t??s","Megsz??nteti"];
    
        traylabel = "Nincs J??t??k ??szlelve";
        trayshow = "Mutasd";
        trayexit = "Kil??p??s";

        //!!!1.8 Translations;
        achievementunlocked = "Teljes??tm??ny Feloldva!";
        rareachievementunlocked = "Ritka Teljes??tm??ny Feloldva!";
        testdesc = "Az ??rtes??t??sek megfelel??en m??k??dnek";
        
        addsound = "Hang Hozz??ad??sa";
        invalid = '??rv??nytelen F??jlt??pus';
        addimage = 'K??p Hozz??ad??sa';
        file = "F??JL";
        nofolder = "Alap??rtelmezett (Nincs Kiv??lasztott Mappa)";
        novalidaudio = "Nincsenek ??rv??nyes hangf??jlok a k??vetkez?? helyen ";
        soundmode = "HANG M??D: ";
        randomised = "V??LETLEN";
        presskey = "...";
        custompos = "??ll??tsa Be a Poz??ci??t";
        settingpos = "F?? Poz??ci?? Be??ll??t??sa...";
        settingposrare = "Ritka Poz??ci?? Be??ll??t??sa...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam K??perny??k??p Gomb";
        document.getElementById("langlbl").innerHTML = "Nyelv:";
        document.getElementById("raritylbl").innerHTML = "Ritkas??g Sz??zal??ka: ";
        document.getElementById("nosteamlbl").innerHTML = "Steam ??rtes??t??s Elrejt??se";
        document.getElementById("customiselbl").innerHTML = "TESTRESZAB...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">F??';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Ritka';
        document.getElementById("customiserstylelbl").innerHTML = "??RTES??T??SI ST??LUS:";
        document.getElementById("notifypositionlbl").innerHTML = "A K??PERNY?? HELYZETE:";
        document.getElementById("bgtypelbl").innerHTML = "H??TT??RT??PUS:";
        document.getElementById("colourslbl").innerHTML = "SZ??NEK";
        document.getElementById("colour1lbl").innerHTML = "Sz??n 1";
        document.getElementById("colour2lbl").innerHTML = "Sz??n 2";
        document.getElementById("textcolourlbl").innerHTML = "Sz??veg Sz??ne";
        document.getElementById("imgselectlbl").innerHTML = "H??TT??RK??P:"
        document.getElementById("roundnesslbl").innerHTML = "KEREKS??G:";
        document.getElementById("iconroundnesslbl").innerHTML = "IKON KEREKS??G:";
        document.getElementById("displaytimelbl").innerHTML = "KIJELZ??SI ID??:";
        document.getElementById("scalelbl").innerHTML = "SK??LA:";
        document.getElementById("styledefault").innerHTML = "Alap??rtelmezett";
        document.getElementById("typesolid").innerHTML = "Tart??s Sz??n";
        document.getElementById("typegradient").innerHTML = "Sz??n??tmenet";
        document.getElementById("typeimg").innerHTML = "H??tt??rk??p";
        document.getElementById("dragposlbl").innerHTML = "Egy??ni Poz??ci?? Haszn??lata";
        document.getElementById("iconselectlbl").innerHTML = "EGYEDI IKON:";
        document.getElementById("fontsizelbl").innerHTML = "BET??M??RET:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "??ll??tsa Vissza A Poz??ci??t";

        document.getElementById("customiserstylelblrare").innerHTML = "??RTES??T??SI ST??LUS:";
        document.getElementById("notifypositionlblrare").innerHTML = "A K??PERNY?? HELYZETE:";
        document.getElementById("bgtypelblrare").innerHTML = "H??TT??RT??PUS:";
        document.getElementById("rarecolourslbl").innerHTML = "SZ??NEK";
        document.getElementById("colour1lblrare").innerHTML = "Sz??n 1";
        document.getElementById("colour2lblrare").innerHTML = "Sz??n 2";
        document.getElementById("textcolourlblrare").innerHTML = "Sz??veg Sz??ne";
        document.getElementById("rareimgselectlbl").innerHTML = "H??TT??RK??P:"
        document.getElementById("roundnesslblrare").innerHTML = "KEREKS??G:";
        document.getElementById("iconroundnesslblrare").innerHTML = "IKON KEREKS??G:";
        document.getElementById("displaytimelblrare").innerHTML = "KIJELZ??SI ID??:";
        document.getElementById("scalelblrare").innerHTML = "SK??LA:";
        document.getElementById("styledefaultrare").innerHTML = "Alap??rtelmezett";
        document.getElementById("typesolidrare").innerHTML = "Tart??s Sz??n";
        document.getElementById("typegradientrare").innerHTML = "Sz??n??tmenet";
        document.getElementById("typeimgrare").innerHTML = "H??tt??rk??p";
        document.getElementById("dragposlblrare").innerHTML = "Egy??ni Poz??ci?? Haszn??lata";
        document.getElementById("rareiconselectlbl").innerHTML = "EGYEDI IKON:";
        document.getElementById("fontsizelblrare").innerHTML = "BET??M??RET:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "??ll??tsa Vissza A Poz??ci??t";

        document.getElementById("trackopacitylbl").innerHTML = "??tl??tszatlans??g:";
        document.getElementById("resetlbl").innerHTML = "Alkalmaz??s Vissza??ll??t??sa";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">A j??t??k r??szleteinek</a> ???Nyilv??nosnak??? kell lennie.';
        document.getElementById("allpercentlbl").innerHTML = "??sszes Sz??zal??k Megjelen??t??se";
        document.getElementById("iconanimationlbl").innerHTML = "Ritka Ikon-Anim??ci?? Megjelen??t??se";
        document.getElementById("hwalbl").innerHTML = "Hardveres Gyors??t??s Letilt??sa";
        document.getElementById("nvdalbl").innerHTML = "NVDA T??mogat??s Enged??lyez??se";
        document.getElementById("gamecompletionlbl").innerHTML = "A J??t??k Befejez??s??r??l Sz??l?? ??rtes??t??s Megjelen??t??se";
        document.getElementById("ssoverlaylbl").innerHTML = "K??perny??k??pek Ment??se ??tfed??ssel";
        document.getElementById("ssoverlaypathlbl").innerHTML = "P??lya:";
        document.getElementById("opacitylbl").innerHTML = "??tl??tszatlans??g:";

        secret = "Titkos Teljes??tm??ny!";
        gamecomplete = "A J??t??k K??sz!";
        allunlocked = "Minden jutalmat megszerezt??l!";
    } else if (config.lang == "italian") {
        document.getElementById("username").innerHTML = "Nessun Utente Rilevato";
        document.getElementById("gamestatus").innerHTML = "Nessun Gioco Rilevato";
        document.getElementById("soundfile").innerHTML = "Predefinito (Nessun Suono Selezionato)";
        document.getElementById("soundfilerare").innerHTML = "Predefinito (Nessun Suono Selezionato)";
        document.getElementById("maincheevsound").innerHTML = "Suono Principale";
        document.getElementById("rarecheevsound").innerHTML = "Suono Raro";
        document.getElementById("test").innerHTML = "MOSTRA NOTIFICA DI PROVA";
        document.getElementById("testrare").innerHTML = "MOSTRA NOTIFICA DI PROVA RARA";
        document.getElementById("settingstitle").innerHTML = "IMPOSTAZIONI";
        document.getElementById("configtitle").innerHTML = "CONFIGURAZIONE";
        document.getElementById("apibox").placeholder = "Inserisci API Key";
        document.getElementById("steam64box").placeholder = "Inserisci Steam64ID";
        document.getElementById("other").innerHTML = "ALTRO";
        document.getElementById("showscreenshotlbl").innerHTML = "Mostra Screenshot";
        document.getElementById("showscreenshotlblrare").innerHTML = "Mostra Screenshot";
        document.getElementById("desktoplbl").innerHTML = "Collegamento Sul Desktop";
        document.getElementById("startwinlbl").innerHTML = "Inizia con Windows";
        document.getElementById("startminlbl").innerHTML = "Inizio Ridotto a Icona";
        document.getElementById("soundonlylbl").innerHTML = "Modalit?? Solo Audio";
        document.getElementById("trackinglbl").innerHTML = 'Mostra Notifica "Ora Osservando"';

        nouser = "Nessun Utente Rilevato";
        nogame = "Nessun Gioco Rilevato";
        nosound = "Predefinito (Nessun Suono Selezionato)";
        nosoundrare = "Predefinito (Nessun Suono Selezionato)";
        rareheader = `'Obiettivo Raro Sbloccato!`;
        unlinked = "SCOLLEGATO";
        linked = "COLLEGATO";
        novalue = "Per favore inserisci un valore";
    
        resettitle = "Ripristinare l'Applicazione Ai Predefiniti?";
        resetdesc = `ATTENZIONE: Questo rimuover?? tutte le impostazioni utente!`;
        resetbtns = ["Ripristina","Disinstalla","Annulla"];
    
        traylabel = "Nessun Gioco Rilevato";
        trayshow = "Mostra";
        trayexit = "Esci";

        //!!!1.8 Translations;
        achievementunlocked = "Obiettivo Sbloccato!";
        rareachievementunlocked = "Raro Obiettivo Sbloccato!";
        testdesc = "Le tue notifiche funzionano correttamente";

        addsound = "Aggiungi Suono";
        invalid = 'Tipo Di File Non Valido';
        addimage = 'Aggiungi Immagine';
        file = "FILE";
        nofolder = "Predefinito (Nessuna Cartella Selezionata)";
        novalidaudio = "Nessun file audio valido si trova in";
        soundmode = "MODALIT?? SUONO: ";
        randomised = "RANDOMIZZATO";
        presskey = "...";
        custompos = "Imposta Posizione Personalizzata";
        settingpos = "Impostazione Principale...";
        settingposrare = "Impostazione Rara...";

        document.getElementById("steamkeybindlbl").innerHTML = "Schermata di Steam:";
        document.getElementById("langlbl").innerHTML = "Lingua:";
        document.getElementById("raritylbl").innerHTML = "Valore di Rarit??: ";
        document.getElementById("nosteamlbl").innerHTML = "Nascondi la Notifica di Steam";
        document.getElementById("customiselbl").innerHTML = "MODIFICARE...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Principale';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Raro';
        document.getElementById("customiserstylelbl").innerHTML = "STILE DI NOTIFICA:";
        document.getElementById("notifypositionlbl").innerHTML = "POSIZIONE SCHERMO:";
        document.getElementById("bgtypelbl").innerHTML = "TIPO DI SFONDO:";
        document.getElementById("colourslbl").innerHTML = "COLORI";
        document.getElementById("colour1lbl").innerHTML = "Colore 1";
        document.getElementById("colour2lbl").innerHTML = "Colore 2";
        document.getElementById("textcolourlbl").innerHTML = "Colore Del Testo";
        document.getElementById("imgselectlbl").innerHTML = "IMMAGINE DI SFONDO:"
        document.getElementById("roundnesslbl").innerHTML = "ROTONDIT??:";
        document.getElementById("iconroundnesslbl").innerHTML = "ROTONDEZZA DELL'ICONA:";
        document.getElementById("displaytimelbl").innerHTML = "TEMPO DI NOTIFICA:";
        document.getElementById("scalelbl").innerHTML = "SCALA:";
        document.getElementById("styledefault").innerHTML = "Predefinito";
        document.getElementById("typesolid").innerHTML = "Colore Solido";
        document.getElementById("typegradient").innerHTML = "Gradiente di Colore";
        document.getElementById("typeimg").innerHTML = "Immagine di Sfondo";
        document.getElementById("dragposlbl").innerHTML = "Posizione Personalizzata";
        document.getElementById("iconselectlbl").innerHTML = "ICONA PERSONALIZZATA:";
        document.getElementById("fontsizelbl").innerHTML = "DIMENSIONE DEL FONT:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Ripristina Posizione";

        document.getElementById("customiserstylelblrare").innerHTML = "STILE DI NOTIFICA:";
        document.getElementById("notifypositionlblrare").innerHTML = "POSIZIONE SCHERMO:";
        document.getElementById("bgtypelblrare").innerHTML = "TIPO DI SFONDO:";
        document.getElementById("rarecolourslbl").innerHTML = "COLORI";
        document.getElementById("colour1lblrare").innerHTML = "Colore 1";
        document.getElementById("colour2lblrare").innerHTML = "Colore 2";
        document.getElementById("textcolourlblrare").innerHTML = "Colore Del Testo";
        document.getElementById("rareimgselectlbl").innerHTML = "IMMAGINE DI SFONDO:"
        document.getElementById("roundnesslblrare").innerHTML = "ROTONDIT??:";
        document.getElementById("iconroundnesslblrare").innerHTML = "ROTONDEZZA DELL'ICONA:";
        document.getElementById("displaytimelblrare").innerHTML = "TEMPO DI NOTIFICA:";
        document.getElementById("scalelblrare").innerHTML = "SCALA:";
        document.getElementById("styledefaultrare").innerHTML = "Predefinito";
        document.getElementById("typesolidrare").innerHTML = "Colore Solido";
        document.getElementById("typegradientrare").innerHTML = "Gradiente di Colore";
        document.getElementById("typeimgrare").innerHTML = "Immagine di Sfondo";
        document.getElementById("dragposlblrare").innerHTML = "Posizione Personalizzata";
        document.getElementById("rareiconselectlbl").innerHTML = "ICONA PERSONALIZZATA:";
        document.getElementById("fontsizelblrare").innerHTML = "DIMENSIONE DEL FONT:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Ripristina Posizione";

        document.getElementById("trackopacitylbl").innerHTML = "Opacit??:";
        document.getElementById("resetlbl").innerHTML = "Ripristina Applicazione";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">I dettagli del gioco</a> devono essere "Pubblici".';
        document.getElementById("allpercentlbl").innerHTML = "Mostra Tutte le Percentuali";
        document.getElementById("iconanimationlbl").innerHTML = "Mostra Animazione Icona Rara";
        document.getElementById("hwalbl").innerHTML = "Disabilita l'Accelerazione Hardware";
        document.getElementById("nvdalbl").innerHTML = "Abilita il Supporto NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Mostra la Notifica di Completamento del Gioco";
        document.getElementById("ssoverlaylbl").innerHTML = "Salva Screenshot con Sovrapposizione";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Percorso:";
        document.getElementById("opacitylbl").innerHTML = "Opacit?? di Notifica:";

        secret = "Obiettivo Segreto!";
        gamecomplete = "Gioco Completo!";
        allunlocked = "Hai sbloccato tutti gli obiettivi!";
    } else if (config.lang == "japanese") {
        document.getElementById("username").innerHTML = "????????????????????????????????????";
        document.getElementById("gamestatus").innerHTML = "?????????????????????????????????";
        document.getElementById("soundfile").innerHTML = "???????????????????????????????????????????????????????????????";
        document.getElementById("soundfilerare").innerHTML = "???????????????????????????????????????????????????????????????";
        document.getElementById("maincheevsound").innerHTML = "???????????????????????????????????????";
        document.getElementById("rarecheevsound").innerHTML = "???????????????????????????????????????";
        document.getElementById("test").innerHTML = "??????????????????????????????";
        document.getElementById("testrare").innerHTML = "???????????????????????????????????????";
        document.getElementById("settingstitle").innerHTML = "??????";
        document.getElementById("configtitle").innerHTML = "??????";
        document.getElementById("apibox").placeholder = "API Key???????????????????????????";
        document.getElementById("steam64box").placeholder = "Steam64ID???????????????????????????";
        document.getElementById("other").innerHTML = "??????";
        document.getElementById("showscreenshotlbl").innerHTML = "????????????????????????????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "????????????????????????????????????";
        document.getElementById("desktoplbl").innerHTML = "??????????????????????????????????????????";
        document.getElementById("startwinlbl").innerHTML = "Windows???????????????";
        document.getElementById("startminlbl").innerHTML = "?????????????????????????????????????????????";
        document.getElementById("soundonlylbl").innerHTML = "?????????????????????????????????";
        document.getElementById("trackinglbl").innerHTML = '?????????????????????????????????????????????';
        
        nouser = "????????????????????????????????????";
        nogame = "?????????????????????????????????";
        nosound = "???????????????????????????????????????????????????????????????";
        nosoundrare = "???????????????????????????????????????????????????????????????";
        rareheader = `'???????????????????????????????????????`;
        unlinked = "???????????????????????????";
        linked = "?????????";
        novalue = "??????????????????????????????";

        resettitle = "????????????????????????????????????????????????????????????????????????";
        resetdesc = `?????????????????????????????????????????????????????????????????????????????????`;
        resetbtns = ["????????????","????????????????????????","???????????????"];
    
        traylabel = "?????????????????????????????????";
        trayshow = "?????????";
        trayexit = "??????";

        //!!!1.8 Translations;
        achievementunlocked = "?????????";
        rareachievementunlocked = "??????????????????";
        testdesc = "??????????????????????????????????????????";

        addsound = "?????????????????????????????????";
        invalid = '??????????????????????????????';
        addimage = '???????????????????????????';
        file = "????????????";
        nofolder = "???????????????????????????????????????????????????????????????";
        novalidaudio = "????????????????????????????????????????????????????????? ";
        soundmode = "???????????????????????? ";
        randomised = "????????????";
        presskey = "...";
        custompos = "?????????????????????????????????";
        settingpos = "???????????????????????????...";
        settingposrare = "??????????????????????????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam????????????????????????????????????:";
        document.getElementById("langlbl").innerHTML = "??????:";
        document.getElementById("raritylbl").innerHTML = "???????????????";
        document.getElementById("nosteamlbl").innerHTML = "Steam???????????????????????????";
        document.getElementById("customiselbl").innerHTML = "??????????????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">??????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">??????';
        document.getElementById("customiserstylelbl").innerHTML = "?????????????????????????????????:";
        document.getElementById("notifypositionlbl").innerHTML = "???????????????:";
        document.getElementById("bgtypelbl").innerHTML = "???????????????:";
        document.getElementById("colourslbl").innerHTML = "???";
        document.getElementById("colour1lbl").innerHTML = "?????????1";
        document.getElementById("colour2lbl").innerHTML = "?????????2";
        document.getElementById("textcolourlbl").innerHTML = "??????????????????";
        document.getElementById("imgselectlbl").innerHTML = "????????????:"
        document.getElementById("roundnesslbl").innerHTML = "??????????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "????????????????????????";
        document.getElementById("displaytimelbl").innerHTML = "????????????:";
        document.getElementById("scalelbl").innerHTML = "??????:";
        document.getElementById("styledefault").innerHTML = "??????????????????";
        document.getElementById("typesolid").innerHTML = "?????????????????????";
        document.getElementById("typegradient").innerHTML = "??????????????????????????????";
        document.getElementById("typeimg").innerHTML = "????????????";
        document.getElementById("dragposlbl").innerHTML = "?????????????????????????????????";
        document.getElementById("iconselectlbl").innerHTML = "???????????????????????????";
        document.getElementById("fontsizelbl").innerHTML = "????????????????????????";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "?????????????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "?????????????????????????????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "???????????????:";
        document.getElementById("bgtypelblrare").innerHTML = "???????????????:";
        document.getElementById("rarecolourslbl").innerHTML = "???";
        document.getElementById("colour1lblrare").innerHTML = "?????????1";
        document.getElementById("colour2lblrare").innerHTML = "?????????2";
        document.getElementById("textcolourlblrare").innerHTML = "??????????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "????????????:"
        document.getElementById("roundnesslblrare").innerHTML = "??????????????????:";
        document.getElementById("iconroundnesslblrare").innerHTML = "????????????????????????";
        document.getElementById("displaytimelblrare").innerHTML = "????????????:";
        document.getElementById("scalelblrare").innerHTML = "??????:";
        document.getElementById("styledefaultrare").innerHTML = "??????????????????";
        document.getElementById("typesolidrare").innerHTML = "?????????????????????";
        document.getElementById("typegradientrare").innerHTML = "??????????????????????????????";
        document.getElementById("typeimgrare").innerHTML = "????????????";
        document.getElementById("dragposlblrare").innerHTML = "?????????????????????????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "???????????????????????????";
        document.getElementById("fontsizelblrare").innerHTML = "????????????????????????";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "?????????????????????";

        document.getElementById("trackopacitylbl").innerHTML = "????????????????????????";
        document.getElementById("resetlbl").innerHTML = "???????????????????????????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">??????????????????</a>??????????????????????????????????????????????????????';
        document.getElementById("allpercentlbl").innerHTML = "????????????????????????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "???????????????????????????????????????????????????";
        document.getElementById("hwalbl").innerHTML = "???????????????????????????????????????????????????????????????";
        document.getElementById("nvdalbl").innerHTML = "NVDA??????????????????????????????";
        document.getElementById("gamecompletionlbl").innerHTML = "????????????????????????????????????";
        document.getElementById("ssoverlaylbl").innerHTML = "?????????????????????????????????????????????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "??????";
        document.getElementById("opacitylbl").innerHTML = "????????????????????????";

        secret = "??????????????????";
        gamecomplete = "??????????????????";
        allunlocked = "??????????????????????????????????????????????????????";
    } else if (config.lang == "korean") {
        document.getElementById("username").innerHTML = "????????? ????????? ??????";
        document.getElementById("gamestatus").innerHTML = "????????? ?????? ??????";
        document.getElementById("soundfile").innerHTML = "?????????(????????? ?????? ??????)";
        document.getElementById("soundfilerare").innerHTML = "?????????(????????? ?????? ??????)";
        document.getElementById("maincheevsound").innerHTML = "?????? ?????? ?????????";
        document.getElementById("rarecheevsound").innerHTML = "?????? ?????????";
        document.getElementById("test").innerHTML = "????????? ?????? ??????";
        document.getElementById("testrare").innerHTML = "?????? ????????? ?????? ??????";
        document.getElementById("settingstitle").innerHTML = "??????";
        document.getElementById("configtitle").innerHTML = "??????";
        document.getElementById("apibox").placeholder = "API Key ??????";
        document.getElementById("steam64box").placeholder = "Steam64ID ??????";
        document.getElementById("other").innerHTML = "??????";
        document.getElementById("showscreenshotlbl").innerHTML = "?????? ???????????? ??????";
        document.getElementById("showscreenshotlblrare").innerHTML = "?????? ???????????? ??????";
        document.getElementById("desktoplbl").innerHTML = "?????? ?????? ?????? ?????? ?????????";
        document.getElementById("startwinlbl").innerHTML = "Windows??? ??????";
        document.getElementById("startminlbl").innerHTML = "????????? ???????????? ???????????? ??????";
        document.getElementById("soundonlylbl").innerHTML = "????????? ?????? ??????";
        document.getElementById("trackinglbl").innerHTML = '"?????? ??????" ?????? ??????';
        
        nouser = "????????? ????????? ??????";
        nogame = "????????? ?????? ??????";
        nosound = "?????????(????????? ?????? ??????)";
        nosoundrare = "?????????(????????? ?????? ??????)";
        rareheader = `'?????? ?????? ?????? ??????!`;
        unlinked = "???????????? ??????";
        linked = "?????????";
        novalue = "?????? ?????? ????????????";

        resettitle = "????????????????????? ??????????????? ????????????????????????????";
        resetdesc = `??????: ????????? ?????? ?????? ????????? ????????? ???????????????!`;
        resetbtns = ["?????? ??????","??????","??????"];
    
        traylabel = "????????? ?????? ??????";
        trayshow = "?????????";
        trayexit = "????????????";

        //!!!1.8 Translations;
        achievementunlocked = "?????? ?????? ??????!";
        rareachievementunlocked = "?????? ?????? ?????? ??????!";
        testdesc = "????????? ???????????? ???????????? ????????????";

        addsound = "????????? ????????? ??????";
        invalid = '????????? ?????? ??????';
        addimage = '????????? ????????? ??????';
        file = "??????";
        nofolder = "?????????(????????? ?????? ??????)";
        novalidaudio = "????????? ????????? ????????? ????????????.";
        soundmode = "????????? ??????: ";
        randomised = "?????????";
        presskey = "...";
        custompos = "????????? ?????? ?????? ?????? ??????";
        settingpos = "?????? ?????? ?????? ???...";
        settingposrare = "?????? ?????? ?????? ???...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam ???????????? ??????:";
        document.getElementById("langlbl").innerHTML = "??????:";
        document.getElementById("raritylbl").innerHTML = "????????? ?????????: ";
        document.getElementById("nosteamlbl").innerHTML = "Steam ?????? ?????????";
        document.getElementById("customiselbl").innerHTML = "??????????????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">??????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">?????? ???';
        document.getElementById("customiserstylelbl").innerHTML = "?????? ?????????:";
        document.getElementById("notifypositionlbl").innerHTML = "?????? ??????:";
        document.getElementById("bgtypelbl").innerHTML = "?????? ??????:";
        document.getElementById("colourslbl").innerHTML = "?????? ??????";
        document.getElementById("colour1lbl").innerHTML = "?????? 1";
        document.getElementById("colour2lbl").innerHTML = "?????? 2";
        document.getElementById("textcolourlbl").innerHTML = "????????? ??????";
        document.getElementById("imgselectlbl").innerHTML = "?????? ?????????:"
        document.getElementById("roundnesslbl").innerHTML = "?????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "????????? ??????:";
        document.getElementById("displaytimelbl").innerHTML = "?????? ??????:";
        document.getElementById("scalelbl").innerHTML = "??????:";
        document.getElementById("styledefault").innerHTML = "??????";
        document.getElementById("typesolid").innerHTML = "??????";
        document.getElementById("typegradient").innerHTML = "?????? ???????????????";
        document.getElementById("typeimg").innerHTML = "?????? ?????????";
        document.getElementById("dragposlbl").innerHTML = "????????? ?????? ?????? ?????? ??????";
        document.getElementById("iconselectlbl").innerHTML = "????????? ?????? ?????????:";
        document.getElementById("fontsizelbl").innerHTML = "?????? ??????:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "?????? ?????????";

        document.getElementById("customiserstylelblrare").innerHTML = "?????? ?????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "?????? ??????:";
        document.getElementById("bgtypelblrare").innerHTML = "?????? ??????:";
        document.getElementById("rarecolourslbl").innerHTML = "?????? ??????";
        document.getElementById("colour1lblrare").innerHTML = "?????? 1";
        document.getElementById("colour2lblrare").innerHTML = "?????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "????????? ??????";
        document.getElementById("rareimgselectlbl").innerHTML = "?????? ?????????:"
        document.getElementById("roundnesslblrare").innerHTML = "?????????:";
        document.getElementById("iconroundnesslblrare").innerHTML = "????????? ??????:";
        document.getElementById("displaytimelblrare").innerHTML = "?????? ??????:";
        document.getElementById("scalelblrare").innerHTML = "??????:";
        document.getElementById("styledefaultrare").innerHTML = "??????";
        document.getElementById("typesolidrare").innerHTML = "??????";
        document.getElementById("typegradientrare").innerHTML = "?????? ???????????????";
        document.getElementById("typeimgrare").innerHTML = "?????? ?????????";
        document.getElementById("dragposlblrare").innerHTML = "????????? ?????? ?????? ?????? ??????";
        document.getElementById("rareiconselectlbl").innerHTML = "????????? ?????? ?????????:";
        document.getElementById("fontsizelblrare").innerHTML = "?????? ??????:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "?????? ?????????";

        document.getElementById("trackopacitylbl").innerHTML = "???????????? ??????:";
        document.getElementById("resetlbl").innerHTML = "?????????????????? ?????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">?????? ????????????</a>??? "??????"??? ???????????? ?????????.';
        document.getElementById("allpercentlbl").innerHTML = "?????? ????????? ????????? ??????";
        document.getElementById("iconanimationlbl").innerHTML = "?????? ????????? ??????????????? ??????";
        document.getElementById("hwalbl").innerHTML = "???????????? ?????? ????????????";
        document.getElementById("nvdalbl").innerHTML = "NVDA ?????? ?????????";
        document.getElementById("gamecompletionlbl").innerHTML = "?????? ?????? ?????? ??????";
        document.getElementById("ssoverlaylbl").innerHTML = "??????????????? ???????????? ??????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "???:";
        document.getElementById("opacitylbl").innerHTML = "?????? ????????????:";

        secret = "?????? ??????!";
        gamecomplete = "?????? ??????!";
        allunlocked = "?????? ????????? ??????????????????!";
    } else if (config.lang == "norwegian") {
        document.getElementById("username").innerHTML = "Ingen Bruker Oppdaget";
        document.getElementById("gamestatus").innerHTML = "Ingen Spill Oppdaget";
        document.getElementById("soundfile").innerHTML = "Standard (Ingen Lyd Valgt)";
        document.getElementById("soundfilerare").innerHTML = "Standard (Ingen Lyd Valgt)";
        document.getElementById("maincheevsound").innerHTML = "Hovedprestasjonslyd";
        document.getElementById("rarecheevsound").innerHTML = "Sjelden Prestasjonslyd";
        document.getElementById("test").innerHTML = "VIS TESTVARSEL";
        document.getElementById("testrare").innerHTML = "VIS SJELDEN TESTVARSLING";
        document.getElementById("settingstitle").innerHTML = "INNSTILLINGER";
        document.getElementById("configtitle").innerHTML = "KONFIGURASJON";
        document.getElementById("apibox").placeholder = "Skriv inn API Key";
        document.getElementById("steam64box").placeholder = "Skriv inn Steam64ID";
        document.getElementById("other").innerHTML = "ANNEN";
        document.getElementById("showscreenshotlbl").innerHTML = "Vis Skjermbilde";
        document.getElementById("showscreenshotlblrare").innerHTML = "Vis Skjermbilde";
        document.getElementById("desktoplbl").innerHTML = "Lag Desktop Snarvei";
        document.getElementById("startwinlbl").innerHTML = "Start med Windows";
        document.getElementById("startminlbl").innerHTML = "Start Minimert";
        document.getElementById("soundonlylbl").innerHTML = "Kun Lydmodus";
        document.getElementById("trackinglbl").innerHTML = 'Vis "N?? Sporing"-Varsel';

        nouser = "Ingen Bruker Oppdaget";
        nogame = "Ingen Spill Oppdaget";
        nosound = "Standard (Ingen Lyd Valgt)";
        nosoundrare = "Standard (Ingen Lyd Valgt)";
        rareheader = `'Sjelden Prestasjon L??st Opp!`;
        unlinked = "IKKE KNYTTET";
        linked = "KNYTTET";
        novalue = "Vennligst angi en verdi";
    
        resettitle = "Tilbakestille Applikasjonen Til Standard?";
        resetdesc = `ADVARSEL: Dette vil fjerne alle brukerinnstillinger!`;
        resetbtns = ["Nullstille","Avinstaller","Avbryt"];
    
        traylabel = "Ingen Spill Oppdaget";
        trayshow = "Vise";
        trayexit = "Lukke";

        //!!!1.8 Translations;
        achievementunlocked = "Prestasjon L??st Opp!";
        rareachievementunlocked = "Sjelden Prestasjon L??st Opp!";
        testdesc = "Varslene dine fungerer som de skal";

        addsound = "Legg Til Valgt Lyd";
        invalid = 'Ugyldig Filtype';
        addimage = 'Legg Til Valgt Bilde';
        file = "FIL";
        nofolder = "Standard (Ingen Mappe Er Valgt)";
        novalidaudio = "Ingen gyldige lydfiler er plassert i ";
        soundmode = "LYDMODUS: ";
        randomised = "TILFELDIG";
        presskey = "...";
        custompos = "Angi Egendefinert Skjermposisjon";
        settingpos = "Stiller Inn Hovedposisjon...";
        settingposrare = "Stiller Sjelden Posisjon...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam-Skjermbildeknapp:";
        document.getElementById("langlbl").innerHTML = "Spr??k:";
        document.getElementById("raritylbl").innerHTML = "Sjeldenhetsprosent: ";
        document.getElementById("nosteamlbl").innerHTML = "Skjul Steam-Varsling";
        document.getElementById("customiselbl").innerHTML = "TILPASSE ...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Hoved';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Sjelden';
        document.getElementById("customiserstylelbl").innerHTML = "MELDINGSSTIL:";
        document.getElementById("notifypositionlbl").innerHTML = "SKJERMPOSISJON:";
        document.getElementById("bgtypelbl").innerHTML = "BAKGRUNNSTYPE:";
        document.getElementById("colourslbl").innerHTML = "FARGER";
        document.getElementById("colour1lbl").innerHTML = "Farge 1";
        document.getElementById("colour2lbl").innerHTML = "Farge 2";
        document.getElementById("textcolourlbl").innerHTML = "Tekstfarge";
        document.getElementById("imgselectlbl").innerHTML = "BAKGRUNNSBILDE:"
        document.getElementById("roundnesslbl").innerHTML = "RUNDHET:";
        document.getElementById("iconroundnesslbl").innerHTML = "IKON RUNDHET:";
        document.getElementById("displaytimelbl").innerHTML = "VISNINGSTID:";
        document.getElementById("scalelbl").innerHTML = "SKALA:";
        document.getElementById("styledefault").innerHTML = "Misligholde";
        document.getElementById("typesolid").innerHTML = "Solid Farge";
        document.getElementById("typegradient").innerHTML = "Fargegradient";
        document.getElementById("typeimg").innerHTML = "Bakgrunnsbilde";
        document.getElementById("dragposlbl").innerHTML = "Egendefinert Posisjon";
        document.getElementById("iconselectlbl").innerHTML = "TILPASSET IKONET:";
        document.getElementById("fontsizelbl").innerHTML = "SKRIFTST??RRELSE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Tilbakestill Posisjon";

        document.getElementById("customiserstylelblrare").innerHTML = "MELDINGSSTIL:";
        document.getElementById("notifypositionlblrare").innerHTML = "SKJERMPOSISJON:";
        document.getElementById("bgtypelblrare").innerHTML = "BAKGRUNNSTYPE:";
        document.getElementById("rarecolourslbl").innerHTML = "FARGER";
        document.getElementById("colour1lblrare").innerHTML = "Farge 1";
        document.getElementById("colour2lblrare").innerHTML = "Farge 2";
        document.getElementById("textcolourlblrare").innerHTML = "Tekstfarge";
        document.getElementById("rareimgselectlbl").innerHTML = "BAKGRUNNSBILDE:"
        document.getElementById("roundnesslblrare").innerHTML = "RUNDHET:";
        document.getElementById("iconroundnesslblrare").innerHTML = "IKON RUNDHET:";
        document.getElementById("displaytimelblrare").innerHTML = "VISNINGSTID:";
        document.getElementById("scalelblrare").innerHTML = "SKALA:";
        document.getElementById("styledefaultrare").innerHTML = "Misligholde";
        document.getElementById("typesolidrare").innerHTML = "Solid Farge";
        document.getElementById("typegradientrare").innerHTML = "Fargegradient";
        document.getElementById("typeimgrare").innerHTML = "Bakgrunnsbilde";
        document.getElementById("dragposlblrare").innerHTML = "Egendefinert Posisjon";
        document.getElementById("rareiconselectlbl").innerHTML = "TILPASSET IKONET:";
        document.getElementById("fontsizelblrare").innerHTML = "SKRIFTST??RRELSE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Tilbakestill Posisjon";

        document.getElementById("trackopacitylbl").innerHTML = "Sporingsopasitet:";
        document.getElementById("resetlbl").innerHTML = "Tilbakestill Applikasjon";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Spilldetaljer</a> m?? ogs?? settes til "Offentlig".';
        document.getElementById("allpercentlbl").innerHTML = "Vis Alle Prestasjonsprosent";
        document.getElementById("iconanimationlbl").innerHTML = "Vis Sjeldne Ikonanimasjoner";
        document.getElementById("hwalbl").innerHTML = "Deaktiver Maskinvareakselerasjon";
        document.getElementById("nvdalbl").innerHTML = "Aktiver NVDA-St??tte";
        document.getElementById("gamecompletionlbl").innerHTML = "Vis Varsel om Fullf??rt Spill";
        document.getElementById("ssoverlaylbl").innerHTML = "Lagre Skjermbilder med Overlegg";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Sti:";
        document.getElementById("opacitylbl").innerHTML = "Varslingsopacitet:";

        secret = "Hemmelig Prestasjon!";
        gamecomplete = "Spillet Er Fullf??rt!";
        allunlocked = "Du har l??st opp alle prestasjoner!";
    } else if (config.lang == "polish") {
        document.getElementById("username").innerHTML = "Nie Wykryto U??ytkownika";
        document.getElementById("gamestatus").innerHTML = "Nie Wykryto Gry";
        document.getElementById("soundfile").innerHTML = "Domy??lnie (Nie Wybrano D??wi??ku)";
        document.getElementById("soundfilerare").innerHTML = "Domy??lnie (Nie Wybrano D??wi??ku)";
        document.getElementById("maincheevsound").innerHTML = "G????wny D??wi??k";
        document.getElementById("rarecheevsound").innerHTML = "Rzadki D??wi??k";
        document.getElementById("test").innerHTML = "POKA?? POWIADOMIENIE TESTOWE";
        document.getElementById("testrare").innerHTML = "POKA?? RZADKIE POWIADOMIENIE TESTOWE";
        document.getElementById("settingstitle").innerHTML = "USTAWIENIA";
        document.getElementById("configtitle").innerHTML = "KONFIGURACJA";
        document.getElementById("apibox").placeholder = "Wpisz API Key";
        document.getElementById("steam64box").placeholder = "Wpisz Steam64ID";
        document.getElementById("other").innerHTML = "INNE";
        document.getElementById("showscreenshotlbl").innerHTML = "Poka?? Zrzut Ekranu Osi??gni??cia";
        document.getElementById("showscreenshotlblrare").innerHTML = "Poka?? Zrzut Ekranu Osi??gni??cia";
        document.getElementById("desktoplbl").innerHTML = "Utw??rz Skr??t Na Pulpicie";
        document.getElementById("startwinlbl").innerHTML = "Uruchom z Windows";
        document.getElementById("startminlbl").innerHTML = "Zacznij w Obszarze Powiadomie??";
        document.getElementById("soundonlylbl").innerHTML = "Tryb Samego D??wi??ku";
        document.getElementById("trackinglbl").innerHTML = 'Wy??wietl Powiadomienie "??ledz??ce"';

        nouser = "Nie Wykryto U??ytkownika";
        nogame = "Nie Wykryto Gry";
        nosound = "Domy??lnie (Nie Wybrano D??wi??ku)";
        nosoundrare = "Domy??lnie (Nie Wybrano D??wi??ku)";
        rareheader = `'Odblokowane Rzadkie Osi??gni??cie!`;
        unlinked = "NIE PO????CZONY";
        linked = "PO????CZONY";
        novalue = "Prosz?? wprowadzi?? warto????";

        resettitle = "Zresetowa?? Aplikacj?? Do Domy??lnych?";
        resetdesc = `OSTRZE??ENIE: Spowoduje to usuni??cie wszystkich ustawie?? u??ytkownika!`;
        resetbtns = ["Resetowanie","Odinstaluj","Anuluj"];
    
        traylabel = "Nie Wykryto Gry";
        trayshow = "Poka??";
        trayexit = "Wyjd??";

        //!!!1.8 Translations;
        achievementunlocked = "Odblokowano Osi??gni??cie!";
        rareachievementunlocked = "Odblokowano Rzadkie Osi??gni??cie!";
        testdesc = "Twoje powiadomienia dzia??aj?? prawid??owo";

        addsound = "Dodaj Wybrany D??wi??k";
        invalid = 'Nieprawid??owy Typ Pliku';
        addimage = 'Dodaj Wybrany Obraz';
        file = "PLIK";
        nofolder = "Domy??lnie (Nie Wybrano Folderu)";
        novalidaudio = "Brak prawid??owych plik??w audio znajduj??cych si?? w ";
        soundmode = "TRYB D??WI??KU: ";
        randomised = "LOSOWY";
        presskey = "...";
        custompos = "Ustaw Pozycj?? Niestandardow??";
        settingpos = "Ustawianie Pozycji G????wnej...";
        settingposrare = "Ustawianie Rzadkiej Pozycji...";

        document.getElementById("steamkeybindlbl").innerHTML = "Przycisk Zrzutu Ekranu Steam";
        document.getElementById("langlbl").innerHTML = "J??zyk:";
        document.getElementById("raritylbl").innerHTML = "Procent Rzadko??ci: ";
        document.getElementById("nosteamlbl").innerHTML = "Ukryj Powiadomienie Steam";
        document.getElementById("customiselbl").innerHTML = "DOSTOSUJ...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">G????wny';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Rzadki';
        document.getElementById("customiserstylelbl").innerHTML = "STYL POWIADOMIENIA:";
        document.getElementById("notifypositionlbl").innerHTML = "POZYCJA EKRANU:";
        document.getElementById("bgtypelbl").innerHTML = "RODZAJ T??A:";
        document.getElementById("colourslbl").innerHTML = "KOLORYSTYKA";
        document.getElementById("colour1lbl").innerHTML = "Kolor 1";
        document.getElementById("colour2lbl").innerHTML = "Kolor 2";
        document.getElementById("textcolourlbl").innerHTML = "Kolor Tekstu";
        document.getElementById("imgselectlbl").innerHTML = "ZDJ??CIE W TLE:"
        document.getElementById("roundnesslbl").innerHTML = "ZAOKR??GLENIE:";
        document.getElementById("iconroundnesslbl").innerHTML = "ZAOKR??GLENIE IKONY:";
        document.getElementById("displaytimelbl").innerHTML = "CZAS WY??WIETLANIA:";
        document.getElementById("scalelbl").innerHTML = "SKALA:";
        document.getElementById("styledefault").innerHTML = "Domy??lnie";
        document.getElementById("typesolid").innerHTML = "Jednolity Kolor";
        document.getElementById("typegradient").innerHTML = "Gradient Kolor??w";
        document.getElementById("typeimg").innerHTML = "Zdj??cie w Tle";
        document.getElementById("dragposlbl").innerHTML = "U??yj Pozycji Niestandardowej";
        document.getElementById("iconselectlbl").innerHTML = "NIESTANDARDOWA IKONA:";
        document.getElementById("fontsizelbl").innerHTML = "ROZMIAR CZCIONKI:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Resetuj Pozycj??";

        document.getElementById("customiserstylelblrare").innerHTML = "STYL POWIADOMIENIA:";
        document.getElementById("notifypositionlblrare").innerHTML = "POZYCJA EKRANU:";
        document.getElementById("bgtypelblrare").innerHTML = "RODZAJ T??A:";
        document.getElementById("rarecolourslbl").innerHTML = "KOLORYSTYKA";
        document.getElementById("colour1lblrare").innerHTML = "Kolor 1";
        document.getElementById("colour2lblrare").innerHTML = "Kolor 2";
        document.getElementById("textcolourlblrare").innerHTML = "Kolor Tekstu";
        document.getElementById("rareimgselectlbl").innerHTML = "ZDJ??CIE W TLE:"
        document.getElementById("roundnesslblrare").innerHTML = "ZAOKR??GLENIE:";
        document.getElementById("iconroundnesslblrare").innerHTML = "ZAOKR??GLENIE IKONY:";
        document.getElementById("displaytimelblrare").innerHTML = "CZAS WY??WIETLANIA:";
        document.getElementById("scalelblrare").innerHTML = "SKALA:";
        document.getElementById("styledefaultrare").innerHTML = "Domy??lna";
        document.getElementById("typesolidrare").innerHTML = "Jednolity Kolor";
        document.getElementById("typegradientrare").innerHTML = "Gradient Kolor??w";
        document.getElementById("typeimgrare").innerHTML = "Zdj??cie w Tle";
        document.getElementById("dragposlblrare").innerHTML = "U??yj Pozycji Niestandardowej";
        document.getElementById("rareiconselectlbl").innerHTML = "NIESTANDARDOWA IKONA:";
        document.getElementById("fontsizelblrare").innerHTML = "ROZMIAR CZCIONKI:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Resetuj Pozycj??";

        document.getElementById("trackopacitylbl").innerHTML = "Krycie ??ledz??ce:";
        document.getElementById("resetlbl").innerHTML = "Zresetuj Aplikacj??";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Szczeg????y gry</a> musz?? by?? r??wnie?? ustawione na ???Publiczne???.';
        document.getElementById("allpercentlbl").innerHTML = "Poka?? Wszystkie Procenty Osi??gni????";
        document.getElementById("iconanimationlbl").innerHTML = "Poka?? Rzadk?? Animacj?? Ikon";
        document.getElementById("hwalbl").innerHTML = "Wy????cz Przyspieszenie Sprz??towe";
        document.getElementById("nvdalbl").innerHTML = "W????cz Obs??ug?? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Poka?? Powiadomienie o Zako??czeniu Gry";
        document.getElementById("ssoverlaylbl").innerHTML = "Zapisz Zrzuty Ekranu z Nak??adk??";
        document.getElementById("ssoverlaypathlbl").innerHTML = "??cie??ka:";
        document.getElementById("opacitylbl").innerHTML = "Przejrzysto???? Powiadomie??:";

        secret = "Tajne Osi??gni??cie!";
        gamecomplete = "Gra Zako??czona!";
        allunlocked = "Odblokowa??e?? wszystkie osi??gni??cia!";
    } else if (config.lang == "portuguese") {
        document.getElementById("username").innerHTML = "Nenhum Usu??rio Detectado";
        document.getElementById("gamestatus").innerHTML = "Nenhum Jogo Detectado";
        document.getElementById("soundfile").innerHTML = "Padr??o (Nenhum Som Selecionado)";
        document.getElementById("soundfilerare").innerHTML = "Padr??o (Nenhum Som Selecionado)";
        document.getElementById("maincheevsound").innerHTML = "Som de Notifica????o Principal";
        document.getElementById("rarecheevsound").innerHTML = "Som de Notifica????o Raro";
        document.getElementById("test").innerHTML = "MOSTRAR NOTIFICA????O DE TESTE";
        document.getElementById("testrare").innerHTML = "MOSTRAR NOTIFICA????O DE TESTE RARA";
        document.getElementById("settingstitle").innerHTML = "DEFINI????ES";
        document.getElementById("configtitle").innerHTML = "CONFIGURA????O";
        document.getElementById("apibox").placeholder = "Digite API Key";
        document.getElementById("steam64box").placeholder = "Digite Steam64ID";
        document.getElementById("other").innerHTML = "OUTROS";
        document.getElementById("showscreenshotlbl").innerHTML = "Mostrar Captura de Tela";
        document.getElementById("showscreenshotlblrare").innerHTML = "Mostrar Captura de Tela";
        document.getElementById("desktoplbl").innerHTML = "Atalho Desktop";
        document.getElementById("startwinlbl").innerHTML = "Executar com Windows";
        document.getElementById("startminlbl").innerHTML = "Iniciar Minimizado";
        document.getElementById("soundonlylbl").innerHTML = "Modo Apenas Som";
        document.getElementById("trackinglbl").innerHTML = 'Mostrar "Agora Rastreando"';

        nouser = "Nenhum Usu??rio Detectado";
        nogame = "Nenhum Jogo Detectado";
        nosound = "Padr??o (Nenhum Som Selecionado)";
        nosoundrare = "Padr??o (Nenhum Som Selecionado)";
        rareheader = `'Conquista Rara Desbloqueada!`;
        unlinked = "N??O CONECTADO";
        linked = "CONECTADO";
        novalue = "Por favor insira um valor";

        resettitle = "Redefinir o Aplicativo Para o Padr??o?";
        resetdesc = `AVISO: Isso remover?? todas as configura????es do usu??rio!`;
        resetbtns = ["Redefinir","Desinstalar","Cancelar"];
    
        traylabel = "Nenhum Jogo Detectado";
        trayshow = "Mostre";
        trayexit = "Feche";

        //!!!1.8 Translations;
        achievementunlocked = "Conquista Desbloqueada!";
        rareachievementunlocked = "Conquista Raro Desbloqueada!";
        testdesc = "Suas notifica????es est??o funcionando corretamente";

        addsound = "Adicionar Som";
        invalid = 'Tipo de Arquivo Inv??lido';
        addimage = 'Adicionar Imagem';
        file = "ARQUIVO";
        nofolder = "Padr??o (Nenhuma Pasta Selecionada)";
        novalidaudio = "Nenhum arquivo de ??udio v??lido localizado em ";
        soundmode = "MODO DE SOM: ";
        randomised = "RANDOMIZADO";
        presskey = "...";
        custompos = "Definir Posi????o Personalizada";
        settingpos = "Configurando Principal...";
        settingposrare = "Configura????o Rara...";

        document.getElementById("steamkeybindlbl").innerHTML = "Captura de Tela do Steam:";
        document.getElementById("langlbl").innerHTML = "L??ngua:";
        document.getElementById("raritylbl").innerHTML = "Valor de Raridade: ";
        document.getElementById("nosteamlbl").innerHTML = "Ocultar Notifica????o do Steam";
        document.getElementById("customiselbl").innerHTML = "CUSTOMIZAR...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Principal';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Raro';
        document.getElementById("customiserstylelbl").innerHTML = "ESTILO DE NOTIFICA????O:";
        document.getElementById("notifypositionlbl").innerHTML = "POSI????O DA TELA:";
        document.getElementById("bgtypelbl").innerHTML = "TIPO DE FUNDO:";
        document.getElementById("colourslbl").innerHTML = "CORES";
        document.getElementById("colour1lbl").innerHTML = "Cor 1";
        document.getElementById("colour2lbl").innerHTML = "Cor 2";
        document.getElementById("textcolourlbl").innerHTML = "Cor do Texto";
        document.getElementById("imgselectlbl").innerHTML = "IMAGEM DE FUNDO:"
        document.getElementById("roundnesslbl").innerHTML = "ARREDONDAMENTO:";
        document.getElementById("iconroundnesslbl").innerHTML = "ARREDONDAMENTO DO ??CONE:";
        document.getElementById("displaytimelbl").innerHTML = "TEMPO DE EXIBI????O:";
        document.getElementById("scalelbl").innerHTML = "TAMANHO:";
        document.getElementById("styledefault").innerHTML = "Padr??o";
        document.getElementById("typesolid").innerHTML = "Cor S??lida";
        document.getElementById("typegradient").innerHTML = "Gradiente de Cor";
        document.getElementById("typeimg").innerHTML = "Imagem de Fundo";
        document.getElementById("dragposlbl").innerHTML = "Usar Posi????o Personalizada";
        document.getElementById("iconselectlbl").innerHTML = "??CONE PERSONALIZADO:";
        document.getElementById("fontsizelbl").innerHTML = "TAMANHO DA FONTE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Redefinir Posi????o";

        document.getElementById("customiserstylelblrare").innerHTML = "ESTILO DE NOTIFICA????O:";
        document.getElementById("notifypositionlblrare").innerHTML = "POSI????O DA TELA:";
        document.getElementById("bgtypelblrare").innerHTML = "TIPO DE FUNDO:";
        document.getElementById("rarecolourslbl").innerHTML = "CORES";
        document.getElementById("colour1lblrare").innerHTML = "Cor 1";
        document.getElementById("colour2lblrare").innerHTML = "Cor 2";
        document.getElementById("textcolourlblrare").innerHTML = "Cor do Texto";
        document.getElementById("rareimgselectlbl").innerHTML = "IMAGEM DE FUNDO:"
        document.getElementById("roundnesslblrare").innerHTML = "ARREDONDAMENTO:";
        document.getElementById("iconroundnesslblrare").innerHTML = "ARREDONDAMENTO DO ??CONE:";
        document.getElementById("displaytimelblrare").innerHTML = "TEMPO DE EXIBI????O:";
        document.getElementById("scalelblrare").innerHTML = "TAMANHO:";
        document.getElementById("styledefaultrare").innerHTML = "Padr??o";
        document.getElementById("typesolidrare").innerHTML = "Cor S??lida";
        document.getElementById("typegradientrare").innerHTML = "Gradiente de Cor";
        document.getElementById("typeimgrare").innerHTML = "Imagem de Fundo";
        document.getElementById("dragposlblrare").innerHTML = "Usar Posi????o Personalizada";
        document.getElementById("rareiconselectlbl").innerHTML = "??CONE PERSONALIZADO:";
        document.getElementById("fontsizelblrare").innerHTML = "TAMANHO DA FONTE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Redefinir Posi????o";

        document.getElementById("trackopacitylbl").innerHTML = "Opacidade:";
        document.getElementById("resetlbl").innerHTML = "Redefinir Aplicativo";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Detalhes do jogo</a> devem ser "P??blicos".';
        document.getElementById("allpercentlbl").innerHTML = "Mostrar Todas As Porcentagens";
        document.getElementById("iconanimationlbl").innerHTML = "Mostrar Anima????o de ??cone Raro";
        document.getElementById("hwalbl").innerHTML = "Desativar Acelera????o de Hardware";
        document.getElementById("nvdalbl").innerHTML = "Ativar Suporte NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Mostrar Notifica????o de Conclus??o do Jogo";
        document.getElementById("ssoverlaylbl").innerHTML = "Salvar Capturas de Tela com Sobreposi????o";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Caminho:";
        document.getElementById("opacitylbl").innerHTML = "Opacidade da Notifica????o:";

        secret = "Conquista Secreta!";
        gamecomplete = "Jogo Completo!";
        allunlocked = "Voc?? desbloqueou todas as conquistas!";
    } else if (config.lang == "romanian") {
        document.getElementById("username").innerHTML = "Niciun Utilizator Detectat";
        document.getElementById("gamestatus").innerHTML = "Niciun Joc Detectat";
        document.getElementById("soundfile").innerHTML = "Implicit (F??r?? Sunet Selectat)";
        document.getElementById("soundfilerare").innerHTML = "Implicit (F??r?? Sunet Selectat)";
        document.getElementById("maincheevsound").innerHTML = "Sunet de Notificare Principal";
        document.getElementById("rarecheevsound").innerHTML = "Sunete de Notificare Rar";
        document.getElementById("test").innerHTML = "AFI??A??I NOTIFICAREA TESTULUI";
        document.getElementById("testrare").innerHTML = "AFI??A??I NOTIFICAREA TESTULUI RAR";
        document.getElementById("settingstitle").innerHTML = "SET??RI";
        document.getElementById("configtitle").innerHTML = "CONFIGURARE";
        document.getElementById("apibox").placeholder = "Introduce??i API Key";
        document.getElementById("steam64box").placeholder = "Introduce??i Steam64ID";
        document.getElementById("other").innerHTML = "ALTE";
        document.getElementById("showscreenshotlbl").innerHTML = "Afi??eaz?? Captura De Ecran";
        document.getElementById("showscreenshotlblrare").innerHTML = "Afi??eaz?? Captura De Ecran";
        document.getElementById("desktoplbl").innerHTML = "Comand?? Rapid?? Pe Desktop";
        document.getElementById("startwinlbl").innerHTML = "Rula??i C??nd Windows Porne??te";
        document.getElementById("startminlbl").innerHTML = "??ncepe Minimizat";
        document.getElementById("soundonlylbl").innerHTML = "Modul Numai Sunet";
        document.getElementById("trackinglbl").innerHTML = 'Afi??eaz?? Notificarea ???Urm??rire???.';

        nouser = "Niciun Utilizator Detectat";
        nogame = "Niciun Joc Detectat";
        nosound = "Implicit (F??r?? Sunet Selectat)";
        nosoundrare = "Implicit (F??r?? Sunet Selectat)";
        rareheader = `'Realizare Rar?? Deblocat??!`;
        unlinked = "NU ESTE CONECTAT";
        linked = "CONECTAT";
        novalue = "Va rug??m s?? introduce??i o valoare";
    
        resettitle = "Reseta??i Aplica??ia La Valoarea Implicit???";
        resetdesc = `AVERTISMENT: Acest lucru va elimina toate set??rile utilizatorului!`;
        resetbtns = ["Reseteaz??","Dezinstaleaz??","Anulare"];
    
        traylabel = "Niciun Joc Detectat";
        trayshow = "Deschide??i";
        trayexit = "Ie??i??i";

        //!!!1.8 Translations;
        achievementunlocked = "Succes Deblocat!";
        rareachievementunlocked = "Succes Rar Deblocat!";
        testdesc = "Notific??rile dvs func??ioneaz?? corect";

        addsound = "Ad??uga??i Sunetul Selectat";
        invalid = 'Tip De Fi??ier Nevalid';
        addimage = 'Ad??uga??i Imaginea Selectat??';
        file = "FI??IER";
        nofolder = "Implicit (Niciun Folder Selectat)";
        novalidaudio = "Nu exist?? fi??iere audio valide aflate ??n";
        soundmode = "MOD SUNET: ";
        randomised = "ALEATORIZATE";
        presskey = "...";
        custompos = "Seta??i Pozi??ia Personalizat??";
        settingpos = "Setarea Principal??...";
        settingposrare = "Setarea Rar...";

        document.getElementById("steamkeybindlbl").innerHTML = "Captur?? de Ecran Steam:";
        document.getElementById("langlbl").innerHTML = "Limba:";
        document.getElementById("raritylbl").innerHTML = "Procent de Raritate: ";
        document.getElementById("nosteamlbl").innerHTML = "Ascunde??i Notificarea Steam";
        document.getElementById("customiselbl").innerHTML = "PERSONALIZ??...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Principal';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Rar';
        document.getElementById("customiserstylelbl").innerHTML = "STILUL DE NOTIFICARE:";
        document.getElementById("notifypositionlbl").innerHTML = "POZI??IA ECRANULUI:";
        document.getElementById("bgtypelbl").innerHTML = "TIP DE FUNDAL:";
        document.getElementById("colourslbl").innerHTML = "CULORI";
        document.getElementById("colour1lbl").innerHTML = "Culoare 1";
        document.getElementById("colour2lbl").innerHTML = "Culoare 2";
        document.getElementById("textcolourlbl").innerHTML = "Culoare Text";
        document.getElementById("imgselectlbl").innerHTML = "IMAGINE DE FUNDAL:"
        document.getElementById("roundnesslbl").innerHTML = "ROTUNJIME:";
        document.getElementById("iconroundnesslbl").innerHTML = "ROTUNJIME ICONA:";
        document.getElementById("displaytimelbl").innerHTML = "ORA DE AFI??ARE:";
        document.getElementById("scalelbl").innerHTML = "SCAR??:";
        document.getElementById("styledefault").innerHTML = "Implicit";
        document.getElementById("typesolid").innerHTML = "Culoare Solid??";
        document.getElementById("typegradient").innerHTML = "Gradient de Culoare";
        document.getElementById("typeimg").innerHTML = "Imagine de Fundal";
        document.getElementById("dragposlbl").innerHTML = "Utiliza??i Pozi??ia Personalizat??";
        document.getElementById("iconselectlbl").innerHTML = "ICONA PERSONALIZAT??:";
        document.getElementById("fontsizelbl").innerHTML = "MARIMEA FONTULUI:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Reseteaz?? Pozi??ia";

        document.getElementById("customiserstylelblrare").innerHTML = "STILUL DE NOTIFICARE:";
        document.getElementById("notifypositionlblrare").innerHTML = "POZI??IA ECRANULUI:";
        document.getElementById("bgtypelblrare").innerHTML = "TIP DE FUNDAL:";
        document.getElementById("rarecolourslbl").innerHTML = "CULORI";
        document.getElementById("colour1lblrare").innerHTML = "Culoare 1";
        document.getElementById("colour2lblrare").innerHTML = "Culoare 2";
        document.getElementById("textcolourlblrare").innerHTML = "Culoare Text";
        document.getElementById("rareimgselectlbl").innerHTML = "IMAGINE DE FUNDAL:"
        document.getElementById("roundnesslblrare").innerHTML = "ROTUNJIME:";
        document.getElementById("iconroundnesslblrare").innerHTML = "ROTUNJIME ICONA:";
        document.getElementById("displaytimelblrare").innerHTML = "ORA DE AFI??ARE:";
        document.getElementById("scalelblrare").innerHTML = "SCAR??:";
        document.getElementById("styledefaultrare").innerHTML = "Implicit";
        document.getElementById("typesolidrare").innerHTML = "Culoare Solid??";
        document.getElementById("typegradientrare").innerHTML = "Gradient de Culoare";
        document.getElementById("typeimgrare").innerHTML = "Imagine de Fundal";
        document.getElementById("dragposlblrare").innerHTML = "Utiliza??i Pozi??ia Personalizat??";
        document.getElementById("rareiconselectlbl").innerHTML = "ICONA PERSONALIZAT??:";
        document.getElementById("fontsizelblrare").innerHTML = "MARIMEA FONTULUI:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Reseteaz?? Pozi??ia";

        document.getElementById("trackopacitylbl").innerHTML = "Opacitatea Urm??ririi:";
        document.getElementById("resetlbl").innerHTML = "Reseta??i Aplica??ia";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Detaliile jocului</a> trebuie s?? fie ???Publice???.';
        document.getElementById("allpercentlbl").innerHTML = "Afi??a??i Toate Procentele de Realizare";
        document.getElementById("iconanimationlbl").innerHTML = "Afi??a??i Anima??ie Cu Pictograme Rare";
        document.getElementById("hwalbl").innerHTML = "Dezactiva??i Accelera??ia Hardware";
        document.getElementById("nvdalbl").innerHTML = "Activa??i Suportul NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Afi??a??i Notificarea de Finalizare a Jocului";
        document.getElementById("ssoverlaylbl").innerHTML = "Salva??i Capturi de Ecran cu Suprapunere";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Cale:";
        document.getElementById("opacitylbl").innerHTML = "Opacitatea Notific??rilor:";

        secret = "Realizare Secret??!";
        gamecomplete = "Joc Complet!";
        allunlocked = "Ai deblocat toate realiz??rile!";
    } else if (config.lang == "russian") {
        document.getElementById("username").innerHTML = "???????????????????????? ???? ??????????????????";
        document.getElementById("gamestatus").innerHTML = "???????? ???? ????????????????????";
        document.getElementById("soundfile").innerHTML = "???? ?????????????????? (???????? ???? ????????????)";
        document.getElementById("soundfilerare").innerHTML = "???? ?????????????????? (???????? ???? ????????????)";
        document.getElementById("maincheevsound").innerHTML = "???????????????? ???????? ????????????????????";
        document.getElementById("rarecheevsound").innerHTML = "???????? ?????????????? ????????????????????";
        document.getElementById("test").innerHTML = "???????????????? ???????????????? ??????????????????????";
        document.getElementById("testrare").innerHTML = "???????????????? ???????? ?????????????? ????????????????????";
        document.getElementById("settingstitle").innerHTML = "??????????????????";
        document.getElementById("configtitle").innerHTML = "????????????????????????";
        document.getElementById("apibox").placeholder = "?????????????? API Key";
        document.getElementById("steam64box").placeholder = "?????????????? Steam64ID";
        document.getElementById("other").innerHTML = "????????????";
        document.getElementById("showscreenshotlbl").innerHTML = "???????????????? ????????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "???????????????? ????????????????";
        document.getElementById("desktoplbl").innerHTML = "?????????? ???? ?????????????? ????????";
        document.getElementById("startwinlbl").innerHTML = "????????????????????????";
        document.getElementById("startminlbl").innerHTML = "???????????????????????? ?????? ????????????????????????";
        document.getElementById("soundonlylbl").innerHTML = "?????????? ???????????? ????????";
        document.getElementById("trackinglbl").innerHTML = '???????????????? "???????????? ??????????????????????????"';

        nouser = "???????????????????????? ???? ??????????????????";
        nogame = "???????? ???? ????????????????????";
        nosound = "???? ?????????????????? (???????? ???? ????????????)";
        nosoundrare = "???? ?????????????????? (???????? ???? ????????????)";
        rareheader = `'?????????????? ???????????? ????????????????????!`;
        unlinked = "?????? ????????????????????";
        linked = "????????????????????";
        novalue = "???????????????????? ?????????????? ????????????????";

        resettitle = "???????????????? ???????????????????? ???? ???????????????????";
        resetdesc = `????????????????: ?????? ???????? ?????????? ?????????????? ?????? ???????????????????????????????? ??????????????????!`;
        resetbtns = ["????????????????","??????????????","????????????????"];
    
        traylabel = "???????? ???? ????????????????????";
        trayshow = "??????";
        trayexit = "??????????";

        //!!!1.8 Translations;
        achievementunlocked = "????????????????????!";
        rareachievementunlocked = "???????????? ????????????????????!";
        testdesc = "???????? ?????????????????????? ???????????????? ??????????????????";

        addsound = "???????????????? ????????";
        invalid = '???????????????? ?????? ??????????';
        addimage = '???????????????? ??????????????????????';
        file = "????????";
        nofolder = "???? ?????????????????? (?????????? ???? ??????????????)";
        novalidaudio = "?????? ???????????????????????????? ??????????????????????, ?????????????????????????? ??";
        soundmode = "???????????????? ??????????: ";
        randomised = "??????????????????";
        presskey = "...";
        custompos = "???????????????????????????????? ??????????????";
        settingpos = "?????????????????? ??????????????????...";
        settingposrare = "?????????????????? ??????????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "???????????? ?????????????????? Steam:";
        document.getElementById("langlbl").innerHTML = "????????:";
        document.getElementById("raritylbl").innerHTML = "?????????????? ????????????????: ";
        document.getElementById("nosteamlbl").innerHTML = "???????????? ?????????????????????? Steam";
        document.getElementById("customiselbl").innerHTML = "??????????????????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">??????????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">????????????';
        document.getElementById("customiserstylelbl").innerHTML = "?????????? ??????????????????????:";
        document.getElementById("notifypositionlbl").innerHTML = "?????????????????? ????????????:";
        document.getElementById("bgtypelbl").innerHTML = "?????? ????????:";
        document.getElementById("colourslbl").innerHTML = "??????????";
        document.getElementById("colour1lbl").innerHTML = "???????? 1";
        document.getElementById("colour2lbl").innerHTML = "???????? 2";
        document.getElementById("textcolourlbl").innerHTML = "???????? ????????????";
        document.getElementById("imgselectlbl").innerHTML = "?????????????? ????????????????:"
        document.getElementById("roundnesslbl").innerHTML = "??????????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "?????????????????? ????????????:";
        document.getElementById("displaytimelbl").innerHTML = "???????????????? ??????????:";
        document.getElementById("scalelbl").innerHTML = "????????????:";
        document.getElementById("styledefault").innerHTML = "????????????";
        document.getElementById("typesolid").innerHTML = "???????????????? ????????";
        document.getElementById("typegradient").innerHTML = "???????????????? ????????????????";
        document.getElementById("typeimg").innerHTML = "?????????????? ????????????????";
        document.getElementById("dragposlbl").innerHTML = "???????????????????????????????? ??????????????";
        document.getElementById("iconselectlbl").innerHTML = "???????????????????????????????? ????????????:";
        document.getElementById("fontsizelbl").innerHTML = "???????????? ????????????:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "???????????????? ??????????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "?????????? ??????????????????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "?????????????????? ????????????:";
        document.getElementById("bgtypelblrare").innerHTML = "?????? ????????:";
        document.getElementById("rarecolourslbl").innerHTML = "??????????";
        document.getElementById("colour1lblrare").innerHTML = "???????? 1";
        document.getElementById("colour2lblrare").innerHTML = "???????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "???????? ????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "?????????????? ????????????????:"
        document.getElementById("roundnesslblrare").innerHTML = "??????????????????:";
        document.getElementById("iconroundnesslblrare").innerHTML = "?????????????????? ????????????:";
        document.getElementById("displaytimelblrare").innerHTML = "???????????????? ??????????:";
        document.getElementById("scalelblrare").innerHTML = "????????????:";
        document.getElementById("styledefaultrare").innerHTML = "????????????";
        document.getElementById("typesolidrare").innerHTML = "???????????????? ????????";
        document.getElementById("typegradientrare").innerHTML = "???????????????? ????????????????";
        document.getElementById("typeimgrare").innerHTML = "?????????????? ????????????????";
        document.getElementById("dragposlblrare").innerHTML = "???????????????????????????????? ??????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "???????????????????????????????? ????????????:";
        document.getElementById("fontsizelblrare").innerHTML = "???????????? ????????????:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "???????????????? ??????????????????";

        document.getElementById("trackopacitylbl").innerHTML = "????????????????????????????:";
        document.getElementById("resetlbl").innerHTML = "???????????????? ????????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">???????????? ????????</a> ???????????? ???????? ????????????????????????????.';
        document.getElementById("allpercentlbl").innerHTML = "???????????????? ?????? ???????????????? ????????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "???????????????? ???????????????? ?????????????? ????????????";
        document.getElementById("hwalbl").innerHTML = "?????????????????? ???????????????????? ??????????????????";
        document.getElementById("nvdalbl").innerHTML = "???????????????? ?????????????????? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "???????????????? ?????????????????????? ?? ???????????????????? ????????";
        document.getElementById("ssoverlaylbl").innerHTML = "???????????????????? ???????????????????? ?? ????????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "????????:";
        document.getElementById("opacitylbl").innerHTML = "????????????????????????????:";

        secret = "?????????????????? ????????????????????!";
        gamecomplete = "?????????????????????? ????????!";
        allunlocked = "???? ???????????????????????????? ?????? ????????????????????!";
    } else if (config.lang == "spanish") {
        document.getElementById("username").innerHTML = "No Se Detect?? Ning??n Usuario";
        document.getElementById("gamestatus").innerHTML = "No Se Detect?? Ning??n Juego";
        document.getElementById("soundfile").innerHTML = "Predeterminado (Sin Sonido Seleccionado)";
        document.getElementById("soundfilerare").innerHTML = "Predeterminado (Sin Sonido Seleccionado)";
        document.getElementById("maincheevsound").innerHTML = "Sonido de Logro Principal";
        document.getElementById("rarecheevsound").innerHTML = "Sonido de Logro Rara";
        document.getElementById("test").innerHTML = "MOSTRAR NOTIFICACI??N DE PRUEBA";
        document.getElementById("testrare").innerHTML = "MOSTRAR NOTIFICACI??N DE PRUEBA RARA";
        document.getElementById("settingstitle").innerHTML = "AJUSTES";
        document.getElementById("configtitle").innerHTML = "CONFIGURACI??N";
        document.getElementById("apibox").placeholder = "Introduzca API Key";
        document.getElementById("steam64box").placeholder = "Introduzca Steam64ID";
        document.getElementById("other").innerHTML = "OTRO";
        document.getElementById("showscreenshotlbl").innerHTML = "Mostrar Captura de Pantalla";
        document.getElementById("showscreenshotlblrare").innerHTML = "Mostrar Captura de Pantalla";
        document.getElementById("desktoplbl").innerHTML = "Atajo Desktop";
        document.getElementById("startwinlbl").innerHTML = "Ejecutar con Windows";
        document.getElementById("startminlbl").innerHTML = "Iniciar Minimizado";
        document.getElementById("soundonlylbl").innerHTML = "Modo Solo Sonido";
        document.getElementById("trackinglbl").innerHTML = 'Mostrar "Ahora Observando"';

        nouser = "No Se Detect?? Ning??n Usuario";
        nogame = "No Se Detect?? Ning??n Juego";
        nosound = "Predeterminado (Sin Sonido Seleccionado)";
        nosoundrare = "Predeterminado (Sin Sonido Seleccionado)";
        rareheader = `'??Logro Raro Desbloqueado!`;
        unlinked = "NO VINCULADO";
        linked = "VINCULADO";
        novalue = "Porfavor introduzca un valor";

        resettitle = "??Restablecer la Aplicaci??n a Los Predeterminados?";
        resetdesc = `ADVERTENCIA: ??Esto eliminar?? todas las configuraciones de usuario!`;
        resetbtns = ["Reiniciar","Desinstalar","Cancelar"];
    
        traylabel = "No Se Detect?? Ning??n Juego";
        trayshow = "Mostrar";
        trayexit = "Salir";

        //!!!1.8 Translations;
        achievementunlocked = "??Logro Desbloqueado!";
        rareachievementunlocked = "??Logro Raro Desbloqueado!";
        testdesc = "Tus notificaciones funcionan correctamente";

        addsound = "Agregar Sonido";
        invalid = 'Tipo de Archivo Invalido';
        addimage = 'Agregar Imagen';
        file = "ARCHIVO";
        nofolder = "Predeterminado (Ninguna Carpeta Seleccionada)";
        novalidaudio = "No hay archivos de audio v??lidos ubicados en ";
        soundmode = "MODO DE SONIDO: ";
        randomised = "ALEATORIZADO";
        presskey = "...";
        custompos = "Establecer Posici??n Personalizada";
        settingpos = "Configuraci??n Principal...";
        settingposrare = "Configuraci??n Rara...";

        document.getElementById("steamkeybindlbl").innerHTML = "Captura de Pantalla de Steam:";
        document.getElementById("langlbl").innerHTML = "Idioma:";
        document.getElementById("raritylbl").innerHTML = "Valor de Rareza: ";
        document.getElementById("nosteamlbl").innerHTML = "Ocultar Notificaci??n de Steam";
        document.getElementById("customiselbl").innerHTML = "PERSONALIZAR...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Principal';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Raro';
        document.getElementById("customiserstylelbl").innerHTML = "ESTILO DE NOTIFICACI??N:";
        document.getElementById("notifypositionlbl").innerHTML = "POSICI??N DE LA PANTALLA:";
        document.getElementById("bgtypelbl").innerHTML = "TIPO DE FONDO:";
        document.getElementById("colourslbl").innerHTML = "COLORES";
        document.getElementById("colour1lbl").innerHTML = "Color 1";
        document.getElementById("colour2lbl").innerHTML = "Color 2";
        document.getElementById("textcolourlbl").innerHTML = "Color del Texto";
        document.getElementById("imgselectlbl").innerHTML = "IMAGEN DE FONDO:"
        document.getElementById("roundnesslbl").innerHTML = "REDONDEZ:";
        document.getElementById("iconroundnesslbl").innerHTML = "REDONDEDAD DEL ICONO:";
        document.getElementById("displaytimelbl").innerHTML = "TIEMPO DE VISUALIZACI??N:";
        document.getElementById("scalelbl").innerHTML = "ESCALA:";
        document.getElementById("styledefault").innerHTML = "Defecto";
        document.getElementById("typesolid").innerHTML = "Color Solido";
        document.getElementById("typegradient").innerHTML = "Gradiente de Color";
        document.getElementById("typeimg").innerHTML = "Imagen de Fondo";
        document.getElementById("dragposlbl").innerHTML = "Usar Posici??n Personalizada";
        document.getElementById("iconselectlbl").innerHTML = "ICONO PERSONALIZADO:";
        document.getElementById("fontsizelbl").innerHTML = "TAMA??O DE FUENTE:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Restablecer Posici??n";

        document.getElementById("customiserstylelblrare").innerHTML = "ESTILO DE NOTIFICACI??N:";
        document.getElementById("notifypositionlblrare").innerHTML = "POSICI??N DE LA PANTALLA:";
        document.getElementById("bgtypelblrare").innerHTML = "TIPO DE FONDO:";
        document.getElementById("rarecolourslbl").innerHTML = "COLORES";
        document.getElementById("colour1lblrare").innerHTML = "Color 1";
        document.getElementById("colour2lblrare").innerHTML = "Color 2";
        document.getElementById("textcolourlblrare").innerHTML = "Color del Texto";
        document.getElementById("rareimgselectlbl").innerHTML = "IMAGEN DE FONDO:"
        document.getElementById("roundnesslblrare").innerHTML = "REDONDEZ:";
        document.getElementById("iconroundnesslblrare").innerHTML = "REDONDEDAD DEL ICONO:";
        document.getElementById("displaytimelblrare").innerHTML = "TIEMPO DE VISUALIZACI??N:";
        document.getElementById("scalelblrare").innerHTML = "ESCALA:";
        document.getElementById("styledefaultrare").innerHTML = "Defecto";
        document.getElementById("typesolidrare").innerHTML = "Color Solido";
        document.getElementById("typegradientrare").innerHTML = "Gradiente de Color";
        document.getElementById("typeimgrare").innerHTML = "Imagen de Fondo";
        document.getElementById("dragposlblrare").innerHTML = "Usar Posici??n Personalizada";
        document.getElementById("rareiconselectlbl").innerHTML = "ICONO PERSONALIZADO:";
        document.getElementById("fontsizelblrare").innerHTML = "TAMA??O DE FUENTE:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Restablecer Posici??n";

        document.getElementById("trackopacitylbl").innerHTML = "Opacidad:";
        document.getElementById("resetlbl").innerHTML = "Restablecer Aplicaci??n";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Detalles del juego</a> debe ser "P??blico".';
        document.getElementById("allpercentlbl").innerHTML = "Mostrar Todos Los Porcentajes";
        document.getElementById("iconanimationlbl").innerHTML = "Mostrar Animaci??n de Icono Raro";
        document.getElementById("hwalbl").innerHTML = "Deshabilitar la Aceleraci??n de Hardware";
        document.getElementById("nvdalbl").innerHTML = "Habilitar El Soporte de NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Mostrar Notificaci??n de Finalizaci??n del Juego";
        document.getElementById("ssoverlaylbl").innerHTML = "Guardar Capturas de Pantalla con Superposici??n";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Ruta:";
        document.getElementById("opacitylbl").innerHTML = "Opacidad de Notificaci??n:";

        secret = "??Logro Secreto!";
        gamecomplete = "??Juego Completo!";
        allunlocked = "??Has desbloqueado todos los logros!";
    } else if (config.lang == "swedish") {
        document.getElementById("username").innerHTML = "Ingen Anv??ndare Uppt??ckt";
        document.getElementById("gamestatus").innerHTML = "Inget Spel Uppt??ckt";
        document.getElementById("soundfile").innerHTML = "Standard (Inget Ljud Valt)";
        document.getElementById("soundfilerare").innerHTML = "Standard (Inget Ljud Valt)";
        document.getElementById("maincheevsound").innerHTML = "Huvudmeddelandeljud";
        document.getElementById("rarecheevsound").innerHTML = "S??llsynt Meddelandeljud";
        document.getElementById("test").innerHTML = "VISA TESTMEDDELANDE";
        document.getElementById("testrare").innerHTML = "VISA S??LLSAMT TESTMEDDELANDE";
        document.getElementById("settingstitle").innerHTML = "INST??LLNINGAR";
        document.getElementById("configtitle").innerHTML = "KONFIGURATION";
        document.getElementById("apibox").placeholder = "Ange API Key";
        document.getElementById("steam64box").placeholder = "Ange Steam64ID";
        document.getElementById("other").innerHTML = "??VRIG";
        document.getElementById("showscreenshotlbl").innerHTML = "Visa Sk??rmdump";
        document.getElementById("showscreenshotlblrare").innerHTML = "Visa Sk??rmdump";
        document.getElementById("desktoplbl").innerHTML = "Skapa Desktop-s??kv??g";
        document.getElementById("startwinlbl").innerHTML = "B??rja med Windows";
        document.getElementById("startminlbl").innerHTML = "Start Minimerad";
        document.getElementById("soundonlylbl").innerHTML = "Endast Ljudl??ge";
        document.getElementById("trackinglbl").innerHTML = 'Visa Meddelanden "Nu Sp??rning"';

        nouser = "Ingen Anv??ndare Uppt??ckt";
        nogame = "Inget Spel Uppt??ckt";
        nosound = "Standard (Inget Ljud Valt)";
        nosoundrare = "Standard (Inget Ljud Valt)";
        rareheader = `'S??llsynt Prestation Uppl??st!`;
        unlinked = "OSL??NKAD";
        linked = "L??NKAD";
        novalue = "Var god ange ett v??rde";
    
        resettitle = "??terst??lla Programmet Till Standard?";
        resetdesc = `VARNING: Detta tar bort alla anv??ndarinst??llningar!`;
        resetbtns = ["??terst??lla","Avinstallera","Annullera"];
    
        traylabel = "Inget Spel Uppt??ckt";
        trayshow = "Visa";
        trayexit = "Avsluta";

        //!!!1.8 Translations;
        achievementunlocked = "Prestation Uppl??st!";
        rareachievementunlocked = "S??llsynt Prestation Uppl??st!";
        testdesc = "Dina aviseringar fungerar korrekt";

        addsound = "L??gg Till Valt Ljud";
        invalid = 'Ogiltig Filtyp';
        addimage = 'L??gg Till Vald Bild';
        file = "FIL";
        nofolder = "Standard (Ingen Mapp Har Valts)";
        novalidaudio = "Inga giltiga ljudfiler finns i ";
        soundmode = "LJUDL??GE: ";
        randomised = "RANDOMISERAD";
        presskey = "...";
        custompos = "St??ll in Anpassad Position";
        settingpos = "St??ller in Huvudposition...";
        settingposrare = "St??ller in S??llsynt Position...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam Sk??rmdump-Knapp:";
        document.getElementById("langlbl").innerHTML = "Spr??k:";
        document.getElementById("raritylbl").innerHTML = "S??llsynthetsprocent: ";
        document.getElementById("nosteamlbl").innerHTML = "D??lj Steam-Meddelande";
        document.getElementById("customiselbl").innerHTML = "PERSONIFIERA...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Huvudsaklig';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">S??llsynt';
        document.getElementById("customiserstylelbl").innerHTML = "MEDDELANDE STIL:";
        document.getElementById("notifypositionlbl").innerHTML = "SK??RMPOSITION:";
        document.getElementById("bgtypelbl").innerHTML = "BAKGRUNDSTYP:";
        document.getElementById("colourslbl").innerHTML = "F??RGER";
        document.getElementById("colour1lbl").innerHTML = "F??rg 1";
        document.getElementById("colour2lbl").innerHTML = "F??rg 2";
        document.getElementById("textcolourlbl").innerHTML = "Textf??rg";
        document.getElementById("imgselectlbl").innerHTML = "BAKGRUNDSBILD:"
        document.getElementById("roundnesslbl").innerHTML = "RUNDHET:";
        document.getElementById("iconroundnesslbl").innerHTML = "IKON RUNDHET:";
        document.getElementById("displaytimelbl").innerHTML = "VISNINGSTID:";
        document.getElementById("scalelbl").innerHTML = "SCALE:";
        document.getElementById("styledefault").innerHTML = "Standard";
        document.getElementById("typesolid").innerHTML = "Solid F??rg";
        document.getElementById("typegradient").innerHTML = "F??rggradient";
        document.getElementById("typeimg").innerHTML = "Bakgrundsbild";
        document.getElementById("dragposlbl").innerHTML = "Anv??nd Anpassad Sk??rmposition";
        document.getElementById("iconselectlbl").innerHTML = "ANPASSAD IKON:";
        document.getElementById("fontsizelbl").innerHTML = "TEXTSTORLEK:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "??terst??ll Position";

        document.getElementById("customiserstylelblrare").innerHTML = "MEDDELANDE STIL:";
        document.getElementById("notifypositionlblrare").innerHTML = "SK??RMPOSITION:";
        document.getElementById("bgtypelblrare").innerHTML = "BAKGRUNDSTYP:";
        document.getElementById("rarecolourslbl").innerHTML = "F??RGER";
        document.getElementById("colour1lblrare").innerHTML = "F??rg 1";
        document.getElementById("colour2lblrare").innerHTML = "F??rg 2";
        document.getElementById("textcolourlblrare").innerHTML = "Textf??rg";
        document.getElementById("rareimgselectlbl").innerHTML = "BAKGRUNDSBILD:"
        document.getElementById("roundnesslblrare").innerHTML = "RUNDHET:";
        document.getElementById("iconroundnesslblrare").innerHTML = "IKON RUNDHET:";
        document.getElementById("displaytimelblrare").innerHTML = "VISNINGSTID:";
        document.getElementById("scalelblrare").innerHTML = "SCALE:";
        document.getElementById("styledefaultrare").innerHTML = "Standard";
        document.getElementById("typesolidrare").innerHTML = "Solid F??rg";
        document.getElementById("typegradientrare").innerHTML = "F??rggradient";
        document.getElementById("typeimgrare").innerHTML = "Bakgrundsbild";
        document.getElementById("dragposlblrare").innerHTML = "Anv??nd Anpassad Sk??rmposition";
        document.getElementById("rareiconselectlbl").innerHTML = "ANPASSAD IKON:";
        document.getElementById("fontsizelblrare").innerHTML = "TEXTSTORLEK:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "??terst??ll Position";

        document.getElementById("trackopacitylbl").innerHTML = "Sp??rningsopacitet:";
        document.getElementById("resetlbl").innerHTML = "??terst??ll Applikation";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Spelinformation</a> m??ste vara "Offentlig".';
        document.getElementById("allpercentlbl").innerHTML = "Visa Alla Prestationsprocent";
        document.getElementById("iconanimationlbl").innerHTML = "Visa S??llsynt Ikonanimering";
        document.getElementById("hwalbl").innerHTML = "Inaktivera H??rdvaruacceleration";
        document.getElementById("nvdalbl").innerHTML = "Aktivera NVDA Support";
        document.getElementById("gamecompletionlbl").innerHTML = "Visa Meddelande om Spelslut";
        document.getElementById("ssoverlaylbl").innerHTML = "Spara Sk??rmdumpar med Overlay";
        document.getElementById("ssoverlaypathlbl").innerHTML = "V??g:";
        document.getElementById("opacitylbl").innerHTML = "Opacitet:";

        secret = "Hemlig Prestation!";
        gamecomplete = "Spelet Avklarat!";
        allunlocked = "Du har l??st upp alla prestationer!";
    } else if (config.lang == "thai") {
        document.getElementById("username").innerHTML = "?????????????????????????????????";
        document.getElementById("gamestatus").innerHTML = "????????????????????????";
        document.getElementById("soundfile").innerHTML = "????????????????????????????????? (????????????????????????????????????????????????)";
        document.getElementById("soundfilerare").innerHTML = "????????????????????????????????? (????????????????????????????????????????????????)";
        document.getElementById("maincheevsound").innerHTML = "?????????????????????????????????????????????????????????";
        document.getElementById("rarecheevsound").innerHTML = "?????????????????????????????????????????????????????????????????????";
        document.getElementById("test").innerHTML = "????????????????????????????????????????????????????????????????????????";
        document.getElementById("testrare").innerHTML = "????????????????????????????????????????????????????????????????????????????????????????????????";
        document.getElementById("settingstitle").innerHTML = "??????????????????????????????";
        document.getElementById("configtitle").innerHTML = "?????????????????????????????????";
        document.getElementById("apibox").placeholder = "????????????????????? API Key";
        document.getElementById("steam64box").placeholder = "????????????????????? Steam64ID";
        document.getElementById("other").innerHTML = "???????????? ???";
        document.getElementById("showscreenshotlbl").innerHTML = "???????????????????????????????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "???????????????????????????????????????";
        document.getElementById("desktoplbl").innerHTML = "??????????????????????????????????????????????????????????????????";
        document.getElementById("startwinlbl").innerHTML = "??????????????????????????? Windows";
        document.getElementById("startminlbl").innerHTML = "?????????????????????????????????????????????";
        document.getElementById("soundonlylbl").innerHTML = "???????????????????????????????????????????????????";
        document.getElementById("trackinglbl").innerHTML = '???????????? "?????????????????????????????????" ????????????????????????????????????';

        nouser = "?????????????????????????????????";
        nogame = "????????????????????????";
        nosound = "????????????????????????????????? (????????????????????????????????????????????????)";
        nosoundrare = "????????????????????????????????? (????????????????????????????????????????????????)";
        rareheader = `'??????????????????????????????????????????????????????????????????!`;
        unlinked = "????????????????????????????????????";
        linked = "???????????????????????????";
        novalue = "?????????????????????????????????";
    
        resettitle = "?????????????????????????????????????????????????????????????????????????????????????????????????";
        resetdesc = `?????????????????????: ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????!`;
        resetbtns = ["??????????????????","???????????????????????????????????????","??????????????????"];
    
        traylabel = "????????????????????????";
        trayshow = "????????????";
        trayexit = "??????????????????";

        //!!!1.8 Translations;
        achievementunlocked = "???????????????????????????????????????????????????!";
        rareachievementunlocked = "??????????????????????????????????????????????????????????????????!";
        testdesc = "?????????????????????????????????????????????????????????????????????????????????????????????????????????";

        addsound = "??????????????????????????????????????????????????????";
        invalid = '????????????????????????????????????????????????????????????';
        addimage = '?????????????????????????????????????????????????????????';
        file = "????????????";
        nofolder = "????????????????????????????????? (?????????????????????????????????????????????????????????)";
        novalidaudio = "??????????????????????????????????????????????????????????????????????????????????????????";
        soundmode = "???????????????????????????: ";
        randomised = "????????????";
        presskey = "...";
        custompos = "?????????????????????????????????????????????????????????????????????????????????????????????";
        settingpos = "?????????????????????????????????????????????????????????????????????...";
        settingposrare = "???????????????????????????????????????????????????????????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "??????????????????????????????????????? Steam:";
        document.getElementById("langlbl").innerHTML = "????????????:";
        document.getElementById("raritylbl").innerHTML = "???????????????????????????????????????:";
        document.getElementById("nosteamlbl").innerHTML = "???????????????????????????????????????????????? Steam";
        document.getElementById("customiselbl").innerHTML = "????????????????????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">????????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">???????????????';
        document.getElementById("customiserstylelbl").innerHTML = "??????????????????????????????????????????????????????:";
        document.getElementById("notifypositionlbl").innerHTML = "???????????????????????????????????????:";
        document.getElementById("bgtypelbl").innerHTML = "??????????????????????????????????????????:";
        document.getElementById("colourslbl").innerHTML = "??????";
        document.getElementById("colour1lbl").innerHTML = "?????? 1";
        document.getElementById("colour2lbl").innerHTML = "?????? 2";
        document.getElementById("textcolourlbl").innerHTML = "???????????????????????????";
        document.getElementById("imgselectlbl").innerHTML = "?????????????????????????????????:"
        document.getElementById("roundnesslbl").innerHTML = "?????????????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "?????????????????????????????????:";
        document.getElementById("displaytimelbl").innerHTML = "??????????????????????????????:";
        document.getElementById("scalelbl").innerHTML = "???????????????????????????:";
        document.getElementById("styledefault").innerHTML = "?????????????????????????????????";
        document.getElementById("typesolid").innerHTML = "???????????????";
        document.getElementById("typegradient").innerHTML = "???????????????????????????????????????";
        document.getElementById("typeimg").innerHTML = "?????????????????????????????????";
        document.getElementById("dragposlbl").innerHTML = "?????????????????????????????????????????????????????????????????????????????????";
        document.getElementById("iconselectlbl").innerHTML = "????????????????????????????????????????????????:";
        document.getElementById("fontsizelbl").innerHTML = "????????????????????????????????????:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "???????????????????????????????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "??????????????????????????????????????????????????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "???????????????????????????????????????:";
        document.getElementById("bgtypelblrare").innerHTML = "??????????????????????????????????????????:";
        document.getElementById("rarecolourslbl").innerHTML = "??????";
        document.getElementById("colour1lblrare").innerHTML = "?????? 1";
        document.getElementById("colour2lblrare").innerHTML = "?????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "???????????????????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "?????????????????????????????????:"
        document.getElementById("roundnesslblrare").innerHTML = "?????????????????????:";
        document.getElementById("iconroundnesslblrare").innerHTML = "?????????????????????????????????:";
        document.getElementById("displaytimelblrare").innerHTML = "??????????????????????????????:";
        document.getElementById("scalelblrare").innerHTML = "???????????????????????????:";
        document.getElementById("styledefaultrare").innerHTML = "?????????????????????????????????";
        document.getElementById("typesolidrare").innerHTML = "???????????????";
        document.getElementById("typegradientrare").innerHTML = "???????????????????????????????????????";
        document.getElementById("typeimgrare").innerHTML = "?????????????????????????????????";
        document.getElementById("dragposlblrare").innerHTML = "?????????????????????????????????????????????????????????????????????????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "????????????????????????????????????????????????:";
        document.getElementById("fontsizelblrare").innerHTML = "????????????????????????????????????:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "???????????????????????????????????????";

        document.getElementById("trackopacitylbl").innerHTML = "???????????????????????????????????????:";
        document.getElementById("resetlbl").innerHTML = "???????????????????????????????????????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">???????????????????????????????????????</a>????????????????????????????????????????????? "?????????????????????" ????????????';
        document.getElementById("allpercentlbl").innerHTML = "????????????????????????????????????????????????????????????????????????????????????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "????????????????????????????????????????????????????????????????????????";
        document.getElementById("hwalbl").innerHTML = "???????????????????????????????????????????????????????????????????????????";
        document.getElementById("nvdalbl").innerHTML = "??????????????????????????????????????????????????????????????? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "????????????????????????????????????????????????????????????????????????";
        document.getElementById("ssoverlaylbl").innerHTML = "??????????????????????????????????????????????????????????????????????????????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "?????????????????????:";
        document.getElementById("opacitylbl").innerHTML = "??????????????????????????????????????????????????????????????????:";

        secret = "???????????????????????????????????????????????????!";
        gamecomplete = "???????????????!";
        allunlocked = "??????????????????????????????????????????????????????????????????????????????????????????????????????!";
    } else if (config.lang == "turkish") {
        document.getElementById("username").innerHTML = "Kullan??c?? Tespit Edilmedi";
        document.getElementById("gamestatus").innerHTML = "Oyun Alg??lanmad??";
        document.getElementById("soundfile").innerHTML = "Varsay??lan (Se??ili Ses Yok)";
        document.getElementById("soundfilerare").innerHTML = "Varsay??lan (Se??ili Ses Yok)";
        document.getElementById("maincheevsound").innerHTML = "Ana Bildirim Sesi";
        document.getElementById("rarecheevsound").innerHTML = "Nadir Bildirim Sesi";
        document.getElementById("test").innerHTML = "TEST B??LD??R??M??N?? G??STER";
        document.getElementById("testrare").innerHTML = "NAD??R TEST B??LD??R??M??N?? G??STER";
        document.getElementById("settingstitle").innerHTML = "AYARLAR";
        document.getElementById("configtitle").innerHTML = "KONF??G??RASYON";
        document.getElementById("apibox").placeholder = "API Key'i girin";
        document.getElementById("steam64box").placeholder = "Steam64ID'yi girin";
        document.getElementById("other").innerHTML = "BA??KA";
        document.getElementById("showscreenshotlbl").innerHTML = "Ekran G??r??nt??s??n?? G??ster";
        document.getElementById("showscreenshotlblrare").innerHTML = "Ekran G??r??nt??s??n?? G??ster";
        document.getElementById("desktoplbl").innerHTML = "Desktop k??sayolu olu??tur";
        document.getElementById("startwinlbl").innerHTML = "Windows Ba??lad??????nda ??al????t??r";
        document.getElementById("startminlbl").innerHTML = "Ba??lang????ta Gizle";
        document.getElementById("soundonlylbl").innerHTML = "Yaln??zca Ses Modu";
        document.getElementById("trackinglbl").innerHTML = '"??imdi ??zliyor" Bildirimi';

        nouser = "Kullan??c?? Tespit Edilmedi";
        nogame = "Oyun Alg??lanmad??";
        nosound = "Varsay??lan (Se??ili Ses Yok)";
        nosoundrare = "Varsay??lan (Se??ili Ses Yok)";
        rareheader = `'Nadir Ba??ar??n??n Kilidi A????ld??!`;
        unlinked = "BA??LI DE????L";
        linked = "BA??LI";
        novalue = "L??tfen bir de??er girin";
    
        resettitle = "Uygulama Varsay??lana S??f??rlans??n M???";
        resetdesc = `UYARI: Bu t??m kullan??c?? ayarlar??n?? kald??racakt??r!`;
        resetbtns = ["S??f??rla","Kald??r","??ptal Etmek"];
    
        traylabel = "Oyun Alg??lanmad??";
        trayshow = "G??ster";
        trayexit = "????k";

        //!!!1.8 Translations;
        achievementunlocked = "Ba??ar??m A????ld??!";
        rareachievementunlocked = "Nadir Ba??ar??n??n Kilidi A????ld??!";
        testdesc = "Bildirimleriniz d??zg??n ??al??????yor";

        addsound = "Se??ilen Sesi Ekle";
        invalid = 'Ge??ersiz Dosya T??r??';
        addimage = 'Se??ili Resmi Ekle';
        file = "DOSYA";
        nofolder = "Varsay??lan (Klas??r Se??ilmedi)";
        novalidaudio = "????inde ge??erli ses dosyas?? yok ";
        soundmode = "SES MODU: ";
        randomised = "RANDOM??ZE";
        presskey = "...";
        custompos = "??zel Ekran Konumunu Ayarla";
        settingpos = "Ana Konum Ayarlan??yor...";
        settingposrare = "Nadir Konum Ayarlan??yor...";

        document.getElementById("steamkeybindlbl").innerHTML = "Steam Ekran G??r??nt??s??:";
        document.getElementById("langlbl").innerHTML = "Dilim:";
        document.getElementById("raritylbl").innerHTML = "Nadirlik Y??zdesi: ";
        document.getElementById("nosteamlbl").innerHTML = "Steam Bildirimini Gizle";
        document.getElementById("customiselbl").innerHTML = "??ZELLE??T??RMEK...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Ana';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Nadir';
        document.getElementById("customiserstylelbl").innerHTML = "B??LD??R??M TARZI:";
        document.getElementById("notifypositionlbl").innerHTML = "EKRAN KONUMU:";
        document.getElementById("bgtypelbl").innerHTML = "ARKA PLAN T??P??:";
        document.getElementById("colourslbl").innerHTML = "RENKLER";
        document.getElementById("colour1lbl").innerHTML = "Renk 1";
        document.getElementById("colour2lbl").innerHTML = "Renk 2";
        document.getElementById("textcolourlbl").innerHTML = "Metin Rengi";
        document.getElementById("imgselectlbl").innerHTML = "ARKA PLAN G??R??NT??S??:"
        document.getElementById("roundnesslbl").innerHTML = "YUVARLAKLIK:";
        document.getElementById("iconroundnesslbl").innerHTML = "S??MGE YUVARLAKLI??I:";
        document.getElementById("displaytimelbl").innerHTML = "G??R??NT?? S??RES??:";
        document.getElementById("scalelbl").innerHTML = "??L??EK:";
        document.getElementById("styledefault").innerHTML = "Varsay??lan";
        document.getElementById("typesolid").innerHTML = "D??z Renk";
        document.getElementById("typegradient").innerHTML = "Renk Gradyan??";
        document.getElementById("typeimg").innerHTML = "Arka Plan G??r??nt??s??";
        document.getElementById("dragposlbl").innerHTML = "??zel Ekran Konumunu Kullan";
        document.getElementById("iconselectlbl").innerHTML = "??ZEL ??KON:";
        document.getElementById("fontsizelbl").innerHTML = "YAZI BOYUTU:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "Pozisyonu S??f??rla";

        document.getElementById("customiserstylelblrare").innerHTML = "B??LD??R??M TARZI:";
        document.getElementById("notifypositionlblrare").innerHTML = "EKRAN KONUMU:";
        document.getElementById("bgtypelblrare").innerHTML = "ARKA PLAN T??P??:";
        document.getElementById("rarecolourslbl").innerHTML = "RENKLER";
        document.getElementById("colour1lblrare").innerHTML = "Renk 1";
        document.getElementById("colour2lblrare").innerHTML = "Renk 2";
        document.getElementById("textcolourlblrare").innerHTML = "Metin Rengi";
        document.getElementById("rareimgselectlbl").innerHTML = "ARKA PLAN G??R??NT??S??:"
        document.getElementById("roundnesslblrare").innerHTML = "YUVARLAKLIK:";
        document.getElementById("iconroundnesslblrare").innerHTML = "S??MGE YUVARLAKLI??I:";
        document.getElementById("displaytimelblrare").innerHTML = "G??R??NT?? S??RES??:";
        document.getElementById("scalelblrare").innerHTML = "??L??EK:";
        document.getElementById("styledefaultrare").innerHTML = "Varsay??lan";
        document.getElementById("typesolidrare").innerHTML = "D??z Renk";
        document.getElementById("typegradientrare").innerHTML = "Renk Gradyan??";
        document.getElementById("typeimgrare").innerHTML = "Arka Plan G??r??nt??s??";
        document.getElementById("dragposlblrare").innerHTML = "??zel Ekran Konumunu Kullann";
        document.getElementById("rareiconselectlbl").innerHTML = "??ZEL ??KON:";
        document.getElementById("fontsizelblrare").innerHTML = "YAZI BOYUTU:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "Pozisyonu S??f??rla";

        document.getElementById("trackopacitylbl").innerHTML = "Opakl?????? ??zliyor:";
        document.getElementById("resetlbl").innerHTML = "Uygulamay?? S??f??rla";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Oyun Ayr??nt??lar??</a> da "Genel" olarak ayarlanmal??d??r.';
        document.getElementById("allpercentlbl").innerHTML = "T??m Ba??ar?? Y??zdelerini G??ster";
        document.getElementById("iconanimationlbl").innerHTML = "Nadir Simge Animasyonunu G??ster";
        document.getElementById("hwalbl").innerHTML = "Donan??m H??zland??rmas??n?? Devre D?????? B??rak";
        document.getElementById("nvdalbl").innerHTML = "NVDA Deste??ini Etkinle??tir";
        document.getElementById("gamecompletionlbl").innerHTML = "Oyun Tamamlama Bildirimini G??ster";
        document.getElementById("ssoverlaylbl").innerHTML = "Yer Payla????ml?? Ekran G??r??nt??lerini Kaydet";
        document.getElementById("ssoverlaypathlbl").innerHTML = "Yol:";
        document.getElementById("opacitylbl").innerHTML = "Bildirim Opakl??????:";

        secret = "Gizli Ba??ar??!";
        gamecomplete = "Oyun Tamamland??!";
        allunlocked = "T??m ba??ar??lar??n kilidini a??t??n??z!";
    } else if (config.lang == "ukrainian") {
        document.getElementById("username").innerHTML = "?????????????????????? ???? ????????????????";
        document.getElementById("gamestatus").innerHTML = "?????? ???? ????????????????";
        document.getElementById("soundfile").innerHTML = "???? ?????????????????????????? (???????? ???? ??????????????)";
        document.getElementById("soundfilerare").innerHTML = "???? ?????????????????????????? (???????? ???? ??????????????)";
        document.getElementById("maincheevsound").innerHTML = "???????????????? ???????? ????????????????????";
        document.getElementById("rarecheevsound").innerHTML = "???????? ???????????????????? ????????????????????";
        document.getElementById("test").innerHTML = "???????????????? ???????????????????????? ????????";
        document.getElementById("testrare").innerHTML = "???????????????? ???????????????? ???????????????????????? ????????";
        document.getElementById("settingstitle").innerHTML = "????????????????????????";
        document.getElementById("configtitle").innerHTML = "????????????????????????";
        document.getElementById("apibox").placeholder = "?????????????? API Key";
        document.getElementById("steam64box").placeholder = "?????????????? Steam64ID";
        document.getElementById("other").innerHTML = "??????????";
        document.getElementById("showscreenshotlbl").innerHTML = "???????????????? ???????????????? ????????????????????";
        document.getElementById("showscreenshotlblrare").innerHTML = "???????????????? ???????????????? ????????????????????";
        document.getElementById("desktoplbl").innerHTML = "???????????????? ?????????? ???? Desktop";
        document.getElementById("startwinlbl").innerHTML = "?????????????? ?? Windows";
        document.getElementById("startminlbl").innerHTML = "?????????????? ?????? ?????? ??????????????";
        document.getElementById("soundonlylbl").innerHTML = "?????????? ???????? ??????????";
        document.getElementById("trackinglbl").innerHTML = '???????????????? "??????????????????????"';

        nouser = "?????????????????????? ???? ????????????????";
        nogame = "?????? ???? ????????????????";
        nosound = "???? ?????????????????????????? (???????? ???? ??????????????)";
        nosoundrare = "???? ?????????????????????????? (???????? ???? ??????????????)";
        rareheader = `'???????????????? ???????????????????? ????????????????????????!`;
        unlinked = "???? ??????'????????????";
        linked = "????????????????????";
        novalue = "?????????????? ????????????????";

        resettitle = "?????????????? ???????????????? ???? ???????????????????????????";
        resetdesc = `????????????????????????: ???? ???????????????? ???? ?????????????????? ???????? ?????????????????????? ??????????????????????!`;
        resetbtns = ["??????????????","????????????????","??????????????????"];
    
        traylabel = "?????? ???? ????????????????";
        trayshow = "????????????????????";
        trayexit = "??????????";

        //!!!1.8 Translations;
        achievementunlocked = "????????????????????!";
        rareachievementunlocked = "???????????????? ????????????????????!";
        testdesc = "???????? ???????????????????? ???????????????? ??????????????????";

        addsound = "???????????? ????????";
        invalid = '?????????????????? ?????? ??????????';
        addimage = '???????????? ????????????????????';
        file = "????????";
        nofolder = "???? ?????????????????????????? (?????????? ???? ??????????????)";
        novalidaudio = "?????????? ?????????????? ?????????????????????? ";
        soundmode = "?????????? ??????????: ";
        randomised = "????????????????????";
        presskey = "...";
        custompos = "???????????????????? ???????????????????? ??????????????????";
        settingpos = "???????????????????????? ??????????????????...";
        settingposrare = "???????????????????????? ????????????????????...";

        document.getElementById("steamkeybindlbl").innerHTML = "???????????? ???????????? ???????????? Steam:";
        document.getElementById("langlbl").innerHTML = "????????:";
        document.getElementById("raritylbl").innerHTML = "???????????????? ????????????????: ";
        document.getElementById("nosteamlbl").innerHTML = "?????????????????? ???????????????????? Steam";
        document.getElementById("customiselbl").innerHTML = "????????????????????...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">????????????????';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">????????????????';
        document.getElementById("customiserstylelbl").innerHTML = "?????????? ????????????????????????:";
        document.getElementById("notifypositionlbl").innerHTML = "?????????????????? ????????????:";
        document.getElementById("bgtypelbl").innerHTML = "?????? ????????:";
        document.getElementById("colourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lbl").innerHTML = "?????????? 1";
        document.getElementById("colour2lbl").innerHTML = "?????????? 2";
        document.getElementById("textcolourlbl").innerHTML = "?????????? ????????????";
        document.getElementById("imgselectlbl").innerHTML = "???????????? ????????????????????:"
        document.getElementById("roundnesslbl").innerHTML = "??????????????????:";
        document.getElementById("iconroundnesslbl").innerHTML = "?????????????????? ??????????:";
        document.getElementById("displaytimelbl").innerHTML = "?????? ????????????????????????:";
        document.getElementById("scalelbl").innerHTML = "????????????::";
        document.getElementById("styledefault").innerHTML = "???? ??????????????????????????";
        document.getElementById("typesolid").innerHTML = "?????????????????? ??????????";
        document.getElementById("typegradient").innerHTML = "???????????????? ????????????????";
        document.getElementById("typeimg").innerHTML = "???????????? ????????????????????";
        document.getElementById("dragposlbl").innerHTML = "???????????????????? ??????????????";
        document.getElementById("iconselectlbl").innerHTML = "?????????????? ??????????????:";
        document.getElementById("fontsizelbl").innerHTML = "???????????? ????????????:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "?????????????? ??????????????";

        document.getElementById("customiserstylelblrare").innerHTML = "?????????? ????????????????????????:";
        document.getElementById("notifypositionlblrare").innerHTML = "?????????????????? ????????????:";
        document.getElementById("bgtypelblrare").innerHTML = "?????? ????????:";
        document.getElementById("rarecolourslbl").innerHTML = "??????????????";
        document.getElementById("colour1lblrare").innerHTML = "?????????? 1";
        document.getElementById("colour2lblrare").innerHTML = "?????????? 2";
        document.getElementById("textcolourlblrare").innerHTML = "?????????? ????????????";
        document.getElementById("rareimgselectlbl").innerHTML = "???????????? ????????????????????:"
        document.getElementById("roundnesslblrare").innerHTML = "??????????????????:";
        document.getElementById("iconroundnesslblrare").innerHTML = "?????????????????? ??????????:";
        document.getElementById("displaytimelblrare").innerHTML = "?????? ????????????????????????:";
        document.getElementById("scalelblrare").innerHTML = "????????????::";
        document.getElementById("styledefaultrare").innerHTML = "???? ??????????????????????????";
        document.getElementById("typesolidrare").innerHTML = "?????????????????? ??????????";
        document.getElementById("typegradientrare").innerHTML = "???????????????? ????????????????";
        document.getElementById("typeimgrare").innerHTML = "???????????? ????????????????????";
        document.getElementById("dragposlblrare").innerHTML = "???????????????????? ??????????????";
        document.getElementById("rareiconselectlbl").innerHTML = "?????????????? ??????????????:";
        document.getElementById("fontsizelblrare").innerHTML = "???????????? ????????????:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "?????????????? ??????????????";

        document.getElementById("trackopacitylbl").innerHTML = "????????????????????????:";
        document.getElementById("resetlbl").innerHTML = "?????????????? ????????????????";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">???????????????????? ?????? ??????</a> ?????? ???????? "??????????????????????????????????".';
        document.getElementById("allpercentlbl").innerHTML = "???????????????? ?????? ???????????????? ??????????????????";
        document.getElementById("iconanimationlbl").innerHTML = "???????????????? ???????????????? ?????????????????? ??????????????";
        document.getElementById("hwalbl").innerHTML = "???????????????? ???????????????? ??????????????????????";
        document.getElementById("nvdalbl").innerHTML = "?????????????????? ?????????????????? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "???????????????? ???????????????????? ?????? ???????????????????? ??????";
        document.getElementById("ssoverlaylbl").innerHTML = "?????????????????? ???????????? ???????????? ?? ??????????????????????";
        document.getElementById("ssoverlaypathlbl").innerHTML = "????????:";
        document.getElementById("opacitylbl").innerHTML = "???????????????????????? ??????????????????:";

        secret = "???????????????? ????????????????????!";
        gamecomplete = "?????? ??????????????????!";
        allunlocked = "???? ???????????????????????? ?????? ????????????????????!";
    } else if (config.lang == "vietnamese") {
        document.getElementById("username").innerHTML = "Kh??ng C?? Ng?????i D??ng N??o ???????c Ph??t Hi???n";
        document.getElementById("gamestatus").innerHTML = "Kh??ng C?? Tr?? Ch??i N??o ???????c Ph??t Hi???n";
        document.getElementById("soundfile").innerHTML = "M???c ?????nh (Kh??ng C?? ??m Thanh ???????c Ch???n)";
        document.getElementById("soundfilerare").innerHTML = "M???c ?????nh (Kh??ng C?? ??m Thanh ???????c Ch???n)";
        document.getElementById("maincheevsound").innerHTML = "??m Thanh Ch??nh";
        document.getElementById("rarecheevsound").innerHTML = "??m Thanh Hi???m";
        document.getElementById("test").innerHTML = "HI???N TH??? TH??NG ??I???P KI???M TRA";
        document.getElementById("testrare").innerHTML = "HI???N TH??? TH??NG ??I???P KI???M TRA HI???M";
        document.getElementById("settingstitle").innerHTML = "C??I ?????T";
        document.getElementById("configtitle").innerHTML = "C???U H??NH";
        document.getElementById("apibox").placeholder = "Nh???p API Key";
        document.getElementById("steam64box").placeholder = "Nh???p Steam64ID";
        document.getElementById("other").innerHTML = "KH??C";
        document.getElementById("showscreenshotlbl").innerHTML = "Hi???n Th??? ???nh Ch???p M??n H??nh";
        document.getElementById("showscreenshotlblrare").innerHTML = "Hi???n Th??? ???nh Ch???p M??n H??nh";
        document.getElementById("desktoplbl").innerHTML = "T???o l???i t???t Desktop";
        document.getElementById("startwinlbl").innerHTML = "Ch???y Khi Windows Kh???i ?????ng";
        document.getElementById("startminlbl").innerHTML = "???n Khi Kh???i ?????ng";
        document.getElementById("soundonlylbl").innerHTML = "Ch??? ????? Ch??? ??m Thanh";
        document.getElementById("trackinglbl").innerHTML = 'Hi???n Th??? "Hi???n ??ang Quan S??t"';

        nouser = "Kh??ng C?? Ng?????i D??ng N??o ???????c Ph??t Hi???n";
        nogame = "Kh??ng C?? Tr?? Ch??i N??o ???????c Ph??t Hi???n";
        nosound = "M???c ?????nh (Kh??ng C?? ??m Thanh ???????c Ch???n)";
        nosoundrare = "M???c ?????nh (Kh??ng C?? ??m Thanh ???????c Ch???n)";
        rareheader = `'???? M??? Kh??a Th??nh T??ch Hi???m Hoi!`;
        unlinked = "NG???T K???T N???I";
        linked = "LI??N K???T";
        novalue = "Vui l??ng nh???p m???t gi?? tr???";
    
        resettitle = "?????t L???i ???ng D???ng N??y V??? M???c ?????nh?";
        resetdesc = `C???NH B??O: Thao t??c n??y s??? x??a t???t c??? c??i ?????t c???a ng?????i d??ng!`;
        resetbtns = ["C??i L???i","G??? C??i ?????t","H???y B???"];
    
        traylabel = "Kh??ng C?? Tr?? Ch??i";
        trayshow = "M???";
        trayexit = "L???i Ra";

        //!!!1.8 Translations;
        achievementunlocked = "Th??nh t??ch!";
        rareachievementunlocked = "Th??nh T???u Hi???m C??!";
        testdesc = "Th??ng b??o c???a b???n ??ang ho???t ?????ng ch??nh x??c";

        addsound = "Th??m ??m Thanh ???? Ch???n";
        invalid = 'Lo???i T???p Kh??ng H???p L???';
        addimage = 'Th??m H??nh ???nh ???? Ch???n';
        file = "T???P TIN";
        nofolder = "M???c ?????nh (Kh??ng C?? Th?? M???c N??o ???????c Ch???n)";
        novalidaudio = "Kh??ng c?? t???p ??m thanh h???p l??? n??o n???m trong ";
        soundmode = "CH??? ????? ??M THANH: ";
        randomised = "NG???U NHI??N";
        presskey = "...";
        custompos = "?????t V??? Tr?? M??n H??nh T??y Ch???nh";
        settingpos = "?????t V??? Tr?? Ch??nh...";
        settingposrare = "?????t V??? Tr?? Hi???m...";

        document.getElementById("steamkeybindlbl").innerHTML = "???nh Ch???p M??n H??nh Steam:";
        document.getElementById("langlbl").innerHTML = "Ng??n Ng???:";
        document.getElementById("raritylbl").innerHTML = "Gi?? Tr??? Qu?? Hi???m: ";
        document.getElementById("nosteamlbl").innerHTML = "???n Th??ng B??o Th??nh T??ch Steam";
        document.getElementById("customiselbl").innerHTML = "T??Y CH???NH ...";
        document.getElementById("customisermaintab").innerHTML = '<img src="./icon/emoji_events_gold.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Ch??? Y???u';
        document.getElementById("customiserraretab").innerHTML = '<img src="./icon/emoji_events_purple.png" width="12px" style="margin-right: 3px; padding-bottom: 1px">Hi???m';
        document.getElementById("customiserstylelbl").innerHTML = "PHONG C??CH TH??NG B??O:";
        document.getElementById("notifypositionlbl").innerHTML = "V??? TR?? M??N H??NH:";
        document.getElementById("bgtypelbl").innerHTML = "LO???I N???N:";
        document.getElementById("colourslbl").innerHTML = "M??U S???C";
        document.getElementById("colour1lbl").innerHTML = "M??u 1";
        document.getElementById("colour2lbl").innerHTML = "M??u 2";
        document.getElementById("textcolourlbl").innerHTML = "M??u V??n B???n";
        document.getElementById("imgselectlbl").innerHTML = "H??NH N???N:"
        document.getElementById("roundnesslbl").innerHTML = "V??NG TR??N:";
        document.getElementById("iconroundnesslbl").innerHTML = "V??NG BI???U T?????NG:";
        document.getElementById("displaytimelbl").innerHTML = "HI???N TH??? TH???I GIAN:";
        document.getElementById("scalelbl").innerHTML = "T??? L???:";
        document.getElementById("styledefault").innerHTML = "V??? n???";
        document.getElementById("typesolid").innerHTML = "M??u ?????ng Nh???t";
        document.getElementById("typegradient").innerHTML = "Gradient M??u";
        document.getElementById("typeimg").innerHTML = "H??nh N???n";
        document.getElementById("dragposlbl").innerHTML = "S??? D???ng V??? Tr?? T??y Ch???nh";
        document.getElementById("iconselectlbl").innerHTML = "BI???U T?????NG T??Y CH???NH:";
        document.getElementById("fontsizelbl").innerHTML = "C??? CH???:";
        document.getElementById("dragposbtn").innerHTML = custompos;
        document.getElementById("recenterbtn").innerHTML = "?????t L???i V??? Tr??";

        document.getElementById("customiserstylelblrare").innerHTML = "PHONG C??CH TH??NG B??O:";
        document.getElementById("notifypositionlblrare").innerHTML = "V??? TR?? M??N H??NH:";
        document.getElementById("bgtypelblrare").innerHTML = "LO???I N???N:";
        document.getElementById("rarecolourslbl").innerHTML = "M??U S???C";
        document.getElementById("colour1lblrare").innerHTML = "M??u 1";
        document.getElementById("colour2lblrare").innerHTML = "M??u 2";
        document.getElementById("textcolourlblrare").innerHTML = "M??u V??n B???n";
        document.getElementById("rareimgselectlbl").innerHTML = "H??NH N???N:"
        document.getElementById("roundnesslblrare").innerHTML = "V??NG TR??N:";
        document.getElementById("iconroundnesslblrare").innerHTML = "V??NG BI???U T?????NG:";
        document.getElementById("displaytimelblrare").innerHTML = "HI???N TH??? TH???I GIAN:";
        document.getElementById("scalelblrare").innerHTML = "T??? L???:";
        document.getElementById("styledefaultrare").innerHTML = "V??? n???";
        document.getElementById("typesolidrare").innerHTML = "M??u ?????ng Nh???t";
        document.getElementById("typegradientrare").innerHTML = "Gradient M??u";
        document.getElementById("typeimgrare").innerHTML = "H??nh N???n";
        document.getElementById("dragposlblrare").innerHTML = "S??? D???ng V??? Tr?? T??y Ch???nh";
        document.getElementById("rareiconselectlbl").innerHTML = "BI???U T?????NG T??Y CH???NH:";
        document.getElementById("fontsizelblrare").innerHTML = "C??? CH???:";
        document.getElementById("dragposbtnrare").innerHTML = custompos;
        document.getElementById("recenterbtnrare").innerHTML = "?????t L???i V??? Tr??";

        document.getElementById("trackopacitylbl").innerHTML = "Theo D??i Minh B???ch:";
        document.getElementById("resetlbl").innerHTML = "?????t L???i ???ng D???ng";
        document.getElementById("details").innerHTML = '<a id="gamedetails" href="steam://openurl/https://steamcommunity.com/id/' + username + '/edit/settings">Chi ti???t tr?? ch??i</a> ph???i l?? "C??ng khai".';
        document.getElementById("allpercentlbl").innerHTML = "Hi???n Th??? T???t C??? C??c Ph???n Tr??m";
        document.getElementById("iconanimationlbl").innerHTML = "Hi???n Th??? Ho???t ???nh Bi???u T?????ng Hi???m";
        document.getElementById("hwalbl").innerHTML = "T???t T??ng T???c Ph???n C???ng";
        document.getElementById("nvdalbl").innerHTML = "B???t H??? Tr??? NVDA";
        document.getElementById("gamecompletionlbl").innerHTML = "Hi???n Th??? Th??ng B??o Ho??n Th??nh Tr?? Ch??i";
        document.getElementById("ssoverlaylbl").innerHTML = "L??u ???nh Ch???p M??n H??nh B???ng L???p Ph???";
        document.getElementById("ssoverlaypathlbl").innerHTML = "???????ng D???n:";
        document.getElementById("opacitylbl").innerHTML = "????? M??? TH??NG B??O:";

        secret = "Th??nh T???u B?? M???t!";
        gamecomplete = "Ho??n Th??nh Tr?? Ch??i!";
        allunlocked = "B???n ???? m??? kh??a t???t c??? c??c th??nh t??ch!";
    }
    GetPlayerName();

    var apikey = config.apikey;
    var steam64id = config.steam64id;
    
    if (!apikey || !steam64id) {
        document.getElementById("gamestatus").innerHTML = nogame;
        document.getElementById("gamestatus").style.color = "red";
        ipcRenderer.send('changelang', traylabel, trayshow, trayexit);
    } else {
        if (appid == 0 || appid == undefined) {
            document.getElementById("gamestatus").innerHTML = nogame;
            document.getElementById("gamestatus").style.color = "red";
            ipcRenderer.send('changelang', traylabel, trayshow, trayexit);
        } else {
            document.getElementById("gamestatus").innerHTML = gamename;
            document.getElementById("gamestatus").style.color = "white";
            ipcRenderer.send('track', gamename, trayshow, trayexit);
        }
    }
}

LoadLang();

function SetLang() {
    config["lang"] = document.getElementById("lang").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));

    LoadLang();
    LoadSound();
    LoadRareSound();
}

function ResetHover() {
    document.getElementById("reseticon").style.transform = "rotate(360deg)";
}

function ResetOut() {
    document.getElementById("reseticon").style.transform = "rotate(0deg)";
}

function ResetAppConfirm() {
    var options = {
        title: "Steam Achievement Notifier",
        icon: (path.join(__dirname, "img","sanlogo.ico")),
        message: resettitle,
        detail: resetdesc,
        buttons: resetbtns,
        noLink: true,
        defaultId: 2,
        cancelId: 2
    }

    ipcRenderer.send('reset', options);
}

function RemoveApp() {
    var tempdir;

    if (process.platform == "win32") {
        tempdir = path.join(localappdata,"Temp");
    } else {
        tempdir = path.join(localappdata);
    }

    console.log("%cStep 1: BACKUP...", "color: deepskyblue;");
    fs.writeFileSync(path.join(tempdir,"sanresetlog.txt"), "Step 1: BACKUP...");
    // Create "SAN1.8BACKUP" backup dir in %localappdata%\Temp
    try {
        fs.mkdirSync(path.join(tempdir,"SAN1.8BACKUP"));
        console.log("%c\"SAN1.8BACKUP\" directory created.", "color: seagreen;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\n\"SAN1.8BACKUP\" directory created.");
    } catch {
        console.log("%c\"SAN1.8BACKUP\" directory already exists", "color: red;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\n\"SAN1.8BACKUP\" directory already exists");
    }
    // Backup config file
    try {
        fs.copyFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), path.join(tempdir,"SAN1.8BACKUP","config.json"));
        console.log("%cSteam Achievement Notifier config backed up", "color: seagreen;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nSteam Achievement Notifier config backed up");
    } catch {
        console.log("%cError backing up Steam Achievement Notifier config", "color: red;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nError backing up Steam Achievement Notifier config");
    }
    // Backup logo file
    try {
        fs.copyFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","img","sanlogo.ico"), path.join(tempdir,"SAN1.8BACKUP","sanlogo.ico"));
        console.log("%cSteam Achievement Notifier logo backed up", "color: seagreen;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nSteam Achievement Notifier logo backed up");
    } catch {
        console.log("%cError backing up Steam Achievement Notifier logo", "color: red;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nError backing up Steam Achievement Notifier logo");
    }
    console.log("%cStep 2: DELETING FILES...", "color: deepskyblue;")
    fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nStep 2: DELETING FILES...");
    
    // If "Uninstall" option is selected, delete "Steam Achievement Notifier (V1.8)" dir in %localappdata%
    // Otherwise, just delete "config.json" (to preserve "SteamAchievementNotifier(V1.83).exe" file for restarting in main.js)
    if (resettype == "reset") {
        // Delete "config.json" in %localappdata%\SteamAchievementNotifier(V1.8)\"store"
        try {
            fs.rmSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"));
            console.log("%c\"config.json\" deleted in %localappdata%\\Steam Achievement Notifier (V1.8)\\store.", "color: seagreen;")
            fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\n\"config.json\" deleted in %localappdata%\\Steam Achievement Notifier (V1.8)\\store");
        } catch {
            console.log("%cError deleting \"Steam Achievement Notifier (V1.8)\" directory in %localappdata%", "color: red;")
            fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nError deleting \"store\" directory in %localappdata%\\Steam Achievement Notifier (V1.8)");
        }
    } else if (resettype == "uninstall") {
        // Delete "Steam Achievement Notifier (V1.8)" dir in %localappdata%
        try {
            fs.rmSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)"), { recursive: true });
            console.log("%c\"Steam Achievement Notifier (V1.8)\" directory deleted in %localappdata%.", "color: seagreen;")
            fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\n\"Steam Achievement Notifier (V1.8)\" directory deleted in %localappdata%");
        } catch {
            console.log("%cError deleting \"Steam Achievement Notifier (V1.8)\" directory in %localappdata%", "color: red;")
            fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nError deleting \"Steam Achievement Notifier (V1.8)\" directory in %localappdata%");
        }
    }

    // Remove Desktop shortcut
    try {
        fs.rmSync(path.join(os.homedir(),"Desktop","Steam Achievement Notifier (V" + thisver + ").lnk"));
        console.log("%cDesktop shortcut deleted.", "color: seagreen;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nDesktop shortcut deleted.");
    } catch {
        console.log("%cError deleting Desktop shortcut", "color: red;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nError deleting Desktop shortcut");
    }
    // Remove Startup folder shortcut from "shell:startup"
    try {
        fs.rmSync(path.join(process.env.APPDATA,"Microsoft","Windows","Start Menu","Programs","Startup","Steam Achievement Notifier (V" + thisver + ").lnk"));
        console.log("%cStartup shortcut deleted.", "color: seagreen;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nStartup shortcut deleted.");
    } catch {
        console.log("%cError deleting Startup shortcut", "color: red;")
        fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nError deleting Startup shortcut");
    }
    console.log("%cReset: COMPLETE", "color: deepskyblue;")
    fs.appendFileSync(path.join(tempdir,"sanresetlog.txt"), "\r\nReset: COMPLETE");
}

var resettype;

function ResetApp() {
    resettype = "reset";
    RemoveApp();

    if (process.platform == "win32") {
        launcher["firstlaunch"] = true
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","launcher.json"), JSON.stringify(launcher, null, 2));
    }
    
    ipcRenderer.send('resetcomplete');
}

ipcRenderer.on('resetapp', function() {
    ResetApp();
});

function UninstallApp() {
    resettype = "uninstall";
    RemoveApp();
    ipcRenderer.send('uninstallcomplete');
}

ipcRenderer.on('uninstallapp', function() {
    UninstallApp();
});

document.getElementById("settingscont").style.display = "none";

function ShowSettings() {
    if (document.getElementById("settingscont").style.display == "none") {
        document.getElementById("settingscont").style.display = "block";
        document.getElementById("settingscont").style.animation = "slideright 0.2s forwards";
        document.getElementById("overlay").style.display = "flex";
        document.getElementById("apibox").type = "password";
    } else {
        document.getElementById("settingscont").style.animation = "slideleft 0.2s forwards";
        document.getElementById("overlay").style.display = "none";
        setTimeout(function() {
            document.getElementById("settingscont").style.display = "none";
        }, 200);
    }

    GetAPIKey();
    GetSteam64ID();
    CheckNoSteam();
    CheckShortcut();
    CheckStartWin();
    CheckStartMin();
    CheckSoundOnlyMode();
    CheckNowTracking();
    CheckAllPercent();
    CheckNVDA();
    CheckHWA();

    if (config.ssoverlay == "true" && config.screenshot == "false" && config.rarescreenshot == "false") {
        document.getElementById("sserror").style.display = "block";
    } else {
        document.getElementById("sserror").style.display = "none";
    }
}

function CloseSettings() {
    document.getElementById("settingscont").style.animation = "slideleft 0.2s forwards";
    document.getElementById("overlay").style.display = "none";
    setTimeout(function() {
        document.getElementById("settingscont").style.display = "none";
    }, 200)
}

function CloseWindow() {
    window.close();
}

var queue = [];
var running = false;

function TestNotification() {
    GetNotifyStyle();

    console.log("%cMain Test Notification added to queue.", "color: lightskyblue;");

    var notifyachievement;

    if (config.allpercent == "true") {
        notifyachievement = achievementunlocked + " (50%)";
    } else {
        notifyachievement = achievementunlocked;
    }

    var notifytitle = testtitle;
    var notifydesc = testdesc;
    var notifyicon = "test";

    const queueobj = {
        type: "main",
        width: notifywidth,
        height: notifyheight,
        style: config.notifystyle,
        achievement: notifyachievement,
        title: notifytitle,
        desc: notifydesc,
        icon: notifyicon,
        screenshot: config.screenshot,
        pos: config.notifypos,
        scale: config.scale,
        audio: document.getElementById("audio").src
    }

    queue.push(queueobj);

    function CheckIfRunning() {
        if (running == true) {
            setTimeout(CheckIfRunning, 1000);
            return;
        } else {
            running = true;
            queue.shift(queueobj);
            NotifyWinPos();
            notifystyle = config.notifystyle;
            ipcRenderer.send('notifywin', queueobj);
            LoadSound();

            if (config.nvda == "true") {
                clipboard.writeText(notifyachievement + " " + notifytitle + " " + notifydesc);
            }

            ipcRenderer.once('notrunning', function() {
                running = false;
                if (queue.length == 0) {
                    console.log("Queue is empty.");
                } else {
                    console.log("Queue Position: " + queue.length);
                }
            });
        }
    }

    CheckIfRunning();
}

function TestRareNotification() {
    GetNotifyStyleRare();

    console.log("%cRare Test Notification added to queue.", "color: darkorchid;");

    var notifyachievement = rareachievementunlocked + " (0.0%)";
    var notifytitle = testtitle;
    var notifydesc = testdesc;
    var notifyicon = "test";

    const queueobj = {
        type: "rare",
        width: notifywidth,
        height: notifyheight,
        style: config.rarenotifystyle,
        achievement: notifyachievement,
        title: notifytitle,
        desc: notifydesc,
        icon: notifyicon,
        screenshot: config.rarescreenshot,
        pos: config.rarenotifypos,
        scale: config.rarescale,
        audio: document.getElementById("audiorare").src
    }

    queue.push(queueobj);

    function CheckIfRunning() {
        if (running == true) {
            setTimeout(CheckIfRunning, 1000);
            return;
        } else {
            running = true;
            queue.shift(queueobj);
            NotifyWinPos();
            notifystyle = config.rarenotifystyle;
            ipcRenderer.send('notifywin', queueobj);
            LoadRareSound();

            if (config.nvda == "true") {
                clipboard.writeText(notifyachievement + " " + notifytitle + " " + notifydesc);
            }

            ipcRenderer.once('notrunning', function() {
                running = false;
                if (queue.length == 0) {
                    console.log("%cQueue is empty.", "color: grey;")
                } else {
                    console.log("%cQueue Position: " + queue.length, "color: grey;");
                }
            });
        }
    }

    CheckIfRunning();
}

var defaultsound = "./sound/notify.wav";

function OpenSoundFile() {
    if (config.soundmode == "file") {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = ".wav, .mp3, .flac, .ogg, .m4a, .aiff, .wma";

        input.onchange = function (selection) {
            var file = selection.target.files[0];
            document.getElementById("soundfile").innerHTML = file.path;
            config["sound"] = (file.path).replace("\\","\\\\").replace(":\\\\",":\\");
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            LoadSound();
        }
        
        input.click();
    } else {
        var input = document.createElement("input");
        input.type = "file";
        input.webkitdirectory = "true";

        input.onchange = function(selection) {
            var files = selection.target.files[0];
            var relpath = files.path.split("\\" + files.name);
            config["sounddir"] = relpath[0].replace("\\","\\\\").replace(":\\\\",":\\");
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            LoadSound();
        }

        input.click();
    }
}

function OpenRareSoundFile() {
    if (config.raresoundmode == "file") {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = ".wav, .mp3, .flac, .ogg, .m4a, .aiff, .wma";

        input.onchange = function (selection) {
            var file = selection.target.files[0];
            document.getElementById("soundfilerare").innerHTML = file.path;
            config["raresound"] = (file.path).replace("\\","\\\\").replace(":\\\\",":\\");
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            LoadRareSound();
        }
        
        input.click();
    } else {
        var input = document.createElement("input");
        input.type = "file";
        input.webkitdirectory = "true";

        input.onchange = function(selection) {
            var files = selection.target.files[0];
            var relpath = files.path.split("\\" + files.name);
            config["raresounddir"] = relpath[0].replace("\\","\\\\").replace(":\\\\",":\\");
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            LoadRareSound();
        }

        input.click();
    }
}

document.getElementById("soundfile").ondragover = function(event) {
    event.preventDefault();

    document.getElementById("soundfile").style.background = "#327a48";
    document.getElementById("soundfile").innerHTML = addsound + " <img src='./icon/add_circle_green.svg' width='16px' style='vertical-align: -3px'>";
}

document.getElementById("soundfile").ondragleave = function(event) {
    event.preventDefault();
    document.getElementById("soundfile").style.background = "#3d3d3d";
    LoadSound();
}

document.getElementById("soundfile").ondragend = function(event) {
    event.preventDefault();
    document.getElementById("soundfile").style.background = "#3d3d3d";
    LoadSound();
}

function DropSound(event) {
    event.preventDefault();

    if (config.soundmode == "file") {
        for (var file of event.dataTransfer.files) {
            if (file.type == "audio/wav" || file.type == "audio/mpeg") {
                document.getElementById("soundfile").innerHTML = file.path;
                config["sound"] = (file.path).replace("\\","\\\\").replace(":\\\\",":\\");
                fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
                document.getElementById("soundfile").style.background = "#3d3d3d";
                LoadSound();
            } else {
                document.getElementById("soundfile").style.background = "#7a3232";
                document.getElementById("soundfile").innerHTML = "Invalid File Type <img src='./icon/cancel_red.svg' width='16px' style='vertical-align: -3px'>"
                setTimeout(function() {
                    document.getElementById("soundfile").style.background = "#3d3d3d";
                    LoadSound();
                }, 1000);
            }
        }
    } else {
        var folder = event.dataTransfer.files[0].path;
        config["sounddir"] = folder.replace("\\","\\\\").replace(":\\\\",":\\");
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        document.getElementById("soundfile").style.background = "#3d3d3d";
        LoadSound();
    }
}

document.getElementById("soundfilerare").ondragover = function(event) {
    event.preventDefault();

    document.getElementById("soundfilerare").style.background = "#327a48";
    document.getElementById("soundfilerare").innerHTML = addsound + " <img src='./icon/add_circle_green.svg' width='16px' style='vertical-align: -3px'>";
}

document.getElementById("soundfilerare").ondragleave = function(event) {
    event.preventDefault();
    document.getElementById("soundfilerare").style.background = "#3d3d3d";
    LoadRareSound();
}

document.getElementById("soundfilerare").ondragend = function(event) {
    event.preventDefault();
    document.getElementById("soundfilerare").style.background = "#3d3d3d";
    LoadRareSound();
}

function DropRareSound(event) {
    event.preventDefault();

    for (var file of event.dataTransfer.files) {
        if (file.type == "audio/wav" || file.type == "audio/mpeg") {
            document.getElementById("soundfilerare").innerHTML = file.path;
            config["raresound"] = (file.path).replace("\\","\\\\").replace(":\\\\",":\\");
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            document.getElementById("soundfilerare").style.background = "#3d3d3d";
            LoadRareSound();
        } else {
            document.getElementById("soundfilerare").style.background = "#7a3232";
            document.getElementById("soundfilerare").innerHTML = invalid + " <img src='./icon/cancel_red.svg' width='16px' style='vertical-align: -3px'>"
            setTimeout(function() {
                document.getElementById("soundfilerare").style.background = "#3d3d3d";
                LoadRareSound();
            }, 1000);
        }
    }
}

document.getElementById("imgselectcont").ondragover = function(event) {
    event.preventDefault();
    document.getElementById("imgselectcont").style.background = "rgba(50,205,50,0.2)";
    document.getElementById("imgselectinnerlbl").innerHTML = '<img src="./icon/add_circle_green.svg" width="16px" style="vertical-align: -3px">' + addimage;
}

document.getElementById("imgselectcont").ondragleave = function(event) {
    event.preventDefault();
    document.getElementById("imgselectcont").style.background = "#1b1b1b";
    document.getElementById("imgselectinnerlbl").innerHTML = '<img src="" id="imgselecticon" width="169px" height="96px">';
    GetBGType();
}

document.getElementById("imgselectcont").ondragend = function(event) {
    event.preventDefault();
    document.getElementById("imgselectcont").style.background = "#1b1b1b";
    document.getElementById("imgselectinnerlbl").innerHTML = '<img src="" id="imgselecticon" width="169px" height="96px">';
    GetBGType();
}

function DropImage(event) {
    event.preventDefault();

    for (var file of event.dataTransfer.files) {
        if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") {
            config["img"] = (file.path).replace(/\\/g,"/");
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            document.getElementById("imgselectcont").style.background = "#1b1b1b";
            document.getElementById("imgselectinnerlbl").innerHTML = '<img src="" id="imgselecticon" width="169px" height="96px">';
            GetBGType();
        } else {
            document.getElementById("imgselectcont").style.background = "rgba(255,0,0,0.2)";
            document.getElementById("imgselectinnerlbl").innerHTML = '<img src="./icon/cancel_red.svg" width="16px" style="vertical-align: -3px">Invalid File Type'
            setTimeout(function() {
                document.getElementById("imgselectcont").style.background = "#1b1b1b";
                document.getElementById("imgselectinnerlbl").innerHTML = '<img src="" id="imgselecticon" width="169px" height="96px">';
                GetBGType();
            }, 1000);
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        document.getElementById("webview").reload();
    }
}

document.getElementById("rareimgselectcont").ondragover = function(event) {
    event.preventDefault();
    document.getElementById("rareimgselectcont").style.background = "rgba(50,205,50,0.2)";
    document.getElementById("rareimgselectinnerlbl").innerHTML = '<img src="./icon/add_circle_green.svg" width="16px" style="vertical-align: -3px">Add Selected Image'
}

document.getElementById("rareimgselectcont").ondragleave = function(event) {
    event.preventDefault();
    document.getElementById("rareimgselectcont").style.background = "#1b1b1b";
    document.getElementById("rareimgselectinnerlbl").innerHTML = '<img src="" id="rareimgselecticon" width="169px" height="96px">';
    GetRareBGType();
}

document.getElementById("rareimgselectcont").ondragend = function(event) {
    event.preventDefault();
    document.getElementById("rareimgselectcont").style.background = "#1b1b1b";
    document.getElementById("rareimgselectinnerlbl").innerHTML = '<img src="" id="rareimgselecticon" width="169px" height="96px">';
    GetRareBGType();
}

function DropRareImage(event) {
    event.preventDefault();

    for (var file of event.dataTransfer.files) {
        if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") {
            config["rareimg"] = (file.path).replace(/\\/g,"/");
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            document.getElementById("rareimgselectcont").style.background = "#1b1b1b";
            document.getElementById("rareimgselectinnerlbl").innerHTML = '<img src="" id="rareimgselecticon" width="169px" height="96px">';
            GetRareBGType();
        } else {
            document.getElementById("rareimgselectcont").style.background = "rgba(255,0,0,0.2)";
            document.getElementById("rareimgselectinnerlbl").innerHTML = '<img src="./icon/cancel_red.svg" width="16px" style="vertical-align: -3px">' + invalid;
            setTimeout(function() {
                document.getElementById("rareimgselectcont").style.background = "#1b1b1b";
                document.getElementById("rareimgselectinnerlbl").innerHTML = '<img src="" id="rareimgselecticon" width="169px" height="96px">';
                GetRareBGType();
            }, 1000);
        }
        paused = false;
        document.getElementById("pauserare").src = "./icon/pause_white.svg";
        document.getElementById("webviewrare").reload();
    }
}

function ShowMouseWheelL() {
    document.getElementById("mousecontL").style.display = "flex";
    document.getElementById("mousecontL").style.animation = "fadein 1s forwards";
    document.getElementById("arrowupL").style.animation = "moveup 1s alternate infinite";
    document.getElementById("arrowdownL").style.animation = "movedown 1s alternate infinite";
    document.getElementById("mousewheelL").style.animation = "fadein 0.25s alternate infinite";
}

function HideMouseWheelL() {
    document.getElementById("mousecontL").style.display = "none";
}

function ShowMouseWheelR() {
    document.getElementById("mousecontR").style.display = "flex";
    document.getElementById("mousecontR").style.animation = "fadein 1s forwards";
    document.getElementById("arrowupR").style.animation = "moveup 1s alternate infinite";
    document.getElementById("arrowdownR").style.animation = "movedown 1s alternate infinite";
    document.getElementById("mousewheelR").style.animation = "fadein 0.25s alternate infinite";
}

function HideMouseWheelR() {
    document.getElementById("mousecontR").style.display = "none";
}

function ShowMouseWheelRareL() {
    document.getElementById("mousecontrareL").style.display = "flex";
    document.getElementById("mousecontrareL").style.animation = "fadein 1s forwards";
    document.getElementById("arrowuprareL").style.animation = "moveup 1s alternate infinite";
    document.getElementById("arrowdownrareL").style.animation = "movedown 1s alternate infinite";
    document.getElementById("mousewheelrareL").style.animation = "fadein 0.25s alternate infinite";
}

function HideMouseWheelRareL() {
    document.getElementById("mousecontrareL").style.display = "none";
}

function ShowMouseWheelRareR() {
    document.getElementById("mousecontrareR").style.display = "flex";
    document.getElementById("mousecontrareR").style.animation = "fadein 1s forwards";
    document.getElementById("arrowuprareR").style.animation = "moveup 1s alternate infinite";
    document.getElementById("arrowdownrareR").style.animation = "movedown 1s alternate infinite";
    document.getElementById("mousewheelrareR").style.animation = "fadein 0.25s alternate infinite";
}

function HideMouseWheelRareR() {
    document.getElementById("mousecontrareR").style.display = "none";
}

if (config.soundmode == "file") {
    document.getElementById("searchhover").style.transform = "translateY(0px)";
    document.getElementById("searchhoverdir").style.transform = "translateY(50px)";
} else {
    document.getElementById("searchhover").style.transform = "translateY(-50px)";
    document.getElementById("searchhoverdir").style.transform = "translateY(0px)";
}

var counter = 0;

function CheckSoundSource() {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    var sounddir = fs.readdirSync(config.sounddir);
    const random = getRandomInt(sounddir.length);

    if (sounddir[random].includes(".wav") || sounddir[random].includes(".mp3") || sounddir[random].includes(".flac") || sounddir[random].includes(".ogg") || sounddir[random].includes(".m4a") || sounddir[random].includes(".aiff") || sounddir[random].includes(".wma")) {
        // !!! Fix this to use "path.join" instead of concat
        document.getElementById("audio").src = config.sounddir + "\\" + sounddir[random];
    } else {
        counter++;
        if (counter >= 50) {
            alert(novalidaudio + "\"" + sounddir + "\".");
            config["sounddir"] = "";
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            document.getElementById("soundfile").innerHTML = nofolder;
            document.getElementById("audio").src = defaultsound;
        } else {
            CheckSoundSource();
            setTimeout(function() {
                counter = 0;
            }, 2000);
        }
    }
}

function ChangeSoundMode(event) {
    if (config.soundmode == "file") {
        config["soundmode"] = "folder";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        
        if (event.deltaY < 0) {
            if (document.getElementById("searchhoverdir").style.transform == "translateY(-50px)") {
                document.getElementById("searchhoverdir").style.transition = "0s";
                document.getElementById("searchhoverdir").style.transform = "translateY(50px)";
                document.getElementById("searchhover").style.transform = "translateY(-50px)";
                setTimeout(function() {
                    document.getElementById("searchhoverdir").style.transition = "0.2s";
                    document.getElementById("searchhoverdir").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhover").style.transform = "translateY(-50px)";
                document.getElementById("searchhoverdir").style.transform = "translateY(0px)";
            }
        } else if (event.deltaY > 0) {
            if (document.getElementById("searchhoverdir").style.transform == "translateY(50px)") {
                document.getElementById("searchhoverdir").style.transition = "0s";
                document.getElementById("searchhoverdir").style.transform = "translateY(-50px)";
                document.getElementById("searchhover").style.transform = "translateY(50px)";
                setTimeout(function() {
                    document.getElementById("searchhoverdir").style.transition = "0.2s";
                    document.getElementById("searchhoverdir").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhover").style.transform = "translateY(50px)";
                document.getElementById("searchhoverdir").style.transform = "translateY(0px)";
            }
        }

        if (config.sounddir == "") {
            document.getElementById("soundfile").innerHTML = nofolder;
        } else {
            document.getElementById("soundfile").innerHTML = config.sounddir;
        }
    } else {
        config["soundmode"] = "file";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        
        if (event.deltaY < 0) {
            if (document.getElementById("searchhover").style.transform == "translateY(-50px)") {
                document.getElementById("searchhover").style.transition = "0s";
                document.getElementById("searchhover").style.transform = "translateY(50px)";
                document.getElementById("searchhoverdir").style.transform = "translateY(-50px)";
                setTimeout(function() {
                    document.getElementById("searchhover").style.transition = "0.2s";
                    document.getElementById("searchhover").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhoverdir").style.transform = "translateY(-50px)";
                document.getElementById("searchhover").style.transform = "translateY(0px)";
            }
        } else if (event.deltaY > 0) {
            if (document.getElementById("searchhover").style.transform == "translateY(50px)") {
                document.getElementById("searchhover").style.transition = "0s";
                document.getElementById("searchhover").style.transform = "translateY(-50px)";
                document.getElementById("searchhoverdir").style.transform = "translateY(50px)";
                setTimeout(function() {
                    document.getElementById("searchhover").style.transition = "0.2s";
                    document.getElementById("searchhover").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhoverdir").style.transform = "translateY(50px)";
                document.getElementById("searchhover").style.transform = "translateY(0px)";
            }
        }

        if (config.sound == "") {
            document.getElementById("soundfile").innerHTML = nosound;
        } else {
            document.getElementById("soundfile").innerHTML = config.sound;
        }
    }
    LoadSound();
    SearchHover();
}

function SearchHover() {
    if (config.soundmode == "file") {
        document.getElementById("searchhover").src = "./icon/file_black.svg";
        document.getElementById("soundmodediv").innerHTML = "<img src='./icon/audiofile.svg' width='16px' style='margin: 0px 3px 3px 0px'>" + soundmode + " <span style='color: lightskyblue; margin-left: 3px'>" + file + "</span>";
        if (config.sound == "") {
            document.getElementById("soundfile").innerHTML = nosound;
        } else {
            document.getElementById("soundfile").innerHTML = config.sound;
        }
    } else {
        document.getElementById("searchhoverdir").src = "./icon/dice_black.svg";
        document.getElementById("soundmodediv").innerHTML = "<img src='./icon/dice.svg' width='16px' style='margin-right: 5px'>" + soundmode + "<span style='-webkit-background-clip: text; color: transparent; background-image: linear-gradient(90deg, #e8f74d, #ff6600d9, #00ff66, #13ff13, #ad27ad, #bd2681, #6512b9, #ff3300de, #5aabde); background-size: 400%; animation: glow 5s linear infinite; margin-left: 3px'>" + randomised + "</span>";
        if (config.sounddir == "") {
            document.getElementById("soundfile").innerHTML = nofolder;
        } else {
            document.getElementById("soundfile").innerHTML = config.sounddir;
        }
    }
    document.getElementById("soundfile").style.borderTop = "none";
    document.getElementById("soundfile").style.background = "#101010";
}

function SearchOut() {
    if (config.soundmode == "file") {
        document.getElementById("searchhover").src = "./icon/file_white.svg";
    } else {
        document.getElementById("searchhoverdir").src = "./icon/dice.svg";
    }
    document.getElementById("soundfile").style.borderTop = "1px solid white";
    document.getElementById("soundfile").style.background = "linear-gradient(45deg, #2d2d2d 0%, #3d3d3d 50%, #2d2d2d 100%)";
}

function LoadSound() {
    if (config.soundmode == "file") {
        if (config.sound == "") {
            document.getElementById("soundfile").innerHTML = nosound;
            document.getElementById("audio").src = defaultsound;
        } else {
            document.getElementById("soundfile").innerHTML = config.sound;
            document.getElementById("audio").src = config.sound;
        }
    } else {
        if (config.sounddir == "") {
            document.getElementById("soundfile").innerHTML = nofolder;
            document.getElementById("audio").src = defaultsound;
        } else {
            document.getElementById("soundfile").innerHTML = config.sounddir;
            CheckSoundSource();
        }
    }
}

LoadSound();

function PreviewHover() {
    document.getElementById("previewhover").src = "./icon/volume_up_black.svg";
}

function PreviewOut() {
    document.getElementById("previewhover").src = "./icon/volume_up_white.svg";
}

function PreviewSound() {
    var audio = document.getElementById("audio");
    document.getElementById("preview").style.display = "none";
    document.getElementById("stop").style.display = "flex";
    LoadSound();
    audio.play();
    audio.addEventListener('ended', function () {
        document.getElementById("preview").style.display = "flex";
        document.getElementById("stop").style.display = "none";
    });
}

function StopSound() {
    var audio = document.getElementById("audio");
    document.getElementById("preview").style.display = "flex";
    document.getElementById("stop").style.display = "none";
    LoadSound();
    audio.pause();
    audio.currentTime = 0;
}

if (config.raresoundmode == "file") {
    document.getElementById("soundmodedivrare").innerHTML = "<img src='./icon/audiofile.svg'>" + soundmode + "<span style='color: lightskyblue'>" + file + "</span>";
    document.getElementById("searchhoverrare").style.transform = "translateY(0px)";
    document.getElementById("searchhoverdirrare").style.transform = "translateY(50px)";
} else {
    document.getElementById("soundmodedivrare").innerHTML = "<img src='./icon/dice.svg' width='16px' style='margin-right: 5px'>" + soundmode + "<span style='-webkit-background-clip: text; color: transparent; background-image: linear-gradient(90deg, #e8f74d, #ff6600d9, #00ff66, #13ff13, #ad27ad, #bd2681, #6512b9, #ff3300de, #5aabde); background-size: 400%; animation: glow 5s linear infinite; margin-left: 3px'>" + randomised + "</span>";
    document.getElementById("searchhoverrare").style.transform = "translateY(-50px)";
    document.getElementById("searchhoverdirrare").style.transform = "translateY(0px)";
}

function CheckRareSoundSource() {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    var raresounddir = fs.readdirSync(config.raresounddir);
    const random = getRandomInt(raresounddir.length);

    if (raresounddir[random].includes(".wav") || raresounddir[random].includes(".mp3") || raresounddir[random].includes(".flac") || raresounddir[random].includes(".ogg") || raresounddir[random].includes(".m4a") || raresounddir[random].includes(".aiff") || raresounddir[random].includes(".wma")) {
        // !!! Fix this to use "path.join" instead of concat
        document.getElementById("audiorare").src = config.raresounddir + "\\" + raresounddir[random];
    } else {
        counter++;
        if (counter >= 50) {
            alert(novalidaudio + "\"" + raresounddir + "\".");
            config["raresounddir"] = "";
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            document.getElementById("soundfilerare").innerHTML = nofolder;
            document.getElementById("audiorare").src = defaultsound;
        } else {
            CheckRareSoundSource();
            setTimeout(function() {
                counter = 0;
            }, 2000);
        }
    }
}

function ChangeRareSoundMode(event) {
    if (config.raresoundmode == "file") {
        config["raresoundmode"] = "folder";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        
        if (event.deltaY < 0) {
            if (document.getElementById("searchhoverdirrare").style.transform == "translateY(-50px)") {
                document.getElementById("searchhoverdirrare").style.transition = "0s";
                document.getElementById("searchhoverdirrare").style.transform = "translateY(50px)";
                document.getElementById("searchhoverrare").style.transform = "translateY(-50px)";
                setTimeout(function() {
                    document.getElementById("searchhoverdirrare").style.transition = "0.2s";
                    document.getElementById("searchhoverdirrare").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhoverrare").style.transform = "translateY(-50px)";
                document.getElementById("searchhoverdirrare").style.transform = "translateY(0px)";
            }
        } else if (event.deltaY > 0) {
            if (document.getElementById("searchhoverdirrare").style.transform == "translateY(50px)") {
                document.getElementById("searchhoverdirrare").style.transition = "0s";
                document.getElementById("searchhoverdirrare").style.transform = "translateY(-50px)";
                document.getElementById("searchhoverrare").style.transform = "translateY(50px)";
                setTimeout(function() {
                    document.getElementById("searchhoverdirrare").style.transition = "0.2s";
                    document.getElementById("searchhoverdirrare").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhoverrare").style.transform = "translateY(50px)";
                document.getElementById("searchhoverdirrare").style.transform = "translateY(0px)";
            }
        }

        if (config.raresounddir == "") {
            document.getElementById("soundfilerare").innerHTML = nofolder;
        } else {
            document.getElementById("soundfilerare").innerHTML = config.raresounddir;
        }
    } else {
        config["raresoundmode"] = "file";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        
        if (event.deltaY < 0) {
            if (document.getElementById("searchhoverrare").style.transform == "translateY(-50px)") {
                document.getElementById("searchhoverrare").style.transition = "0s";
                document.getElementById("searchhoverrare").style.transform = "translateY(50px)";
                document.getElementById("searchhoverdirrare").style.transform = "translateY(-50px)";
                setTimeout(function() {
                    document.getElementById("searchhoverrare").style.transition = "0.2s";
                    document.getElementById("searchhoverrare").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhoverdirrare").style.transform = "translateY(-50px)";
                document.getElementById("searchhoverrare").style.transform = "translateY(0px)";
            }
        } else if (event.deltaY > 0) {
            if (document.getElementById("searchhoverrare").style.transform == "translateY(50px)") {
                document.getElementById("searchhoverrare").style.transition = "0s";
                document.getElementById("searchhoverrare").style.transform = "translateY(-50px)";
                document.getElementById("searchhoverdirrare").style.transform = "translateY(50px)";
                setTimeout(function() {
                    document.getElementById("searchhoverrare").style.transition = "0.2s";
                    document.getElementById("searchhoverrare").style.transform = "translateY(0px)";
                }, 10);
            } else {
                document.getElementById("searchhoverdirrare").style.transform = "translateY(50px)";
                document.getElementById("searchhoverrare").style.transform = "translateY(0px)";
            }
        }

        if (config.raresound == "") {
            document.getElementById("soundfilerare").innerHTML = nosound;
        } else {
            document.getElementById("soundfilerare").innerHTML = config.raresound;
        }
    }
    LoadRareSound();
    SearchRareHover();
}

function SearchRareHover() {
    if (config.raresoundmode == "file") {
        document.getElementById("searchhoverrare").src = "./icon/file_black.svg";
        document.getElementById("soundmodedivrare").innerHTML = "<img src='./icon/audiofile.svg' width='16px' style='margin: 0px 3px 3px 0px'>" + soundmode + "<span style='color: lightskyblue; margin-left: 3px'>" + file + "</span>";
        if (config.raresound == "") {
            document.getElementById("soundfilerare").innerHTML = nosound;
        } else {
            document.getElementById("soundfilerare").innerHTML = config.raresound;
        }
    } else {
        document.getElementById("searchhoverdirrare").src = "./icon/dice_black.svg";
        document.getElementById("soundmodedivrare").innerHTML = "<img src='./icon/dice.svg' width='16px' style='margin-right: 5px'>" + soundmode + "<span style='-webkit-background-clip: text; color: transparent; background-image: linear-gradient(90deg, #e8f74d, #ff6600d9, #00ff66, #13ff13, #ad27ad, #bd2681, #6512b9, #ff3300de, #5aabde); background-size: 400%; animation: glow 5s linear infinite; margin-left: 3px'>" + randomised + "</span>";
        if (config.raresounddir == "") {
            document.getElementById("soundfilerare").innerHTML = nofolder;
        } else {
            document.getElementById("soundfilerare").innerHTML = config.raresounddir;
        }
    }
    document.getElementById("soundfilerare").style.borderTop = "none";
    document.getElementById("soundfilerare").style.background = "#101010";
}

function SearchRareOut() {
    if (config.raresoundmode == "file") {
        document.getElementById("searchhoverrare").src = "./icon/file_white.svg";
    } else {
        document.getElementById("searchhoverdirrare").src = "./icon/dice.svg";
    }
    document.getElementById("soundfilerare").style.borderTop = "1px solid white";
    document.getElementById("soundfilerare").style.background = "linear-gradient(45deg, #2d2d2d 0%, #3d3d3d 50%, #2d2d2d 100%)";
}

function LoadRareSound() {
    if (config.raresoundmode == "file") {
        if (config.raresound == "") {
            document.getElementById("soundfilerare").innerHTML = nosound;
            document.getElementById("audiorare").src = defaultsound;
        } else {
            document.getElementById("soundfilerare").innerHTML = config.raresound;
            document.getElementById("audiorare").src = config.raresound;
        }
    } else {
        if (config.raresounddir == "") {
            document.getElementById("soundfilerare").innerHTML = nofolder;
            document.getElementById("audiorare").src = defaultsound;
        } else {
            document.getElementById("soundfilerare").innerHTML = config.raresounddir;
            CheckRareSoundSource();
        }
    }
}

LoadRareSound();

function PreviewRareHover() {
    document.getElementById("previewhoverrare").src = "./icon/volume_up_black.svg";
}

function PreviewRareOut() {
    document.getElementById("previewhoverrare").src = "./icon/volume_up_white.svg";
}

function PreviewRareSound() {
    var audiorare = document.getElementById("audiorare");
    document.getElementById("previewrare").style.display = "none";
    document.getElementById("stoprare").style.display = "flex";
    LoadRareSound();
    audiorare.play();
    audiorare.addEventListener('ended', function () {
        document.getElementById("previewrare").style.display = "flex";
        document.getElementById("stoprare").style.display = "none";
    });
}

function StopRareSound() {
    var audiorare = document.getElementById("audiorare");
    document.getElementById("previewrare").style.display = "flex";
    document.getElementById("stoprare").style.display = "none";
    LoadRareSound();
    audiorare.pause();
    audiorare.currentTime = 0;
}

var username;

function GetPlayerName() {
    var apikey = config.apikey;
    var steam64id = config.steam64id;
    var apiurl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apikey}&steamids=${steam64id}`;
    
    if (!apikey || !steam64id) {
        document.getElementById("username").innerHTML = nouser;
        document.getElementById("username").style.color = "red";
        document.getElementById("statusdot").src = "./icon/dot_red.svg";
    } else {
        fetch(apiurl).then(response => response.json()).then((data) => {
            username = data.response.players[0].personaname;
            document.getElementById("username").innerHTML = data.response.players[0].personaname;

            if (process.platform == "win32") {
                launcher["user"] = data.response.players[0].personaname;
                fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","launcher.json"), JSON.stringify(launcher, null, 2));
            }

            document.getElementById("username").style.color = "white";
            document.getElementById("statusdot").src = "./icon/dot_green.svg";
        }).catch(error => {
            document.getElementById("username").innerHTML = nouser;
            document.getElementById("username").style.color = "red";
            document.getElementById("statusdot").src = "./icon/dot_red.svg";

            console.log("%USERNAME ERROR: " + error, "color: red")
        });
    }
}

function CheckNowTracking() {
    if (config.tracking == "true") {
        document.getElementById("trackingbox").checked = true;
    } else {
        document.getElementById("trackingbox").checked = false;
    }
}

function ToggleNowTracking() {
    if (config.tracking == "false") {
        config["tracking"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        document.getElementById("trackopacity").style.opacity = "1";
        document.getElementById("trackopacityslider").style.pointerEvents = "auto";
    } else {
        config["tracking"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        document.getElementById("trackopacity").style.opacity = "0.5";
        document.getElementById("trackopacityslider").style.pointerEvents = "none";
    }
    CheckNowTracking();
}

document.getElementById("trackopacityslider").value = config.trackopacity;
document.getElementById("trackopacityvalue").innerHTML = config.trackopacity;

function SetTrackOpacity() {
    config["trackopacity"] = document.getElementById("trackopacityslider").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
}

function CheckSoundOnlyMode() {
    if (config.soundonly == "true") {
        document.getElementById("soundonlybox").checked = true;
    } else {
        document.getElementById("soundonlybox").checked = false;
    }
}

function ToggleSoundOnlyMode() {
    if (config.soundonly == "false") {
        config["soundonly"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["soundonly"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckSoundOnlyMode();
}

function OpenAPILink() {
    ipcRenderer.send('openapilink');
}

function OpenSteam64Link() {
    ipcRenderer.send('opensteam64link');
}

function CheckConfig() {
    if (config.apikey == "") {
        document.getElementById("apibox").value = null;
    } else {
        document.getElementById("apibox").value = config.apikey;
    }

    if (config.steam64id == "") {
        document.getElementById("steam64box").value = null;
    } else {
        document.getElementById("steam64box").value = config.steam64id;
    }
}

function CheckShortcut() {
    if (fs.existsSync(shortcut)) {
        document.getElementById("desktopbox").checked = true;
    } else {
        document.getElementById("desktopbox").checked = false;
    }
}

/////////////////////////////////////////////////////////////////////////////
// TO DO: Edit for Linux/MacOS - don't use Powershell for these platforms  //
// EDIT: Removed option at script start instead                            //
/////////////////////////////////////////////////////////////////////////////
function CreateDesktopShortcut() {
    CheckShortcut();
    if (fs.existsSync(shortcut)) {
        document.getElementById("desktopbox").checked = true;
    } else {
        spawn("powershell.exe",["-Command",`$shell = New-Object -ComObject WScript.Shell; $shortcut = $shell.CreateShortcut('` + shortcut + `'); $shortcut.IconLocation = '` + path.join(localappdata,"Steam Achievement Notifier (V1.8)","img","sanlogo.ico") + `'; $shortcut.TargetPath = '` + launcher.path + `'; $shortcut.Save(); $sc = "steam achievement notifier (V${thisver})"; $txtinfo = (Get-Culture).TextInfo; $scfix = $txtinfo.ToTitleCase($sc); Rename-Item -Path "` + shortcut + `" -NewName "$scfix.lnk"`]);
        document.getElementById("desktopbox").checked = true;
    }
}

function ShowAPI() {
    if (document.getElementById("apibox").type == "password") {
        document.getElementById("apibox").type = "text";
        document.getElementById("eye").src = "./icon/visibility.svg";
    } else {
        document.getElementById("apibox").type = "password";
        document.getElementById("eye").src = "./icon/visibility_off.svg";
    }
}

function GetAPIKey() {
    if (config.apikey == "") {
        document.getElementById("apibox").value = null;
        document.getElementById("apibox").style.color = "white";
    } else {
        document.getElementById("apibox").value = config.apikey;
        document.getElementById("apibox").style.color = "white";
    }
}

GetAPIKey();

function CheckAPIKey() {
    var apivalue = document.getElementById("apibox").value;
    if (apivalue == "" || apivalue == novalue) {
        document.getElementById("apibox").type = "text";
        document.getElementById("apibox").value = novalue;
        document.getElementById("apibox").style.color = "red";

        document.getElementById("apibox").addEventListener('click', function() {
            if (document.getElementById("apibox").value == novalue) {
                document.getElementById("apibox").value = null;
            }
        });

        document.getElementById("saveapi").addEventListener('click', function(){
            clearTimeout(apitimer);
        });

        var apitimer = setTimeout(function() {
            if (config.apikey == "") {
                document.getElementById("apibox").value = null;
                document.getElementById("apibox").style.color = "white";
                document.getElementById("apibox").type = "password";
            } else {
                document.getElementById("apibox").value = config.apikey;
                document.getElementById("apibox").style.color = "white";
                document.getElementById("apibox").type = "password";
            }
        }, 2000);
    } else {
        SaveAPIKey();
    }
}

function SaveAPIKey() {
    var apivalue = document.getElementById("apibox").value;
    config["apikey"] = apivalue.replace(/\s+/g, "");
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    document.getElementById("apibox").value = apivalue;

    document.getElementById("saveapiimg").style.animation = "shrink 0.1s forwards";
    setTimeout(function() {
        document.getElementById("saveapiimg").style.display = "none";
        document.getElementById("apitick").style.display = "block";
        document.getElementById("apitick").style.animation = "shrinkrev 0.2s forwards";
        setTimeout(function() {
            document.getElementById("apitick").style.animation = "shrink 0.1s forwards";
            setTimeout(function() {
                document.getElementById("apitick").style.display = "none";
                document.getElementById("saveapiimg").style.transform = "scale(0%, 0%)";
                document.getElementById("saveapiimg").style.display = "block";
                document.getElementById("saveapiimg").style.animation = "shrinkrev 0.2s forwards";
            }, 200);
        }, 1000);
    }, 200);
    GetPlayerName();
    GetSteam3ID();
    GetSteamPath();
}

function GetSteam64ID() {
    if (config.steam64id == "") {
        document.getElementById("steam64box").value = null;
        document.getElementById("steam64box").style.color = "white";
    } else {
        document.getElementById("steam64box").value = config.steam64id;
        document.getElementById("steam64box").style.color = "white";
    }
}

GetSteam64ID();

function CheckSteam64ID() {
    var steam64value = document.getElementById("steam64box").value;
    if (steam64value == "" || steam64value == novalue) {
        document.getElementById("steam64box").value = novalue;
        document.getElementById("steam64box").style.color = "red";

        document.getElementById("steam64box").addEventListener('click', function() {
            if (document.getElementById("steam64box").value == novalue) {
                document.getElementById("steam64box").value = null;
                clearTimeout(steam64timer);
            }
        });

        document.getElementById("save64").addEventListener('click', function(){
            clearTimeout(steam64timer);
        });

        var steam64timer = setTimeout(function() {
            if (config.steam64id == "") {
                document.getElementById("steam64box").value = null;
                document.getElementById("steam64box").style.color = "white";
            } else {
                document.getElementById("steam64box").value = config.steam64id;
                document.getElementById("steam64box").style.color = "white";
            }
        }, 2000);
    } else {
        SaveSteam64ID();
    }
}

function SaveSteam64ID() {
    var steam64value = document.getElementById("steam64box").value;
    config["steam64id"] = steam64value.replace(/\s+/g, "");
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    document.getElementById("steam64box").value = steam64value;
    
    document.getElementById("save64img").style.animation = "shrink 0.1s forwards";
    setTimeout(function() {
        document.getElementById("save64img").style.display = "none";
        document.getElementById("steam64tick").style.display = "block";
        document.getElementById("steam64tick").style.animation = "shrinkrev 0.2s forwards";
        setTimeout(function() {
            document.getElementById("steam64tick").style.animation = "shrink 0.1s forwards";
            setTimeout(function() {
                document.getElementById("steam64tick").style.display = "none";
                document.getElementById("save64img").style.transform = "scale(0%, 0%)";
                document.getElementById("save64img").style.display = "block";
                document.getElementById("save64img").style.animation = "shrinkrev 0.2s forwards";
            }, 200);
        }, 1000);
    }, 200);
    GetPlayerName();
    GetSteam3ID();
    GetSteamPath();
}

function ShowRareCheev() {
    var maincheev = document.getElementById("maincheevbtn");
    var rarecheev = document.getElementById("rarecheevbtn");
    var maindiv = document.getElementById("maindiv");
    var rarediv = document.getElementById("rarediv");

    maincheev.addEventListener('mouseover', function() {
        maincheev.style.opacity = 1;
    });
    maincheev.addEventListener('mouseleave', function() {
        maincheev.style.opacity = 0.5;
    });
    rarecheev.addEventListener('mouseover', function() {
        rarecheev.style.opacity = 1;
    });
    rarecheev.addEventListener('mouseleave', function() {
        rarecheev.style.opacity = 1;
    });

    maincheev.style.opacity = 0.5;
    maincheev.style.background = "rgba(32,62,122,1)";
    maincheev.style.color = "white";
    
    rarecheev.style.opacity = 1;
    rarecheev.style.background = "white";
    rarecheev.style.color = "black";

    maindiv.style.display = "none";
    rarediv.style.display = "flex";

    document.getElementById("mainimg").style.display = "none";
    document.getElementById("rareimg").style.display = "block";

    document.getElementById("username").style.background = "rebeccapurple";
    document.getElementById("steamimg").style.background = "rebeccapurple";
    document.getElementById("userempty").style.background = "rebeccapurple";

    document.getElementById("gamestatus").style.background = "rebeccapurple";
    document.getElementById("gameimg").style.background = "rebeccapurple";
    document.getElementById("gameempty").style.background = "rebeccapurple";
    
    tabtype = "rare";
}

function ShowMainCheev() {
    var maincheev = document.getElementById("maincheevbtn");
    var rarecheev = document.getElementById("rarecheevbtn");
    var maindiv = document.getElementById("maindiv");
    var rarediv = document.getElementById("rarediv");
    
    rarecheev.addEventListener('mouseover', function() {
        rarecheev.style.opacity = 1;
    });
    rarecheev.addEventListener('mouseleave', function() {
        rarecheev.style.opacity = 0.5;
    });
    maincheev.addEventListener('mouseover', function() {
        maincheev.style.opacity = 1;
    });
    maincheev.addEventListener('mouseleave', function() {
        maincheev.style.opacity = 1;
    });

    maincheev.style.opacity = 1;
    maincheev.style.background = "white";
    maincheev.style.color = "black";
    
    rarecheev.style.opacity = 0.5;
    rarecheev.style.background = "rgba(32,62,122,1)";
    rarecheev.style.color = "white";

    maindiv.style.display = "flex";
    rarediv.style.display = "none";

    document.getElementById("mainimg").style.display = "block";
    document.getElementById("rareimg").style.display = "none";

    document.getElementById("username").style.background = "rgba(32,62,122,1)";
    document.getElementById("steamimg").style.background = "rgba(32,62,122,1)";
    document.getElementById("userempty").style.background = "rgba(32,62,122,1)";

    document.getElementById("gamestatus").style.background = "rgba(32,62,122,1)";
    document.getElementById("gameimg").style.background = "rgba(32,62,122,1)";
    document.getElementById("gameempty").style.background = "rgba(32,62,122,1)";

    tabtype = "main";
}

function ShowMainTest() {
    document.getElementById("testrare").style.display = "none";
    document.getElementById("test").style.display = "flex";
}

function ShowRareTest() {
    document.getElementById("test").style.display = "none";
    document.getElementById("testrare").style.display = "flex";
}

function CheckScreenshot() {
    if (config.screenshot == "true") {
        document.getElementById("showscreenshotcheckbox").checked = true;
    } else {
        document.getElementById("showscreenshotcheckbox").checked = false;
    }
}

CheckScreenshot();

function CheckRareScreenshot() {
    if (config.rarescreenshot == "true") {
        document.getElementById("showscreenshotcheckboxrare").checked = true;
    } else {
        document.getElementById("showscreenshotcheckboxrare").checked = false;
    }
}

CheckRareScreenshot();

function ToggleScreenshot() {
    if (config.screenshot == "false") {
        config["screenshot"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["screenshot"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckScreenshot();
}

function CheckStartWin() {
    if (config.startwin == "true") {
        document.getElementById("startwinbox").checked = true;
    } else {
        document.getElementById("startwinbox").checked = false;
    }
}

/////////////////////////////////////////////////////////////////////////////////
// TO DO: Edit for Linux/MacOS - potentially remove option on these platforms  //
// EDIT: Removed at script start instead                                       //
/////////////////////////////////////////////////////////////////////////////////
function ToggleStartWin() {
    if (config.startwin == "false") {
        config["startwin"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        spawn("powershell.exe",["-Command",`$shell = New-Object -ComObject WScript.Shell; $shortcut = $shell.CreateShortcut('` + path.join(process.env.APPDATA,"Microsoft","Windows","Start Menu","Programs","Startup","Steam Achievement Notifier (V" + thisver + ").lnk") + `'); $shortcut.IconLocation = '` + path.join(__dirname,"img","sanlogo.ico") + `'; $shortcut.TargetPath = '` + launcher.path + `'; $shortcut.Save();`]);
    } else {
        config["startwin"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        spawn("powershell.exe",["-Command",`Remove-Item -Path '` + path.join(process.env.APPDATA,"Microsoft","Windows","Start Menu","Programs","Startup","Steam Achievement Notifier (V" + thisver + ").lnk") + `'`]);
    }
    CheckStartWin();
}

function CheckStartMin() {
    if (config.startmin == "true") {
        document.getElementById("startminbox").checked = true;
    } else {
        document.getElementById("startminbox").checked = false;
    }
}

function ToggleStartMin() {
    if (config.startmin == "false") {
        config["startmin"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["startmin"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckStartMin();
}

var appid;
var currgame = null;

var gamename;
var desc;

function KoFiIconChange() {
    document.getElementById("kofi").style.opacity = 1;
    document.getElementById("kofi").addEventListener("mouseleave", function() {
        document.getElementById("kofi").style.opacity = 0.5;
    })
}

function OpenKoFi() {
    ipcRenderer.send('kofi');
}

function DiscordIconChange() {
    document.getElementById("discord").style.opacity = 1;
    document.getElementById("discord").addEventListener("mouseleave", function() {
        document.getElementById("discord").style.opacity = 0.5;
    })
}

function OpenDiscord() {
    ipcRenderer.send('discord');
}

function GithubIconChange() {
    document.getElementById("github").style.opacity = 1;
    document.getElementById("github").addEventListener("mouseleave", function() {
        document.getElementById("github").style.opacity = 0.5;
    })
}

function ReportIssue() {
    ipcRenderer.send('report');
}

function LoadNotify() {
    if (config.notifypos == "topleft") {
        pos = "topleft";
        document.getElementById("topleft").style.opacity = "1";
    } else if (config.notifypos == "topcenter") {
        pos = "topcenter";
        document.getElementById("topcenter").style.opacity = "1";
    } else if (config.notifypos == "topright") {
        pos = "topright";
        document.getElementById("topright").style.opacity = "1";
    } else if (config.notifypos == "bottomleft") {
        pos = "bottomleft";
        document.getElementById("bottomleft").style.opacity = "1";
    } else if (config.notifypos == "bottomcenter") {
        pos = "bottomcenter";
        document.getElementById("bottomcenter").style.opacity = "1";
    } else if (config.notifypos == "bottomright") {
        pos = "bottomright";
        document.getElementById("bottomright").style.opacity = "1";
    }
}

function LoadNotifyRare() {
    if (config.rarenotifypos == "topleft") {
        rarepos = "topleft";
        document.getElementById("topleftrare").style.opacity = "1";
    } else if (config.rarenotifypos == "topcenter") {
        rarepos = "topcenter";
        document.getElementById("topcenterrare").style.opacity = "1";
    } else if (config.rarenotifypos == "topright") {
        rarepos = "topright";
        document.getElementById("toprightrare").style.opacity = "1";
    } else if (config.rarenotifypos == "bottomleft") {
        rarepos = "bottomleft";
        document.getElementById("bottomleftrare").style.opacity = "1";
    } else if (config.rarenotifypos == "bottomcenter") {
        rarepos = "bottomcenter";
        document.getElementById("bottomcenterrare").style.opacity = "1";
    } else if (config.rarenotifypos == "bottomright") {
        rarepos = "bottomright";
        document.getElementById("bottomrightrare").style.opacity = "1";
    }
}

LoadNotifyRare();

function ExpandCustomise() {
    document.getElementById("customiselbl").style.display = "flex";
    document.getElementById("customiseicon").src = "./icon/tune_black.svg";
    document.getElementById("customisecont").style.bottom = "64px";
    document.getElementById("customisecont").style.height = "38px";

    document.getElementById("test").style.width = "330px";
    document.getElementById("test").style.transition = "0.2s";
    document.getElementById("testrare").style.width = "330px";
    document.getElementById("testrare").style.transition = "0.2s";
}

function ShrinkCustomise() {
    document.getElementById("customiselbl").style.display = "none";
    document.getElementById("customiseicon").src = "./icon/tune_white.svg";
    document.getElementById("customisecont").style.bottom = "68px";
    document.getElementById("customisecont").style.height = "30px";

    document.getElementById("test").style.width = "490px";
    document.getElementById("test").style.transition = "0.2s";
    document.getElementById("testrare").style.width = "490px";
    document.getElementById("testrare").style.transition = "0.2s";
}

var tabtype = "main";

function ShowCustomise() {
    SetWebViewSrc();
    SetWebViewSrcRare();

    document.getElementById("bodycont").style.display = "none";
    document.getElementById("customisemenu").style.display = "flex";
    document.getElementById("close").onclick = function () { CloseCustomiser() };

    if (tabtype == "main") {
        ToggleMainTab();
    } else {
        ToggleRareTab();
    }

    GetBGType();
    LoadNotify();
}

function CloseCustomiser() {
    document.getElementById("bodycont").style.display = "flex";
    document.getElementById("customisemenu").style.display = "none";
    document.getElementById("webview").remove();
    document.getElementById("webviewrare").remove();
    document.getElementById("close").onclick = function () { CloseWindow() };

    ipcRenderer.send('checkdragwin');
}

function ReplayNotification() {
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    document.getElementById("webview").reload();
}

var paused = false;

function PauseNotification() {
    if (paused == false) {
        paused = true;
        document.getElementById("pause").src = "./icon/play_white.svg";
        document.getElementById("webview").send('pausenotify');
    } else {
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        document.getElementById("webview").send('playnotify');
    }
}

function ReplayRareNotification() {
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    document.getElementById("webviewrare").reload();
}

function PauseRareNotification() {
    if (paused == false) {
        paused = true;
        document.getElementById("pauserare").src = "./icon/play_white.svg";
        document.getElementById("webviewrare").send('pausenotify');
    } else {
        paused = false;
        document.getElementById("pauserare").src = "./icon/pause_white.svg";
        document.getElementById("webviewrare").send('playnotify');
    }
}

function SetWebViewSrc() {
    var webviewelem = document.createElement("webview");

    if (config.notifystyle == "default") {
        webviewelem.src = "./notify/default/preview/defaultpreview.html";
    } else if (config.notifystyle == "xbox") {
        webviewelem.src = "./notify/xbox/preview/xboxpreview.html";
    } else if (config.notifystyle == "playstation") {
        webviewelem.src = "./notify/playstation/preview/playstationpreview.html";
    } else if (config.notifystyle == "ps5") {
        webviewelem.src = "./notify/ps5/preview/ps5preview.html";
    } else if (config.notifystyle == "windows") {
        webviewelem.src = "./notify/windows/preview/windowspreview.html";
    } else if (config.notifystyle == "xbox360") {
        webviewelem.src = "./notify/xbox360/preview/xbox360preview.html";
    } else if (config.notifystyle == "xqjan") {
        webviewelem.src = "./notify/xqjan/preview/xqjanpreview.html";
    }

    webviewelem.id = "webview";
    webviewelem.webpreferences = "nodeIntegration = true, contextIsolation = false";
    document.getElementById("notifypreview").appendChild(webviewelem);
}

function SetWebViewSrcRare() {
    var webviewelemrare = document.createElement("webview");

    if (config.rarenotifystyle == "default") {
        webviewelemrare.src = "./notify/default/rarepreview/defaultrarepreview.html";
    } else if (config.rarenotifystyle == "xbox") {
        webviewelemrare.src = "./notify/xbox/rarepreview/xboxrarepreview.html";
    } else if (config.rarenotifystyle == "playstation") {
        webviewelemrare.src = "./notify/playstation/rarepreview/playstationrarepreview.html";
    } else if (config.rarenotifystyle == "ps5") {
        webviewelemrare.src = "./notify/ps5/rarepreview/ps5rarepreview.html";
    } else if (config.rarenotifystyle == "windows") {
        webviewelemrare.src = "./notify/windows/rarepreview/windowsrarepreview.html";
    } else if (config.rarenotifystyle == "xbox360") {
        webviewelemrare.src = "./notify/xbox360/rarepreview/xbox360rarepreview.html";
    } else if (config.rarenotifystyle == "xqjan") {
        webviewelemrare.src = "./notify/xqjan/rarepreview/xqjanrarepreview.html";
    }

    webviewelemrare.id = "webviewrare";
    webviewelemrare.webpreferences = "nodeIntegration = true, contextIsolation = false";
    document.getElementById("notifypreviewrare").appendChild(webviewelemrare);
}

var notifywidth;
var notifyheight;

function SetNotifyStyle() {
    config["notifystyle"] = document.getElementById("customiserstyledropdown").value;
    ipcRenderer.send('storedragwin')

    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    CheckCustomPos();
}

function GetNotifyStyle() {
    document.getElementById("customiserstyledropdown").value = config.notifystyle;
    if (document.getElementById("customiserstyledropdown").value == "default") {
        if (config.screenshot == "true") {
            notifywidth = 300;
            notifyheight = 219;
        } else {
            notifywidth = 300;
            notifyheight = 50;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webview").src = "./notify/default/preview/defaultpreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdown").value == "xbox") {
        if (config.screenshot == "true") {
            notifywidth = 315;
            notifyheight = 244;
        } else {
            notifywidth = 315;
            notifyheight = 65;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webview").src = "./notify/xbox/preview/xboxpreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdown").value == "playstation") {
        if (config.screenshot == "true") {
            notifywidth = 310;
            notifyheight = 224;
        } else {
            notifywidth = 310;
            notifyheight = 55;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webview").src = "./notify/playstation/preview/playstationpreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdown").value == "ps5") {
        if (config.screenshot == "true") {
            notifywidth = 340;
            notifyheight = 219;
        } else {
            notifywidth = 340;
            notifyheight = 50;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webview").src = "./notify/ps5/preview/ps5preview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdown").value == "windows") {
        if (config.screenshot == "true") {
            notifywidth = 300;
            notifyheight = 279;
        } else {
            notifywidth = 300;
            notifyheight = 110;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webview").src = "./notify/windows/preview/windowspreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdown").value == "xbox360") {
        if (config.screenshot == "true") {
            notifywidth = 300;
            notifyheight = 219;
        } else {
            notifywidth = 300;
            notifyheight = 50;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webview").src = "./notify/xbox360/preview/xbox360preview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdown").value == "xqjan") {
        if (config.screenshot == "true") {
            notifywidth = 300;
            notifyheight = 239;
        } else {
            notifywidth = 300;
            notifyheight = 70;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webview").src = "./notify/xqjan/preview/xqjanpreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    }
}

GetNotifyStyle();

function SetNotifyStyleRare() {
    config["rarenotifystyle"] = document.getElementById("customiserstyledropdownrare").value;
    ipcRenderer.send('storedragwin')

    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    CheckCustomPosRare();
}

document.getElementById("customiserstyledropdownrare").value = config.rarenotifystyle;

function GetNotifyStyleRare() {
    document.getElementById("customiserstyledropdownrare").value = config.rarenotifystyle;
    if (document.getElementById("customiserstyledropdownrare").value == "default") {
        if (config.rarescreenshot == "true") {
            notifywidth = 300;
            notifyheight = 219;
        } else {
            notifywidth = 300;
            notifyheight = 50;
        }
        paused = false;
        document.getElementById("pauserare").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webviewrare").src = "./notify/default/rarepreview/defaultrarepreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdownrare").value == "xbox") {
        if (config.rarescreenshot == "true") {
            notifywidth = 315;
            notifyheight = 244;
        } else {
            notifywidth = 315;
            notifyheight = 65;
        }
        paused = false;
        document.getElementById("pauserare").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webviewrare").src = "./notify/xbox/rarepreview/xboxrarepreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdownrare").value == "playstation") {
        if (config.rarescreenshot == "true") {
            notifywidth = 310;
            notifyheight = 224;
        } else {
            notifywidth = 310;
            notifyheight = 55;
        }
        paused = false;
        document.getElementById("pauserare").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webviewrare").src = "./notify/playstation/rarepreview/playstationrarepreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdownrare").value == "ps5") {
        if (config.rarescreenshot == "true") {
            notifywidth = 340;
            notifyheight = 219;
        } else {
            notifywidth = 340;
            notifyheight = 50;
        }
        paused = false;
        document.getElementById("pauserare").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webviewrare").src = "./notify/ps5/rarepreview/ps5rarepreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdownrare").value == "windows") {
        if (config.rarescreenshot == "true") {
            notifywidth = 300;
            notifyheight = 279;
        } else {
            notifywidth = 300;
            notifyheight = 110;
        }
        paused = false;
        document.getElementById("pauserare").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webviewrare").src = "./notify/windows/rarepreview/windowsrarepreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdownrare").value == "xbox360") {
        if (config.rarescreenshot == "true") {
            notifywidth = 300;
            notifyheight = 219;
        } else {
            notifywidth = 300;
            notifyheight = 50;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webviewrare").src = "./notify/xbox360/rarepreview/xbox360rarepreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    } else if (document.getElementById("customiserstyledropdownrare").value == "xqjan") {
        if (config.rarescreenshot == "true") {
            notifywidth = 300;
            notifyheight = 239;
        } else {
            notifywidth = 300;
            notifyheight = 70;
        }
        paused = false;
        document.getElementById("pause").src = "./icon/pause_white.svg";
        try {
            document.getElementById("webviewrare").src = "./notify/xqjan/rarepreview/xqjanrarepreview.html";
        } catch (err) {
            // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
        }
    }
}

GetNotifyStyleRare();

function SetBGType() {
    if (document.getElementById("customiserbgdropdown").value == "bgsolid") {
        config["bgtype"] = "bgsolid";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else if (document.getElementById("customiserbgdropdown").value == "bg") {
        config["bgtype"] = "bg";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else if (document.getElementById("customiserbgdropdown").value == "img") {
        config["bgtype"] = "img";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    GetBGType();
}

var pos = config.notifypos;
var rarepos = config.rarenotifypos;

function GetBGType() {
    if (config.bgtype == "bgsolid") {
        document.getElementById("customiserbgdropdown").value = "bgsolid";
        document.getElementById("colourslbl").style.display = "flex";
        document.getElementById("colour1").style.display = "flex";
        document.getElementById("colour1box").value = config.colour1;
        document.getElementById("colour2").style.display = "flex";
        document.getElementById("colour2box").value = config.colour2;
        document.getElementById("imgselectlbl").style.display = "none";
        document.getElementById("imgselectcont").style.display = "none";
    } else if (config.bgtype == "bg") {
        document.getElementById("customiserbgdropdown").value = "bg";
        document.getElementById("colourslbl").style.display = "flex";
        document.getElementById("colour1").style.display = "flex";
        document.getElementById("colour1box").value = config.colour1;
        document.getElementById("colour2").style.display = "flex";
        document.getElementById("colour2box").value = config.colour2;
        document.getElementById("imgselectlbl").style.display = "none";
        document.getElementById("imgselectcont").style.display = "none";
    } else if (config.bgtype == "img") {
        document.getElementById("customiserbgdropdown").value = "img";
        document.getElementById("colourslbl").style.display = "flex";
        document.getElementById("colour1").style.display = "none";
        document.getElementById("colour1box").value = config.colour1;
        document.getElementById("colour2").style.display = "none";
        document.getElementById("colour2box").value = config.colour2;
        document.getElementById("imgselectlbl").style.display = "flex";
        document.getElementById("imgselectcont").style.display = "flex";
        if (config.img == "default") {
            document.getElementById("imgselecticon").src = "./img/santextlogobg.png";
        } else {
            document.getElementById("imgselecticon").src = config.img;
        }
    }
    document.getElementById("textcolourbox").value = config.textcolour;
    document.getElementById("roundness").value = config.roundness;
    document.getElementById("roundnesspreview").style.borderRadius = (config.roundness * 0.4) + "px";
    document.getElementById("iconroundness").value = config.iconroundness;
    document.getElementById("iconroundnesspreview").style.borderRadius = (config.iconroundness * 0.6) + "px";
    if (config.icon == "" || config.icon == undefined) {
        document.getElementById("iconselecticon").src = "./img/sanlogosquare.svg";
    } else {
        document.getElementById("iconselecticon").src = config.icon;
    }
}

function SetRareBGType() {
    if (document.getElementById("customiserbgdropdownrare").value == "bgsolid") {
        config["rarebgtype"] = "bgsolid";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else if (document.getElementById("customiserbgdropdownrare").value == "bg") {
        config["rarebgtype"] = "bg";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else if (document.getElementById("customiserbgdropdownrare").value == "img") {
        config["rarebgtype"] = "img";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    GetRareBGType();
}

function GetRareBGType() {
    if (config.rarebgtype == "bgsolid") {
        document.getElementById("customiserbgdropdownrare").value = "bgsolid";
        document.getElementById("rarecolourslbl").style.display = "flex";
        document.getElementById("rarecolour1").style.display = "flex";
        document.getElementById("rarecolour1box").value = config.rarecolour1;
        document.getElementById("rarecolour2").style.display = "flex";
        document.getElementById("rarecolour2box").value = config.rarecolour2;
        document.getElementById("rareimgselectlbl").style.display = "none";
        document.getElementById("rareimgselectcont").style.display = "none";
    } else if (config.rarebgtype == "bg") {
        document.getElementById("customiserbgdropdownrare").value = "bg";
        document.getElementById("rarecolourslbl").style.display = "flex";
        document.getElementById("rarecolour1").style.display = "flex";
        document.getElementById("rarecolour1box").value = config.rarecolour1;
        document.getElementById("rarecolour2").style.display = "flex";
        document.getElementById("rarecolour2box").value = config.rarecolour2;
        document.getElementById("rareimgselectlbl").style.display = "none";
        document.getElementById("rareimgselectcont").style.display = "none";
    } else if (config.rarebgtype == "img") {
        document.getElementById("customiserbgdropdownrare").value = "img";
        document.getElementById("rarecolourslbl").style.display = "flex";
        document.getElementById("rarecolour1").style.display = "none";
        document.getElementById("rarecolour1box").value = config.rarecolour1;
        document.getElementById("rarecolour2").style.display = "none";
        document.getElementById("rarecolour2box").value = config.rarecolour2;
        document.getElementById("rareimgselectlbl").style.display = "flex";
        document.getElementById("rareimgselectcont").style.display = "flex";
        if (config.rareimg == "default") {
            document.getElementById("rareimgselecticon").src = "./img/santextlogobg.png";
        } else {
            document.getElementById("rareimgselecticon").src = config.rareimg;
        }
    }
    document.getElementById("raretextcolourbox").value = config.raretextcolour;
    document.getElementById("roundnessrare").value = config.rareroundness;
    document.getElementById("roundnesspreviewrare").style.borderRadius = (config.rareroundness * 0.4) + "px";
    document.getElementById("iconroundnessrare").value = config.rareiconroundness;
    document.getElementById("iconroundnesspreviewrare").style.borderRadius = (config.rareiconroundness * 0.6) + "px";
    if (config.rareicon == "" || config.rareicon == undefined) {
        document.getElementById("rareiconselecticon").src = "./img/sanlogosquare.svg";
    } else {
        document.getElementById("rareiconselecticon").src = config.rareicon;
    }
}

function NotifyWinPos() {
    if (pos == "bottomcenter") {
        ipcRenderer.send('bottom', config.notifystyle);
    } else if (pos == "bottomleft") {
        ipcRenderer.send('bottomleft', config.notifystyle);
    } else if (pos == "bottomright") {
        ipcRenderer.send('bottomright', config.notifystyle);
    } else if (pos == "topcenter") {
        ipcRenderer.send('top', config.notifystyle);
    } else if (pos == "topleft") {
        ipcRenderer.send('topleft', config.notifystyle);
    } else if (pos == "topright") {
        ipcRenderer.send('topright', config.notifystyle);
    }
}

function SetTopLeft() {
    pos = "topleft";
    document.getElementById("topleft").style.opacity = "1";
    document.getElementById("topcenter").style.opacity = "0.5";
    document.getElementById("topright").style.opacity = "0.5";
    document.getElementById("bottomleft").style.opacity = "0.5";
    document.getElementById("bottomcenter").style.opacity = "0.5";
    document.getElementById("bottomright").style.opacity = "0.5";
    config["notifypos"] = pos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));   
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

function SetTopCenter() {
    pos = "topcenter";
    document.getElementById("topleft").style.opacity = "0.5";
    document.getElementById("topcenter").style.opacity = "1";
    document.getElementById("topright").style.opacity = "0.5";
    document.getElementById("bottomleft").style.opacity = "0.5";
    document.getElementById("bottomcenter").style.opacity = "0.5";
    document.getElementById("bottomright").style.opacity = "0.5";
    config["notifypos"] = pos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

function SetTopRight() {
    pos = "topright";
    document.getElementById("topleft").style.opacity = "0.5";
    document.getElementById("topcenter").style.opacity = "0.5";
    document.getElementById("topright").style.opacity = "1";
    document.getElementById("bottomleft").style.opacity = "0.5";
    document.getElementById("bottomcenter").style.opacity = "0.5";
    document.getElementById("bottomright").style.opacity = "0.5";
    config["notifypos"] = pos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

function SetBottomLeft() {
    pos = "bottomleft";
    document.getElementById("topleft").style.opacity = "0.5";
    document.getElementById("topcenter").style.opacity = "0.5";
    document.getElementById("topright").style.opacity = "0.5";
    document.getElementById("bottomleft").style.opacity = "1";
    document.getElementById("bottomcenter").style.opacity = "0.5";
    document.getElementById("bottomright").style.opacity = "0.5";
    config["notifypos"] = pos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

function SetBottomCenter() {
    pos = "bottomcenter";
    document.getElementById("topleft").style.opacity = "0.5";
    document.getElementById("topcenter").style.opacity = "0.5";
    document.getElementById("topright").style.opacity = "0.5";
    document.getElementById("bottomleft").style.opacity = "0.5";
    document.getElementById("bottomcenter").style.opacity = "1";
    document.getElementById("bottomright").style.opacity = "0.5";
    config["notifypos"] = pos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

function SetBottomRight() {
    pos = "bottomright";
    document.getElementById("topleft").style.opacity = "0.5";
    document.getElementById("topcenter").style.opacity = "0.5";
    document.getElementById("topright").style.opacity = "0.5";
    document.getElementById("bottomleft").style.opacity = "0.5";
    document.getElementById("bottomcenter").style.opacity = "0.5";
    document.getElementById("bottomright").style.opacity = "1";
    config["notifypos"] = pos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

function SetTopLeftRare() {
    rarepos = "topleft";
    document.getElementById("topleftrare").style.opacity = "1";
    document.getElementById("topcenterrare").style.opacity = "0.5";
    document.getElementById("toprightrare").style.opacity = "0.5";
    document.getElementById("bottomleftrare").style.opacity = "0.5";
    document.getElementById("bottomcenterrare").style.opacity = "0.5";
    document.getElementById("bottomrightrare").style.opacity = "0.5";
    config["rarenotifypos"] = rarepos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));   
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

function SetTopCenterRare() {
    rarepos = "topcenter";
    document.getElementById("topleftrare").style.opacity = "0.5";
    document.getElementById("topcenterrare").style.opacity = "1";
    document.getElementById("toprightrare").style.opacity = "0.5";
    document.getElementById("bottomleftrare").style.opacity = "0.5";
    document.getElementById("bottomcenterrare").style.opacity = "0.5";
    document.getElementById("bottomrightrare").style.opacity = "0.5";
    config["rarenotifypos"] = rarepos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

function SetTopRightRare() {
    rarepos = "topright";
    document.getElementById("topleftrare").style.opacity = "0.5";
    document.getElementById("topcenterrare").style.opacity = "0.5";
    document.getElementById("toprightrare").style.opacity = "1";
    document.getElementById("bottomleftrare").style.opacity = "0.5";
    document.getElementById("bottomcenterrare").style.opacity = "0.5";
    document.getElementById("bottomrightrare").style.opacity = "0.5";
    config["rarenotifypos"] = rarepos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

function SetBottomLeftRare() {
    rarepos = "bottomleft";
    document.getElementById("topleftrare").style.opacity = "0.5";
    document.getElementById("topcenterrare").style.opacity = "0.5";
    document.getElementById("toprightrare").style.opacity = "0.5";
    document.getElementById("bottomleftrare").style.opacity = "1";
    document.getElementById("bottomcenterrare").style.opacity = "0.5";
    document.getElementById("bottomrightrare").style.opacity = "0.5";
    config["rarenotifypos"] = rarepos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

function SetBottomCenterRare() {
    rarepos = "bottomcenter";
    document.getElementById("topleftrare").style.opacity = "0.5";
    document.getElementById("topcenterrare").style.opacity = "0.5";
    document.getElementById("toprightrare").style.opacity = "0.5";
    document.getElementById("bottomleftrare").style.opacity = "0.5";
    document.getElementById("bottomcenterrare").style.opacity = "1";
    document.getElementById("bottomrightrare").style.opacity = "0.5";
    config["rarenotifypos"] = rarepos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

function SetBottomRightRare() {
    rarepos = "bottomright";
    document.getElementById("topleftrare").style.opacity = "0.5";
    document.getElementById("topcenterrare").style.opacity = "0.5";
    document.getElementById("toprightrare").style.opacity = "0.5";
    document.getElementById("bottomleftrare").style.opacity = "0.5";
    document.getElementById("bottomcenterrare").style.opacity = "0.5";
    document.getElementById("bottomrightrare").style.opacity = "1";
    config["rarenotifypos"] = rarepos;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

function SetColour1() {
    document.getElementById("colour1box").addEventListener('change', function() {
        config["colour1"] = document.getElementById("colour1box").value;
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    });
    GetBGType();
}

function SetColour2() {
    document.getElementById("colour2box").addEventListener('change', function() {
        config["colour2"] = document.getElementById("colour2box").value;
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    });
    GetBGType();
}

function SetTextColour() {
    document.getElementById("textcolourbox").addEventListener('change', function() {
        config["textcolour"] = document.getElementById("textcolourbox").value;
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    });
    GetBGType();
}

function SetRareColour1() {
    document.getElementById("rarecolour1box").addEventListener('change', function() {
        config["rarecolour1"] = document.getElementById("rarecolour1box").value;
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    });
    GetRareBGType();
}

function SetRareColour2() {
    document.getElementById("rarecolour2box").addEventListener('change', function() {
        config["rarecolour2"] = document.getElementById("rarecolour2box").value;
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    });
    GetRareBGType();
}

function SetRareTextColour() {
    document.getElementById("raretextcolourbox").addEventListener('change', function() {
        config["raretextcolour"] = document.getElementById("raretextcolourbox").value;
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    });
    GetRareBGType();
}

document.getElementById("roundness").addEventListener('input', function() {
    config["roundness"] = document.getElementById("roundness").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    GetBGType();
});

document.getElementById("roundnessrare").addEventListener('input', function() {
    config["rareroundness"] = document.getElementById("roundnessrare").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    GetRareBGType();
});

document.getElementById("iconroundness").addEventListener('input', function() {
    config["iconroundness"] = document.getElementById("iconroundness").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    GetBGType();
});

document.getElementById("iconroundnessrare").addEventListener('input', function() {
    config["rareiconroundness"] = document.getElementById("iconroundnessrare").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    GetRareBGType();
});

document.getElementById("imgselect").onchange = function(selection) {
    var file = selection.target.files[0];
    config["img"] = (file.path).replace(/\\/g,"/");
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    PauseNotification();
    GetBGType();
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

document.getElementById("rareimgselect").onchange = function(selection) {
    var file = selection.target.files[0];
    config["rareimg"] = (file.path).replace(/\\/g,"/");
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    GetRareBGType();
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

// ICON SELECT
document.getElementById("iconselect").onchange = function(selection) {
    var file = selection.target.files[0];
    file = file.path;
    try {
        config["icon"] = file.replace(/\\/g,"/");
    } catch {}
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    PauseNotification();
    GetBGType();
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    ReplayNotification();
}

// RARE ICON SELECT
document.getElementById("rareiconselect").onchange = function(selection) {
    var file = selection.target.files[0];
    file = file.path;
    try {
        config["rareicon"] = file.replace(/\\/g,"/");
    } catch {}
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    GetRareBGType();
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    ReplayRareNotification();
}

document.getElementById("displaytimeslider").value = config.displaytime;
document.getElementById("displaytimevalue").innerHTML = config.displaytime + "s";

function SetDisplayTime() {
    var displaytime = document.getElementById("displaytimeslider").value;
    config["displaytime"] = displaytime;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    document.getElementById("webview").reload();
}

document.getElementById("displaytimesliderrare").value = config.raredisplaytime;
document.getElementById("displaytimevaluerare").innerHTML = config.raredisplaytime + "s";

function SetRareDisplayTime() {
    var displaytime = document.getElementById("displaytimesliderrare").value;
    config["raredisplaytime"] = displaytime;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    document.getElementById("webviewrare").reload();
}

// !!! TESTING !!!
function OpenDevTools() {
    document.getElementsByTagName('webview')[0].openDevTools()
}

function ToggleShowScreenshot() {
    if (config.screenshot == "true") {
        config["screenshot"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["screenshot"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    document.getElementById("webview").reload();
}

function ToggleShowRareScreenshot() {
    if (config.rarescreenshot == "true") {
        config["rarescreenshot"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["rarescreenshot"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    document.getElementById("webviewrare").reload();
}

function ToggleMainTab() {
    GetBGType();
    GetNotifyStyle();

    document.getElementById("customisermaintab").addEventListener('mouseover', function() {
        this.style.opacity = "1";
    })

    document.getElementById("customisermaintab").addEventListener('mouseleave', function() {
        this.style.opacity = "1";
    })

    document.getElementById("customiserraretab").addEventListener('mouseover', function() {
        this.style.opacity = "1";
    })

    document.getElementById("customiserraretab").addEventListener('mouseleave', function() {
        this.style.opacity = "0.5";
    })

    document.getElementById("customisermaintab").style.background = "white";
    document.getElementById("customisermaintab").style.color = "black";
    document.getElementById("customisermaintab").style.opacity = "1";

    document.getElementById("customiserraretab").style.background = "rgba(32,66,122,1)";
    document.getElementById("customiserraretab").style.color = "white";
    document.getElementById("customiserraretab").style.opacity = "0.5";

    document.getElementById("maintab").style.display = "block";
    document.getElementById("raretab").style.display = "none";
    document.getElementById("notifypreview").style.display = "flex";
    document.getElementById("notifypreviewrare").style.display = "none";
    document.getElementById("notifybtncont").style.display = "flex";
    document.getElementById("notifybtncontrare").style.display = "none";
    try {
        document.getElementById("webview").reload();
    } catch (err) {
        // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
    }
}

document.getElementById("customisermaintab").addEventListener('click', function() {
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
});

document.getElementById("notifyplay").addEventListener('click', function() {
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
});

document.getElementById("customiserstyledropdown").addEventListener('change', function() {
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
});

function ToggleRareTab() {
    GetRareBGType();
    GetNotifyStyleRare();

    document.getElementById("customiserraretab").addEventListener('mouseover', function() {
        this.style.opacity = "1";
    })

    document.getElementById("customiserraretab").addEventListener('mouseleave', function() {
        this.style.opacity = "1";
    })

    document.getElementById("customisermaintab").addEventListener('mouseover', function() {
        this.style.opacity = "1";
    })

    document.getElementById("customisermaintab").addEventListener('mouseleave', function() {
        this.style.opacity = "0.5";
    })

    document.getElementById("customiserraretab").style.background = "white";
    document.getElementById("customiserraretab").style.color = "black";
    document.getElementById("customiserraretab").style.opacity = "1";

    document.getElementById("customisermaintab").style.background = "rgba(32,66,122,1)";
    document.getElementById("customisermaintab").style.color = "white";
    document.getElementById("customisermaintab").style.opacity = "0.5";

    document.getElementById("maintab").style.display = "none";
    document.getElementById("raretab").style.display = "block";
    document.getElementById("notifypreview").style.display = "none";
    document.getElementById("notifypreviewrare").style.display = "flex";
    document.getElementById("notifybtncont").style.display = "none";
    document.getElementById("notifybtncontrare").style.display = "flex";
    try {
        document.getElementById("webviewrare").reload();
    } catch (err) {
        // console.log("%cWEBVIEW ERROR: " + err, "color: orange")
    }
}

document.getElementById("customiserraretab").addEventListener('click', function() {
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
});

document.getElementById("notifyplayrare").addEventListener('click', function() {
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
});

document.getElementById("customiserstyledropdownrare").addEventListener('change', function() {
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
});

var configkeybind = config.keybind;
configkeybind = configkeybind.replace("KEY_","").replace("PAD_","Num ");
document.getElementById("steamkeybind").innerHTML = configkeybind;

function KeybindHover() {
    document.getElementById("steamkeybind").style.background = "white";
    document.getElementById("steamkeybind").style.color = "black";
}

function KeybindOut() {
    document.getElementById("steamkeybind").style.background = "rgba(32,66,122,1)";
    document.getElementById("steamkeybind").style.color = "white";
}

function SetKeybind() {
    document.getElementById("steamkeybind").style.animation = "bluetowhite 0.5s alternate infinite";
    document.getElementById("steamkeybind").innerHTML = presskey;
    
    var keybind;

    document.onkeydown = function KeyDown(event) {
        var keymap = new Map([
            ["Control","invalid"],
            ["Shift","invalid"],
            ["Alt","invalid"],
            ["AltGraph","invalid"],
            ["Meta","invalid"],
            ["`","invalid"],
            ["NumpadAdd","plus"],
            ["NumpadSubtract","minus"],
            ["NumpadDecimal","decimal"],
            ["NumpadMultiply","multiply"],
            ["NumpadDivide","divide"]
        ])

        function GetKeybind(code, key) {
            if (keymap.has(code)) {
                keybind = keymap.get(code)
            } else if (keymap.has(key)) {
                if (keymap.get(key) == "invalid") {
                    keybind = "invalid"
                } else {
                    keybind = keymap.get(key)
                }
            } else {
                if (code.includes("Numpad") && code != "NumpadEnter") {
                    keybind = "Num " + key
                } else {
                    keybind = key
                }
            }

            keybind = keybind.toUpperCase()
        }

        GetKeybind(event.code, event.key)
        
        if (keybind != "INVALID") {
            config["keybind"] = keybind;
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            
            document.getElementById("steamkeybind").innerHTML = keybind;
            document.getElementById("steamkeybind").style.animation = "none";
            document.getElementById("steamkeybind").style.background = "rgba(32,66,122,1)";
            document.getElementById("steamkeybind").style.color = "white";
        } else {
            // TO DO: Change "steamkeybind" element background to red + "Invalid"
            // Reset back to previous value in config["keybind"]
            alert("Invalid key!")
            document.getElementById("steamkeybind").innerHTML = config.keybind;
            document.getElementById("steamkeybind").style.animation = "none";
            document.getElementById("steamkeybind").style.background = "rgba(32,66,122,1)";
            document.getElementById("steamkeybind").style.color = "white";
        }
    
        document.onkeydown = null;
    }
}

// !!! OG SetKeybind (Pre-1.84)
// function SetKeybind() {
//     document.getElementById("steamkeybind").style.animation = "bluetowhite 0.5s alternate infinite";
//     document.getElementById("steamkeybind").innerHTML = presskey;

//     document.onkeydown = function KeyDown(event) {
//         var key = event.key;

//         config["keybind"] = key;
//         fs.writeFileSync(path.join(process.env.LOCALAPPDATA,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        
//         document.getElementById("steamkeybind").innerHTML = key.toUpperCase();
//         document.getElementById("steamkeybind").style.animation = "none";
//         document.getElementById("steamkeybind").style.background = "rgba(32,66,122,1)";
//         document.getElementById("steamkeybind").style.color = "white";
    
//         document.onkeydown = null;
//     }
// }

// !!! 1.84 VDF File Testing !!!
// function SetKeybind() {
//     document.getElementById("steamkeybind").style.animation = "bluetowhite 0.5s alternate infinite";
//     document.getElementById("steamkeybind").innerHTML = presskey;
    
//     var keybind;

//     document.onkeydown = function KeyDown(event) {
//         var keymap = new Map([
//             [".","period"],
//             [";","semicolon"],
//             [",","comma"],
//             ["'","backquote"],
//             ["[","lbracket"],
//             ["]","rbracket"],
//             ["#","apostrophe"],
//             ["=","equal"],
//             ["-","minus"],
//             [" ","space"],
//             ["\\","backslash"],
//             ["/","slash"],
//             ["ArrowUp","up"],
//             ["ArrowDown","down"],
//             ["ArrowLeft","left"],
//             ["ArrowRight","right"],
//             ["Control","invalid"],
//             ["Shift","invalid"],
//             ["Alt","invalid"],
//             ["AltGraph","invalid"],
//             ["Meta","invalid"],
//             ["`","invalid"],
//             ["NumpadAdd","plus"],
//             ["NumpadSubtract","minus"],
//             ["NumpadDecimal","decimal"],
//             ["NumpadMultiply","multiply"],
//             ["NumpadDivide","divide"],
//             ["Numpad0","PAD_0"],
//             ["Numpad1","PAD_1"],
//             ["Numpad2","PAD_2"],
//             ["Numpad3","PAD_3"],
//             ["Numpad4","PAD_4"],
//             ["Numpad5","PAD_5"],
//             ["Numpad6","PAD_6"],
//             ["Numpad7","PAD_7"],
//             ["Numpad8","PAD_8"],
//             ["Numpad9","PAD_9"],
//             ["Pause","break"]
//         ])

//         function GetKeybind(code, key) {
//             if (keymap.has(code)) {
//                 var replacecode = keymap.get(code)

//                 keybind = "KEY_" + replacecode
//             } else if (keymap.has(key)) {
//                 var replacekey = keymap.get(key)

//                 if (replacekey == "invalid") {
//                     keybind = "invalid"
//                 } else {
//                     keybind = "KEY_" + replacekey
//                 }
//             } else {
//                 if (code.includes("Numpad") && code != "NumpadEnter") {
//                     keybind = "KEY_PAD_" + key
//                 } else {
//                     keybind = "KEY_" + key
//                 }
//             }

//             keybind = keybind.toUpperCase()
//         }

//         GetKeybind(event.code, event.key)
        
//         if (keybind != "INVALID") {
//             if (steampath && steam3id) {
//                 var vdfpath = path.join(steampath,"userdata",steam3id.toString(),"config","localconfig.vdf")
//                 var vdffile = fs.readFileSync(vdfpath)
//                 vdffile = vdffile.toString()
//                 const vdfdata = VDF.parse(vdffile)

//                 vdfdata.UserLocalConfigStore.system["InGameOverlayScreenshotHotKey"] = keybind
//                 fs.writeFileSync(vdfpath, VDF.stringify(vdfdata))
//             }

//             config["keybind"] = keybind;
//             fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
            
//             document.getElementById("steamkeybind").innerHTML = keybind.replace("KEY_","").replace("PAD_","Num ");
//             document.getElementById("steamkeybind").style.animation = "none";
//             document.getElementById("steamkeybind").style.background = "rgba(32,66,122,1)";
//             document.getElementById("steamkeybind").style.color = "white";
//         } else {
//             // TO DO: Change "steamkeybind" element background to red + "Invalid"
//             // Reset back to previous value in config["keybind"]
//             alert("Invalid key!")
//             document.getElementById("steamkeybind").innerHTML = config.keybind;
//             document.getElementById("steamkeybind").style.animation = "none";
//             document.getElementById("steamkeybind").style.background = "rgba(32,66,122,1)";
//             document.getElementById("steamkeybind").style.color = "white";
//         }
    
//         document.onkeydown = null;
//     }
// }

document.getElementById("scaleslider").value = config.scale;
document.getElementById("scalevalue").innerHTML = config.scale + "%";

function SetScale() {
    config["scale"] = document.getElementById("scaleslider").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    document.getElementById("webview").reload();
}

document.getElementById("scalesliderrare").value = config.rarescale;
document.getElementById("scalevaluerare").innerHTML = config.rarescale + "%";

function SetRareScale() {
    config["rarescale"] = document.getElementById("scalesliderrare").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    document.getElementById("webviewrare").reload();
}

document.getElementById("rarityslider").value = config.rarity;
document.getElementById("rarityvalue").innerHTML = config.rarity;

function SetRarity() {
    config["rarity"] = document.getElementById("rarityslider").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
}

document.getElementById("audio").volume = (config.volume * 10) / 100;
document.getElementById("volumeslider").value = config.volume;
document.getElementById("audiorare").volume = (config.rarevolume * 10) / 100;
document.getElementById("volumesliderrare").value = config.rarevolume;

function Volume(event) {
    if (event.deltaY < 0) {
        document.getElementById("volumeslider").value = parseInt(document.getElementById("volumeslider").value) + 1;
    } else {
        document.getElementById("volumeslider").value = parseInt(document.getElementById("volumeslider").value) - 1;
    }
    document.getElementById("audio").volume = (config.volume * 10) / 100;
    config["volume"] = document.getElementById("volumeslider").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
}

function ShowVolume() {
    document.getElementById("volumeupicon").style.opacity = "1";
    document.getElementById("volumedownicon").style.opacity = "1";
    document.getElementById("volumeslider").style.opacity = "1";
}

function HideVolume() {
    document.getElementById("volumeupicon").style.opacity = "0";
    document.getElementById("volumedownicon").style.opacity = "0";
    document.getElementById("volumeslider").style.opacity = "0";
}

function VolumeRare(event) {
    if (event.deltaY < 0) {
        document.getElementById("volumesliderrare").value = parseInt(document.getElementById("volumesliderrare").value) + 1;
    } else {
        document.getElementById("volumesliderrare").value = parseInt(document.getElementById("volumesliderrare").value) - 1;
    }
    document.getElementById("audiorare").volume = (config.rarevolume * 10) / 100;
    config["rarevolume"] = document.getElementById("volumesliderrare").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
}

function ShowVolumeRare() {
    document.getElementById("volumeupiconrare").style.opacity = "1";
    document.getElementById("volumedowniconrare").style.opacity = "1";
    document.getElementById("volumesliderrare").style.opacity = "1";
}

function HideVolumeRare() {
    document.getElementById("volumeupiconrare").style.opacity = "0";
    document.getElementById("volumedowniconrare").style.opacity = "0";
    document.getElementById("volumesliderrare").style.opacity = "0";
}

var steam3id;
var steampath;

function GetSteam3ID() {
    if (process.platform == "win32") {
        regkey.list([`HKCU\\SOFTWARE\\Valve\\Steam\\ActiveProcess`], function(err, result) {
            try {
                steam3id = result["HKCU\\SOFTWARE\\Valve\\Steam\\ActiveProcess"].values.ActiveUser.value;
            } catch {
                // console.log("%cSteam3ID not found", "color: red;");
            }
        });
    } else if (process.platform == "linux" || process.platform == "darwin") {
        var steam64id = config.steam64id;
        var steamidio = `https://steamid.io/lookup/${steam64id}`;

        if (steam64id !== "") {
            fetch(steamidio)
            .then(res => res.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/html"))
            .then(data => {
                var lookup = data.body.getElementsByTagName("dd")[1].children[1].innerText;
                lookup = lookup.replace(/U:1:/g,"").replace(/\[/g,"").replace(/\]/g,"");
                
                steam3id = lookup;
            });
        } else {
            console.log("%No steam64id detected","color: darkred");
        }
    }
}

function GetSteamPath() {
    if (process.platform == "win32") {
        regkey.list([`HKCU\\SOFTWARE\\Valve\\Steam\\`], function(err, result) {
            try {
                steampath = result["HKCU\\SOFTWARE\\Valve\\Steam\\"].values.SteamPath.value;
            } catch {
                // console.log("%cSteam installation path not found", "color: red;");
            }
        });
    } else if (process.platform == "linux") {
        steampath = path.join(process.env.HOME,".steam","steam");
    } else if (process.platform == "darwin") {
        steampath == path.join(localappdata,"Steam")
    }
}

function GetSteamDetails() {
    GetSteam3ID();
    GetSteamPath();
    
    var checksteamdetails = setInterval(function() {
        if (steam3id && steampath) {
            if (steam3id == 0) {
                GetSteam3ID();
            } else {
                clearInterval(checksteamdetails);
                SANIdle();
            }
        } else {
            GetSteam3ID();
            GetSteamPath();
        }
    }, 1000);
}

GetSteamDetails();

var xmllist;
var achievementobj;
var achievementarr = [];

function GetHiddenDescs() {
    if (config.steam64id == "") {
        console.log("%cError fetching achievement information: No Steam64ID provided",`color: red; font-family:${font}`)
    } else {
        fetch(xmllist)
        .then(res => {
            if (res.ok) {
                if (!(res.url).includes(appid) && !(res.url).includes("/?xml=1")) {
                    console.log("%cError: Game uses Community Game Name (instead of appid)! Re-checking...","color:red");
                    xmllist = res.url + "/?xml=1";
                    GetHiddenDescs();
                } else {
                    console.log("%cUsing URL: " + xmllist,"color:limegreen");
                    xmllist = `https://steamcommunity.com/profiles/${config.steam64id}/stats/${appid}/?xml=1`;
                    return res.text();
                }
            } else {
                console.log("%cError fetching achievement information for " + appid,"color:red");
            }
        })
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            var achievementdata = data.getElementsByTagName("achievement")
            for (var i = 0; i < achievementdata.length; i++) {
                achievementobj = {
                    name: achievementdata[i].children[2].textContent,
                    apiname: achievementdata[i].children[3].textContent,
                    desc: achievementdata[i].children[4].textContent
                }
                achievementarr.push(achievementobj)
                // console.log(`%cTitle: %c${achievementobj.name}\n%cAPI Name: %c${achievementobj.apiname}\n%cDescription: %c${achievementobj.desc}`,"color: deeppink","color: white","color:rebeccapurple","color:white","color:blueviolet","color:white");
            }
        })
    }
}

function GetAppIDFromRegKey() {
    if (process.platform == "win32") {
        regkey.list([`HKCU\\SOFTWARE\\Valve\\Steam`], function(err, result) {
            appid = result["HKCU\\SOFTWARE\\Valve\\Steam"].values.RunningAppID.value;
        });
    } else {
        var vdffile;

        if (process.platform == "linux") {
            vdffile = fs.readFileSync(path.join(process.env.HOME,".steam","registry.vdf"));
        } else if (process.platform == "darwin") {
            vdffile = fs.readFileSync(path.join(localappdata,"Steam","registry.vdf"));
        }

        vdffile = vdffile.toString();
        var vdfdata = VDF.parse(vdffile);

        appid = vdfdata.Registry.HKCU.Software.Valve.Steam.RunningAppID;
    }
}

function SANIdle() {
    GetSteam3ID();
    console.log("%cSteam3ID (For user logged into Steam client): " + steam3id, "color: seagreen;");
    GetSteamPath();
    console.log("%cSteam installation path: " + steampath, "color: seagreen;");

    function StoreLocal() {
        var apikey = config.apikey;
        var steam64id = config.steam64id;

        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        const random = getRandomInt(9999999);
        
        var gpalocal = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${apikey}&steamid=${steam64id}&l=${lang}&?__random=${random}`;
        fetch(gpalocal).then(response => response.json()).then((data) => {
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","local.json"), JSON.stringify(data));
        }).catch(error => {
            console.log("%cSTEAM WEB API ERROR: " + error, "color: red");
        });
    }

    var sanidle = setInterval(function() {
        GetAppIDFromRegKey();
        
        if (appid == 0 || appid == undefined) {
            console.log("%cNo game detected", "color: darkred;");
        } else {
            if (process.platform == "win32") {
                regkey.list([`HKCU\\SOFTWARE\\Valve\\Steam\\Apps\\${appid}`], function(err, result) {
                    gamename = result[`HKCU\\SOFTWARE\\Valve\\Steam\\Apps\\${appid}`].values.Name.value;
                    if (config.tracking == "true") {
                        ipcRenderer.send('trackwin', gamename);
                        setTimeout(function() {
                            ipcRenderer.send('trackstop')
                        }, 5000);
                    }
                    console.log("%cNow tracking achievements for: " + gamename, "color: deepskyblue;");
                    document.getElementById("gamestatus").style.color = "white";
                    document.getElementById("gamestatus").innerHTML = gamename;
                    ipcRenderer.send('track', gamename, trayshow, trayexit);
                });
            } else if (process.platform == "linux") {
                var regvdffile = fs.readFileSync(path.join(process.env.HOME,".steam","registry.vdf"));
                regvdffile = regvdffile.toString();
                var regvdfdata = VDF.parse(regvdffile);

                gamename = regvdfdata.Registry.HKCU.Software.Valve.Steam.apps[appid].name;
                
                if (config.tracking == "true") {
                    ipcRenderer.send('trackwin', gamename);
                    setTimeout(function() {
                        ipcRenderer.send('trackstop')
                    }, 5000);
                }
                console.log("%cNow tracking achievements for: " + gamename, "color: deepskyblue;");
                document.getElementById("gamestatus").style.color = "white";
                document.getElementById("gamestatus").innerHTML = gamename;
                ipcRenderer.send('track', gamename, trayshow, trayexit);
            } else if (process.platform == "darwin") {
                var regvdffile = fs.readFileSync(path.join(localappdata,"Steam","registry.vdf"));
                regvdffile = regvdffile.toString();
                var regvdfdata = VDF.parse(regvdffile);

                gamename = regvdfdata.Registry.HKCU.Software.Valve.Steam.apps[appid].name;
                
                if (config.tracking == "true") {
                    ipcRenderer.send('trackwin', gamename);
                    setTimeout(function() {
                        ipcRenderer.send('trackstop')
                    }, 5000);
                }
                console.log("%cNow tracking achievements for: " + gamename, "color: deepskyblue;");
                document.getElementById("gamestatus").style.color = "white";
                document.getElementById("gamestatus").innerHTML = gamename;
                ipcRenderer.send('track', gamename, trayshow, trayexit);
            }
            
            xmllist = `https://steamcommunity.com/profiles/${config.steam64id}/stats/${appid}/?xml=1`;
            
            StoreLocal();
            clearInterval(sanidle);
            currgame = appid;
            StartSAN();
        }
    }, 1000);
}

var percentages;
var cheevnum;

function CheckAchievements() {
    return new Promise((resolve, reject) => {
        var ggapfa = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${appid}&l=${lang}&format=json`;
        fetch(ggapfa).then(response => response.json()).then((data) => {
            percentages = data.achievementpercentages.achievements;
            cheevnum = data.achievementpercentages.achievements.length;
        
            if (cheevnum !== 0) {
                console.log(`%cAppID ${appid} has achievements (${cheevnum})`, "color: limegreen;");
                
                GetHiddenDescs()
                
                resolve();
            } else {
                console.log(`%cAppID ${appid} has no achievements (${cheevnum})`, "color: red;");
                reject();
            }
        }).catch(() => {
            if (appid !== 0) {
                console.log(`%cAppID ${appid} has no achievements (No API response received)`, "color: orange;");
            }
            reject();
        });
    });
}

async function StartSAN() {
    try {
        await CheckAchievements();

        var apikey = config.apikey;
        var steam64id = config.steam64id;

        var lastmodified;

        var gsfg = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=${apikey}&appid=${appid}&l=${lang}&format=json`;
        fetch(gsfg).then(response => response.json()).then((data) => {
            desc = data;
        });

        if (!gamestats.games[appid]) {
            gamestats.games["" + appid + ""] = {};
            gamestats.games[appid]["completed"] = false;
            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","gamestats.json"), JSON.stringify(gamestats, null, 2));
        }

        function GetAchievementsFromURL() {
            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }
            const random = getRandomInt(9999999);

            var gpa = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${apikey}&steamid=${steam64id}&l=${lang}&?__random=${random}`;
            fetch(gpa).then(response => response.json()).then((data) => {
                var local = JSON.parse(fs.readFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","local.json")));
                var url = data;

                function MainNotification(t, d, i) {
                    GetNotifyStyle();
                
                    console.log("%cMain Notification added to queue.", "color: lightskyblue;");
                
                    var notifyachievement;

                    if (config.allpercent == "true") {
                        notifyachievement = achievementunlocked + ` (${percent}%)`;
                    } else {
                        notifyachievement = achievementunlocked;
                    }

                    var notifytitle = "" + t + "";
                    var notifydesc = "" +  d + "";

                    if (notifydesc == "" || notifydesc == undefined) {
                        achievementarr.forEach((achievement) => {
                            if (notifytitle == achievement.name) {
                                notifydesc = achievement.desc
                            }
                        })
                    }

                    var notifyicon = "" + i + "";
                
                    const queueobj = {
                        type: "main",
                        width: notifywidth,
                        height: notifyheight,
                        style: config.notifystyle,
                        achievement: notifyachievement,
                        title: notifytitle,
                        desc: notifydesc,
                        icon: notifyicon,
                        screenshot: config.screenshot,
                        pos: config.notifypos,
                        scale: config.scale,
                        percent: percent,
                        audio: document.getElementById("audio").src
                    };
                
                    queue.push(queueobj);
                
                    function CheckIfRunning() {
                        if (running == true) {
                            setTimeout(CheckIfRunning, 1000);
                            return;
                        } else {
                            running = true;
                            queue.shift(queueobj);
                            NotifyWinPos();
                            notifystyle = config.notifystyle;
                            if (config.screenshot == "true") {
                                // !!! Need to add alternative for Linux/MacOS
                                if (process.platform == "win32") {
                                    spawn("powershell.exe",["-Command","Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{" + configkeybind + "}');"]);
                                }
                            }
                            ipcRenderer.send('notifywin', queueobj);
                            LoadSound();

                            if (config.nvda == "true") {
                                clipboard.writeText(notifyachievement + " " + notifytitle + " " + notifydesc);
                            }

                            if (config.screenshot == "true" && config.ssoverlay == "true") {
                                ipcRenderer.send('img', notifytitle, notifydesc, notifyicon, gamename, queueobj.type)
                            }

                            ipcRenderer.once('notrunning', function() {
                                running = false;
                                if (queue.length == 0) {
                                    console.log("%cQueue is empty.", "color: grey;");
                                } else {
                                    console.log("%cQueue Position: " + queue.length, "color: grey;");
                                }
                            });
                        }
                    }
                
                    CheckIfRunning();
                }

                function RareNotification(t, d, i) {
                    GetNotifyStyleRare()

                    console.log("%cRare Notification added to queue.", "color: darkorchid;");

                    var notifyachievement = rareachievementunlocked + ` (${percent}%)`;
                    var notifytitle = "" + t + "";
                    var notifydesc = "" + d + "";

                    if (notifydesc == "" || notifydesc == undefined) {
                        achievementarr.forEach((achievement) => {
                            if (notifytitle == achievement.name) {
                                notifydesc = achievement.desc
                            }
                        })
                    }

                    var notifyicon = "" + i + "";
                
                    const queueobj = {
                        type: "rare",
                        width: notifywidth,
                        height: notifyheight,
                        style: config.rarenotifystyle,
                        achievement: notifyachievement,
                        title: notifytitle,
                        desc: notifydesc,
                        icon: notifyicon,
                        screenshot: config.rarescreenshot,
                        pos: config.rarenotifypos,
                        scale: config.rarescale,
                        percent: percent,
                        audio: document.getElementById("audiorare").src
                    };
                
                    queue.push(queueobj);
                
                    function CheckIfRunning() {
                        if (running == true) {
                            setTimeout(CheckIfRunning, 1000);
                            return;
                        } else {
                            running = true;
                            queue.shift(queueobj);
                            NotifyWinPos();
                            notifystyle = config.rarenotifystyle;
                            ipcRenderer.send('notifywin', queueobj);
                            if (config.rarescreenshot == "true") {
                                // !!! Need to add alternative for Linux/MacOS
                                if (process.platform == "win32") {
                                    spawn("powershell.exe",["-Command","Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('{" + configkeybind + "}');"]);
                                }
                                // } else if (process.platform == "linux") {
                                //     spawn("gnome-terminal",[`xdotool key ${configkeybind}`])
                                // }
                            }
                            LoadRareSound();

                            if (config.nvda == "true") {
                                clipboard.writeText(notifyachievement + " " + notifytitle + " " + notifydesc);
                            }

                            if (config.rarescreenshot == "true" && config.ssoverlay == "true") {
                                ipcRenderer.send('img', notifytitle, notifydesc, notifyicon, gamename, queueobj.type)
                            }

                            ipcRenderer.once('notrunning', function() {
                                running = false;
                                if (queue.length == 0) {
                                    console.log("%cQueue is empty.", "color: grey;");
                                } else {
                                    console.log("%cQueue Position: " + queue.length, "color: grey;");
                                }
                            });
                        }
                    }
                
                    CheckIfRunning();
                }

                function MainSoundOnlyMode() {
                    var audio = document.getElementById("audio");
                    audio.play();
                }

                function RareSoundOnlyMode() {
                    var audiorare = document.getElementById("audiorare");
                    audiorare.play();
                }

                setTimeout(() =>{
                    if (config.screenshot == "true") {
                        desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1280, height: 720 }}).then(function(sources) {
                            screenshot = sources[0].thumbnail.toDataURL();
                        });
                    } else if (config.rarescreenshot == "true") {
                        desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1280, height: 720 }}).then(function(sources) {
                            screenshot = sources[0].thumbnail.toDataURL();
                        });
                    }
                }, 250)

                function CheckCompletionViaAPI() {
                    if (gamestats.games[appid].completed == true) {
                        console.log("%cGame already complete!", "color: orange;");
                    } else {
                        var arrurl = url.playerstats.achievements;
                        var acharr = [];
    
                        arrurl.forEach((achievement) => {
                            acharr.push(achievement.achieved);
                        });
    
                        if (acharr.every((achievement) => achievement == 1) == true) {
                            console.log("%cGame Complete!", "color: yellow;");
    
                            GameCompletionNotification();

                            gamestats.games[appid]["completed"] = true;
                            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","gamestats.json"), JSON.stringify(gamestats, null, 2));
                        } else {
                            console.log("%cGame has not yet been completed", "color: orange;");
                        }
                    }
                }

                for (var i = 0; i < url.playerstats.achievements.length; i++) {
                    if (local.playerstats.achievements[i].achieved !== url.playerstats.achievements[i].achieved) {
                        var achievementname = url.playerstats.achievements[i].name;
                        var achievementdesc = url.playerstats.achievements[i].description;
                        var achievementicon = desc.game.availableGameStats.achievements[i].icon;

                        var apiname = url.playerstats.achievements[i].apiname;
                        var percent;

                        percentages.forEach(function(achievement) {
                            if (achievement.name == apiname) {
                                percent = achievement.percent;
                                percent = Math.round(percent * 100) / 100;
                            }
                        });

                        var configpercent = parseFloat(config.rarity);
                        configpercent = Math.round(configpercent * 100) / 100;

                        if (percent < configpercent) {
                            if (config.soundonly == "true") {
                                RareSoundOnlyMode();
                            } else {
                                RareNotification(achievementname, achievementdesc, achievementicon);
                            }
                        } else {
                            if (config.soundonly == "true") {
                                MainSoundOnlyMode();
                            } else {
                                MainNotification(achievementname, achievementdesc, achievementicon);
                            }
                        }

                        setTimeout(function() {
                            fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","local.json"), JSON.stringify(url));
                            local = JSON.parse(fs.readFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","local.json")));
                        }, 100);

                        if (config.gamecomplete == "true") {
                            setTimeout(CheckCompletionViaAPI, 500)
                        }
                    }
                }
                StartSAN();
            }).catch(error => {
                console.log("%cSTEAM WEB API ERROR: " + error, "color: red");
            });
        }

        console.log(`%cTracking changes to file: ${steampath}/appcache/stats/UserGameStats_${steam3id}_${appid}.bin`, "color: seagreen;");

        fs.stat(`${steampath}/appcache/stats/UserGameStats_${steam3id}_${appid}.bin`, function(err, stats) {
            if (err) {
                clearInterval(checkgame)
                StartSAN();
            } else {
                lastmodified = stats.mtime;
            }
        });

        var checkgame = setInterval(function() {
            GetAppIDFromRegKey();

            if (appid == 0 || appid == undefined || appid !== currgame) {
                clearInterval(checkgame);
                fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","local.json"), "");
                document.getElementById("gamestatus").style.color = "red";
                document.getElementById("gamestatus").innerHTML = nogame;
                ipcRenderer.send('idle', traylabel, trayshow, trayexit);
                currgame = null;
                SANIdle();
            } else {
                fs.stat(`${steampath}/appcache/stats/UserGameStats_${steam3id}_${appid}.bin`, function(err, stats) {
                    if (err) {
                        console.log("%cFSSTAT ERROR: " + err, "color: red")
                    } else {
                        if (stats.mtime > lastmodified) {
                            console.log("%cFile was changed!", "color: deepskyblue;");
                            lastmodified = stats.mtime;

                            clearInterval(checkgame);
                            GetAchievementsFromURL();
                        } else {
                            console.log("%cNo change", "color: red")
                        }
                    }
                });
            }
        }, 1000);
    } catch (err) {
        console.log("%cSTARTSAN ERROR: " + err, "color: red");

        var checkappid = setInterval(function() {
            GetAppIDFromRegKey();

            if (appid == 0 || appid == undefined || appid !== currgame) {
                clearInterval(checkappid);
                fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","local.json"), "");
                document.getElementById("gamestatus").style.color = "red";
                document.getElementById("gamestatus").innerHTML = nogame;
                ipcRenderer.send('idle', traylabel, trayshow, trayexit);
                currgame = null;
                SANIdle();
            }
        }, 1000);
    }
}

function CheckNoSteam() {
    if (config.nosteam == "true") {
        document.getElementById("nosteambox").checked = true;
    } else {
        document.getElementById("nosteambox").checked = false;
    }
}

function ToggleNoSteam() {
    function RestartSteam() {
        spawn("powershell.exe",["-Command","taskkill /f /im steam.exe"]);
        setTimeout(function() {
            spawn("powershell.exe",["-Command",`start '` + steampath + `/steam.exe'`]);
            setTimeout(function() {
                document.getElementById("nosteambox").style.display = "flex";
                document.getElementById("nosteamloadcont").style.display = "none";
            }, 5000);
        }, 2500);
    }

    function SetSkinInReg() {
        var skinv5value = {
            'HKCU\\SOFTWARE\\Valve\\Steam': {
                'SkinV5': {
                    value: 'NoSteamNotifications',
                    type: 'REG_SZ'
                }
            }
        }
    
        regkey.putValue(skinv5value, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("%cNoSteamNotifications Steam skin set in Registry.", "color: seagreen;");
                RestartSteam();
            }
        });
    }

    function RemoveSkinInReg() {
        var skinv5value = {
            'HKCU\\SOFTWARE\\Valve\\Steam': {
                'SkinV5': {
                    value: '',
                    type: 'REG_SZ'
                }
            }
        }
    
        regkey.putValue(skinv5value, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("%cDefault Steam skin set in Registry.", "color: seagreen;");
                RestartSteam();
            }
        });
    }

    if (config.nosteam == "false") {
        document.getElementById("nosteambox").style.display = "none";
        document.getElementById("nosteamloadcont").style.display = "flex";

        config["nosteam"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));

        if (fs.existsSync(path.join(steampath,"skins","NoSteamNotifications","resource","styles","steam.styles"))) {
            SetSkinInReg();
        } else {
            fs.mkdirSync(path.join(steampath,"skins","NoSteamNotifications","resource","styles"), { recursive: true });
            fs.copyFileSync(path.join(__dirname,"store","steam.styles"), path.join(steampath,"skins","NoSteamNotifications","resource","styles","steam.styles"));

            SetSkinInReg();
        }
    } else {
        document.getElementById("nosteambox").style.display = "none";
        document.getElementById("nosteamloadcont").style.display = "flex";
        
        config["nosteam"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));

        RemoveSkinInReg();
    }

    CheckNoSteam();
}

function CheckAllPercent() {
    if (config.allpercent == "true") {
        document.getElementById("allpercentbox").checked = true;
    } else {
        document.getElementById("allpercentbox").checked = false;
    }
}

function ToggleAllPercent() {
    if (config.allpercent == "false") {
        config["allpercent"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["allpercent"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckAllPercent();
}

function CheckNVDA() {
    if (config.nvda == "true") {
        document.getElementById("nvdabox").checked = true;
    } else {
        document.getElementById("nvdabox").checked = false;
    }
}

function ToggleNVDA() {
    if (config.nvda == "false") {
        config["nvda"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["nvda"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckNVDA();
}

function CheckHWA() {
    if (config.hwa == "true") {
        document.getElementById("hwabox").checked = true;
    } else {
        document.getElementById("hwabox").checked = false;
    }
}

function ToggleHWA() {
    if (config.hwa == "false") {
        config["hwa"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        ipcRenderer.send('resetcomplete');
    } else {
        config["hwa"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
        ipcRenderer.send('resetcomplete');
    }
}

function CheckIfSteamIsRunning() {
    var execname;
    var tasklist;

    if (process.platform == "win32") {
        execname = "steam.exe";
        tasklist = "tasklist";
    } else if (process.platform == "linux") {
        execname = "steam";
        tasklist = "ps -A";
    } else if (process.platform == "darwin") {
        execname = "steam"
        tasklist = `ps -ax | grep ${execname}`
    }

    exec(tasklist, function(err, process) {
        var steam = process.toLowerCase().indexOf(execname);

        if (steam == -1) {
            var checkprocesses = setInterval(function() {
                exec(tasklist, function(err, process) {
                    var steamrecheck = process.toLowerCase().indexOf(execname);
                    if (steamrecheck !== -1) {
                        clearInterval(checkprocesses);
                        ipcRenderer.send('reloadapp');
                    } else {
                        console.log("%cSteam is NOT running", "color: red");
                    }
                });
            }, 2000);
        } else {
            console.log("%cSteam is running.", "color: cyan");
        }
    });
}

CheckIfSteamIsRunning();

function GameCompletionNotification() {
    GetNotifyStyleRare()

    console.log("%cGame Completion Notification added to queue.", "color: yellow;");

    var notifyachievement = gamecomplete;
    var notifytitle = gamename;
    var notifydesc = allunlocked + " (" + cheevnum + "/" + cheevnum + ")";
    var notifyicon = "../../../img/ribbon.svg";

    const queueobj = {
        type: "rare",
        width: notifywidth,
        height: notifyheight,
        style: config.rarenotifystyle,
        achievement: notifyachievement,
        title: notifytitle,
        desc: notifydesc,
        icon: notifyicon,
        screenshot: config.rarescreenshot,
        pos: config.rarenotifypos,
        scale: config.rarescale
    };

    queue.push(queueobj);

    function CheckIfRunning() {
        if (running == true) {
            setTimeout(CheckIfRunning, 1000);
            return;
        } else {
            running = true;
            queue.shift(queueobj);
            NotifyWinPos();
            notifystyle = config.rarenotifystyle;
            ipcRenderer.send('notifywin', queueobj);
            var audio = document.getElementById("audiorare");
            LoadRareSound();
            audio.play();

            if (config.nvda == "true") {
                clipboard.writeText(notifyachievement + " " + notifytitle + " " + notifydesc);
            }

            ipcRenderer.once('notrunning', function() {
                running = false;
                if (queue.length == 0) {
                    console.log("%cQueue is empty.", "color: grey;");
                } else {
                    console.log("%cQueue Position: " + queue.length, "color: grey;");
                }
            });
        }
    }

    CheckIfRunning();
}

function CheckIconAnimation() {
    if (config.iconanim == "true") {
        document.getElementById("iconanimation").checked = true;
    } else {
        document.getElementById("iconanimation").checked = false;
    }
}

CheckIconAnimation();

function ToggleIconAnimation() {
    if (config.iconanim == "false") {
        config["iconanim"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["iconanim"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckIconAnimation();
}

function CheckSSOverlay() {
    if (!config.ssoverlay) {
        config["ssoverlay"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }

    if (!config.ovpath) {
        config["ovpath"] = ""; 
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    
    if (config.ovpath == "") {
        if (process.platform == "win32") {
            document.getElementById("ssoverlaypath").innerHTML = path.join(process.env.USERPROFILE,"Pictures");
        } else if (process.platform == "linux" || process.platform == "darwin") {
            document.getElementById("ssoverlaypath").innerHTML = path.join(process.env.HOME,"Pictures");
        }
    } else {
        var folder = config.ovpath;

        if (folder.length > 40) {
            var shortfolder = folder.substring((folder.length - 40), folder.length);
            folder = "..." + shortfolder;
        }

        document.getElementById("ssoverlaypath").innerHTML = folder;
    }

    document.getElementById("ssoverlaypathcont").style.transition = "0.2s";
    document.getElementById("ssoverlaypathcont").style.animation = "fadein 0.5s forwards";

    if (config.ssoverlay == "true") {
        document.getElementById("ssoverlaybox").checked = true;
        document.getElementById("ssoverlaypathcont").style.display = "flex";
    } else {
        document.getElementById("ssoverlaybox").checked = false;
        document.getElementById("ssoverlaypathcont").style.display = "none";
    }
}

CheckSSOverlay();

function ToggleSSOverlay() {
    if (config.ssoverlay == "false") {
        config["ssoverlay"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    
        if (config.ssoverlay == "true" && config.screenshot == "false" && config.rarescreenshot == "false") {
            document.getElementById("sserror").style.display = "block";
        } else {
            document.getElementById("sserror").style.display = "none";
        }
    } else {
        config["ssoverlay"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    
        document.getElementById("sserror").style.display = "none";
    }

    CheckSSOverlay();
}

function SetSSOverlayPath() {
    ipcRenderer.send('ovpath');
}

var pathlocked = false;

function CheckPathLock() {
    if (pathlocked == true) {
        document.getElementById("ssoverlaypath").style.pointerEvents = "none";
        document.getElementById("ssoverlaybox").disabled = true;
    } else {
        document.getElementById("ssoverlaypath").style.pointerEvents = "auto";
        document.getElementById("ssoverlaybox").disabled = false;
    }
}

ipcRenderer.on('lockpath', () => {
    pathlocked = true;
    CheckPathLock();
})

ipcRenderer.on('unlockpath', (event, folder) => {
    pathlocked = false;
    CheckPathLock();

    config["ovpath"] = folder;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));

    var folderpath = folder;

    if (folderpath == "") {
        if (process.platform == "win32") {
            folderpath = path.join(process.env.USERPROFILE,"Pictures");
        } else if (process.platform == "linux" || process.platform == "darwin") {
            folderpath = path.join(process.env.HOME,"Pictures");
        }
    }

    // !!! Change to use text-overflow in "path" element instead...
    if (folderpath.length > 40) {
        var shortfolder = folderpath.substring((folderpath.length - 40), folderpath.length);
        folderpath = "..." + shortfolder;
    }

    document.getElementById("ssoverlaypath").innerHTML = folderpath;
})

function CheckGameCompletion() {
    if (!config.gamecomplete) {
        config["gamecomplete"] = "true"; 
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }

    if (config.gamecomplete == "true") {
        document.getElementById("gamecompletionbox").checked = true;
    } else {
        document.getElementById("gamecompletionbox").checked = false;
    }
}

CheckGameCompletion();

function ToggleGameCompletion() {
    if (config.gamecomplete == "false") {
        config["gamecomplete"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["gamecomplete"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckGameCompletion();
}

function CheckCustomPos() {
    if (config.custompos == "false") {
        document.getElementById("dragposbox").checked = false;
        document.getElementById("dragposbtn").style.display = "none";
        document.getElementById("notifypositioncont").style.opacity = "1";
        document.getElementById("notifypositioncont").style.pointerEvents = "auto";
        // document.getElementById("dircont").style.display = "none";
    } else {
        document.getElementById("dragposbox").checked = true;
        document.getElementById("dragposbtn").style.display = "flex";
        document.getElementById("notifypositioncont").style.opacity = "0.5";
        document.getElementById("notifypositioncont").style.pointerEvents = "none";
        
        // if (document.getElementById("customiserstyledropdown").value == "playstation" || document.getElementById("customiserstyledropdown").value == "windows") {
        //     document.getElementById("dircont").style.display = "flex";
        // } else {
        //     document.getElementById("dircont").style.display = "none";
        // }
    }
}

CheckCustomPos()

function ToggleCustomPos() {
    if (config.custompos == "false") {
        config["custompos"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["custompos"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckCustomPos()
}

function CheckCustomPosRare() {
    if (config.rarecustompos == "false") {
        document.getElementById("dragposboxrare").checked = false;
        document.getElementById("dragposbtnrare").style.display = "none";
        document.getElementById("notifypositioncontrare").style.opacity = "1";
        document.getElementById("notifypositioncontrare").style.pointerEvents = "auto";
        // document.getElementById("dircontrare").style.display = "none";
    } else {
        document.getElementById("dragposboxrare").checked = true;
        document.getElementById("dragposbtnrare").style.display = "flex";
        document.getElementById("notifypositioncontrare").style.opacity = "0.5";
        document.getElementById("notifypositioncontrare").style.pointerEvents = "none";

        // if (document.getElementById("customiserstyledropdownrare").value == "playstation" || document.getElementById("customiserstyledropdownrare").value == "windows") {
        //     document.getElementById("dircontrare").style.display = "flex";
        // } else {
        //     document.getElementById("dircontrare").style.display = "none";
        // }
    }
}

CheckCustomPosRare()

function ToggleCustomPosRare() {
    if (config.rarecustompos == "false") {
        config["rarecustompos"] = "true";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    } else {
        config["rarecustompos"] = "false";
        fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    }
    CheckCustomPosRare()
}

var postype;
var style;

function SetCustomPos() {
    postype = "main";
    style = document.getElementById("customiserstyledropdown").value;
    
    document.getElementById("dragposbox").style.pointerEvents = "none";
    document.getElementById("dragposbtn").style.pointerEvents = "none";
    document.getElementById("dragposbtn").innerHTML = "...";
    document.getElementById("dragposbtn").style.animation = "bluetowhite 0.5s alternate infinite forwards";
    
    document.getElementById("dragposboxrare").style.pointerEvents = "none";
    document.getElementById("dragposbtnrare").style.pointerEvents = "none";
    document.getElementById("dragposbtnrare").innerHTML = settingpos;
    document.getElementById("dragposbtnrare").style.animation = "bluetowhite 0.5s alternate infinite forwards";

    document.getElementById("recenter").style.display = "flex";
    
    ipcRenderer.send('setcustompos', postype, style);
}

function SetCustomPosRare() {
    postype = "rare";
    style = document.getElementById("customiserstyledropdownrare").value;
    
    document.getElementById("dragposboxrare").style.pointerEvents = "none";
    document.getElementById("dragposbtnrare").style.pointerEvents = "none";
    document.getElementById("dragposbtnrare").innerHTML = "...";
    document.getElementById("dragposbtnrare").style.animation = "bluetowhite 0.5s alternate infinite forwards";
    
    document.getElementById("dragposbox").style.pointerEvents = "none";
    document.getElementById("dragposbtn").style.pointerEvents = "none";
    document.getElementById("dragposbtn").innerHTML = settingposrare;
    document.getElementById("dragposbtn").style.animation = "bluetowhite 0.5s alternate infinite forwards";

    document.getElementById("recenterrare").style.display = "flex";

    ipcRenderer.send('setcustompos', postype, style);
}

ipcRenderer.on('dragwinclose', () => {
    document.getElementById("dragposbox").style.pointerEvents = "auto";
    document.getElementById("dragposbtn").style.pointerEvents = "auto";
    document.getElementById("dragposbtn").innerHTML = custompos;
    document.getElementById("dragposbtn").style.animation = "none";

    document.getElementById("dragposboxrare").style.pointerEvents = "auto";
    document.getElementById("dragposbtnrare").style.pointerEvents = "auto";
    document.getElementById("dragposbtnrare").innerHTML = custompos;
    document.getElementById("dragposbtnrare").style.animation = "none";

    document.getElementById("recenter").style.display = "none";
    document.getElementById("recenterrare").style.display = "none";
});

function RecenterDragWin() {
    ipcRenderer.send('recenter');
}

ipcRenderer.on('saveposmain', (event, x, y) => {
    config["x"] = x;
    config["y"] = y;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
});

ipcRenderer.on('saveposrare', (event, x, y) => {
    config["rarex"] = x;
    config["rarey"] = y;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
});

if (config.fontsize == undefined) {
    document.getElementById("fontsizeslider").value = "100";
    document.getElementById("fontsizevalue").innerHTML = "100%";
} else {
    document.getElementById("fontsizeslider").value = config.fontsize;
    document.getElementById("fontsizevalue").innerHTML = config.fontsize + "%";
}

if (config.rarefontsize == undefined) {
    document.getElementById("fontsizesliderrare").value = "100";
    document.getElementById("fontsizevaluerare").innerHTML = "100%";
} else {
    document.getElementById("fontsizesliderrare").value = config.rarefontsize;
    document.getElementById("fontsizevaluerare").innerHTML = config.rarefontsize + "%";
}

function SetFontSize() {
    config["fontsize"] = document.getElementById("fontsizeslider").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    document.getElementById("webview").reload();
}

function SetFontSizeRare() {
    config["rarefontsize"] = document.getElementById("fontsizesliderrare").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
    paused = false;
    document.getElementById("pauserare").src = "./icon/pause_white.svg";
    document.getElementById("webviewrare").reload();
}

if (config.opacity == undefined) {
    document.getElementById("opacityslider").value = "100";
    document.getElementById("opacityvalue").innerHTML = document.getElementById("opacityslider").value;
} else {
    document.getElementById("opacityslider").value = config.opacity;
    document.getElementById("opacityvalue").innerHTML = document.getElementById("opacityslider").value;
}

function SetOpacity() {
    config["opacity"] = document.getElementById("opacityslider").value;
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));
}

function ResetIcon() {
    document.getElementById("iconselecticon").src = "./img/sanlogosquare.svg"

    config["icon"] = "";
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));

    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    document.getElementById("webview").reload();
}

function ResetIconRare() {
    document.getElementById("rareiconselecticon").src = "./img/sanlogosquare.svg"

    config["rareicon"] = "";
    fs.writeFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json"), JSON.stringify(config, null, 2));

    paused = false;
    document.getElementById("pause").src = "./icon/pause_white.svg";
    document.getElementById("webviewrare").reload();
}

// Clears webFrame cache every minute
// Removes images from cache which apparently hogs memory
// const { webFrame } = require('electron');
// var clearcache = setInterval(function() {
//     webFrame.clearCache();
// }, 60000);

ipcRenderer.on('warnmsg', (e, m) => {
    console.log(`%c${m}`, "color: orange")
})

ipcRenderer.on('errormsg', (e, m) => {
    console.log(`%c${m}`, "color: red")
})
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

var localappdata;

if (process.platform == "win32") {
    localappdata = path.join(process.env.LOCALAPPDATA);
} else if (process.platform == "linux") {
    localappdata = path.join(process.env.HOME,".local","share");
} else if (process.platform == "darwin") {
    localappdata = path.join(process.env.HOME,"Library","Application Support");
}

const config = JSON.parse(fs.readFileSync(path.join(localappdata,"Steam Achievement Notifier (V1.8)","store","config.json")));

document.body.style.opacity = config.opacity * 0.01;

var colour1 = config.colour1;
var colour2 = config.colour2;
var textcolour = config.textcolour;
var img;

if (config.img == "default") {
    img = "../../../img/santextlogobg.png";
} else {
    img = config.img;
}

var icon = "../../../img/sanlogosquare.svg";

var righticon;

if (config.icon == "") {
    righticon = "../../../img/sanlogo.svg";
} else {
    righticon = config.icon;
}

var borderradius;
var ssborderradius;
var ssimgborderradius;

if (config.notifypos == "topleft") {
    borderradius = "0px " + config.roundness + "px " + config.roundness + "px 0px";
    ssborderradius = "0px " + config.roundness + "px 0px 0px";
    ssimgborderradius = "0px 0px " + config.roundness + "px 0px";
} else if (config.notifypos == "bottomleft") {
    borderradius = "0px " + config.roundness + "px " + config.roundness + "px 0px";
    ssborderradius = "0px 0px " + config.roundness + "px 0px";
    ssimgborderradius = "0px " + config.roundness + "px 0px 0px";
} else if (config.notifypos == "topcenter") {
    borderradius = "0px 0px " + config.roundness + "px " + config.roundness + "px";
    ssborderradius = "0px 0px 0px 0px";
    ssimgborderradius = "0px 0px " + config.roundness + "px " + config.roundness + "px";
} else if (config.notifypos == "topright") {
    borderradius = config.roundness + "px 0px 0px " + config.roundness + "px";
    ssborderradius = config.roundness + "px 0px 0px 0px";
    ssimgborderradius = "0px 0px 0px " + config.roundness + "px";
} else if (config.notifypos == "bottomright") {
    borderradius = config.roundness + "px 0px 0px " + config.roundness + "px";
    ssborderradius = "0px 0px 0px " + config.roundness + "px";
    ssimgborderradius = config.roundness + "px 0px 0px 0px";
} else if (config.notifypos == "bottomcenter") {
    borderradius = config.roundness + "px " + config.roundness + "px 0px 0px";
    ssborderradius = "0px 0px 0px 0px";
    ssimgborderradius = config.roundness + "px " + config.roundness + "px 0px 0px";
}

var solid = "background: " + colour1;
var background = "background: radial-gradient(circle, " + colour1 + " 0%, " + colour2 + " 100%)";
var imgbackground = "url('" + img + "')";

var scale = config.scale;
if (scale > 100) {
    document.getElementById("cont").style.transform = "translate(-50%, -50%) scale(" + (100 + scale * 0.1) + "%, " + (100 + scale * 0.1) + "%)";
} else {
    document.getElementById("cont").style.transform = "translate(-50%, -50%) scale(" + scale + "%, " + scale + "%)";
}

var bgtype = config.bgtype;

if (bgtype == "bgsolid") {
    document.getElementById("cont").style.color = textcolour;
    document.getElementById("notifycont").style = solid;
    if (config.screenshot == "true") {
        document.getElementById("notifycont").style.borderRadius = ssborderradius;
        document.getElementById("screenshot").style.borderRadius = ssimgborderradius;
    } else {
        document.getElementById("notifycont").style.borderRadius = borderradius;
    }
    document.getElementById("icon").src = icon;
    document.getElementById("icon").style.borderRadius = "" + config.iconroundness + "px";
    document.getElementById("righticon").src = righticon;
    document.getElementById("righticon").style.borderRadius = "" + config.iconroundness + "px";
} else if (bgtype == "bg") {
    document.getElementById("cont").style.color = textcolour;
    document.getElementById("notifycont").style = background;
    if (config.screenshot == "true") {
        document.getElementById("notifycont").style.borderRadius = ssborderradius;
        document.getElementById("screenshot").style.borderRadius = ssimgborderradius;
    } else {
        document.getElementById("notifycont").style.borderRadius = borderradius;
    }
    document.getElementById("icon").src = icon;
    document.getElementById("icon").style.borderRadius = "" + config.iconroundness + "px";
    document.getElementById("righticon").src = righticon;
    document.getElementById("righticon").style.borderRadius = "" + config.iconroundness + "px";
} else if (bgtype == "img") {
    document.getElementById("cont").style.color = textcolour;
    document.getElementById("notifycont").style.backgroundImage = imgbackground;
    document.getElementById("notifycont").style.backgroundPosition = "center";
    document.getElementById("notifycont").style.backgroundRepeat = "no-repeat";
    document.getElementById("notifycont").style.backgroundSize = "300px";
    if (config.screenshot == "true") {
        document.getElementById("notifycont").style.borderRadius = ssborderradius;
        document.getElementById("screenshot").style.borderRadius = ssimgborderradius;
    } else {
        document.getElementById("notifycont").style.borderRadius = borderradius;
    }
    document.getElementById("icon").src = icon;
    document.getElementById("icon").style.borderRadius = "" + config.iconroundness + "px";
    document.getElementById("righticon").src = righticon;
    document.getElementById("righticon").style.borderRadius = "" + config.iconroundness + "px";
}

if (config.screenshot == "true") {
    document.getElementById("cont").style.height = "224px";
    document.getElementById("screenshotcont").style.display = "flex";
} else {
    document.getElementById("cont").style.height = "55px";
    document.getElementById("screenshotcont").style.display = "none";
}

var text = "Achievement Unlocked!";
var title = "Steam Achievement Notifier";

document.getElementById("notifycont").style.animation = "none";

document.getElementById("text").innerHTML = text;
document.getElementById("game").innerHTML = '<img id="trophyicon" src="../../../img/pssilver.png" width="10px">' + title;

document.getElementById("text").style.fontSize = 12.7 * config.fontsize * 0.01 + "px";
document.getElementById("game").style.fontSize = 12 * config.fontsize * 0.01 + "px";
document.getElementById("trophyicon").style.width = 10 * config.fontsize * 0.01 + "px";
document.getElementById("trophyicon").style.height = 10 * config.fontsize * 0.01 + "px";

var direction = "left";

if (config.notifypos == "topleft") {
    direction = "left";
} else if (config.notifypos == "bottomleft") {
    direction = "left";
} else if (config.notifypos == "topcenter") {
    direction = "down";
} else if (config.notifypos == "bottomcenter") {
    direction = "up";
} else if (config.notifypos == "topright") {
    direction = "right";
} else if (config.notifypos == "bottomright") {
    direction = "right";
}

if (config.notifypos == "topleft") {
    document.getElementById("cont").style.justifyContent = "flex-start";
    document.getElementById("cont").style.alignItems = "flex-start";
    document.getElementById("notifycont").style.justifyContent = "flex-end";
    document.getElementById("textcont").style.alignItems = "flex-start";
    document.getElementById("icon").style.order = "1";
    document.getElementById("textcont").style.order = "2";
    document.getElementById("righticon").style.order = "3";
    document.getElementById("screenshotcont").style.order = "2";
    document.getElementById("notifycont").style.order = "1";
} else if (config.notifypos == "bottomleft") {
    document.getElementById("cont").style.justifyContent = "flex-end";
    document.getElementById("cont").style.alignItems = "flex-start";
    document.getElementById("notifycont").style.justifyContent = "flex-end";
    document.getElementById("textcont").style.alignItems = "flex-start";
    document.getElementById("icon").style.order = "1";
    document.getElementById("textcont").style.order = "2";
    document.getElementById("righticon").style.order = "3";
    document.getElementById("screenshotcont").style.order = "1";
    document.getElementById("notifycont").style.order = "2";
} else if (config.notifypos == "topright") {
    document.getElementById("cont").style.justifyContent = "flex-start";
    document.getElementById("cont").style.alignItems = "flex-end";
    document.getElementById("notifycont").style.justifyContent = "flex-start";
    document.getElementById("textcont").style.alignItems = "flex-end";
    document.getElementById("icon").style.order = "3";
    document.getElementById("textcont").style.order = "2";
    document.getElementById("righticon").style.order = "1";
    document.getElementById("screenshotcont").style.order = "2";
    document.getElementById("notifycont").style.order = "1";
} else if (config.notifypos == "bottomright") {
    document.getElementById("cont").style.justifyContent = "flex-end";
    document.getElementById("cont").style.alignItems = "flex-end";
    document.getElementById("notifycont").style.justifyContent = "flex-start";
    document.getElementById("textcont").style.alignItems = "flex-end";
    document.getElementById("icon").style.order = "3";
    document.getElementById("textcont").style.order = "2";
    document.getElementById("righticon").style.order = "1";
    document.getElementById("screenshotcont").style.order = "1";
    document.getElementById("notifycont").style.order = "2";
} else if (config.notifypos == "topcenter") {
    document.getElementById("cont").style.justifyContent = "flex-start";
    document.getElementById("cont").style.alignItems = "center";
    document.getElementById("notifycont").style.justifyContent = "center";
    document.getElementById("textcont").style.alignItems = "flex-start";
    document.getElementById("icon").style.order = "1";
    document.getElementById("textcont").style.order = "2";
    document.getElementById("righticon").style.order = "3";
    document.getElementById("screenshotcont").style.order = "2";
    document.getElementById("notifycont").style.order = "1";
} else if (config.notifypos == "bottomcenter") {
    document.getElementById("cont").style.justifyContent = "flex-end";
    document.getElementById("cont").style.alignItems = "center";
    document.getElementById("notifycont").style.justifyContent = "center";
    document.getElementById("textcont").style.alignItems = "flex-start";
    document.getElementById("icon").style.order = "1";
    document.getElementById("textcont").style.order = "2";
    document.getElementById("righticon").style.order = "3";
    document.getElementById("screenshotcont").style.order = "1";
    document.getElementById("notifycont").style.order = "2";
}

var pause = 0;

function PlayNotification(add) {
    if (config.notifypos == "topcenter" || config.notifypos == "topleft" || config.notifypos == "topright") {
        document.getElementById("screenshot").style.animation = "revealdown 0.3s 0.3s forwards";
    } else {
        document.getElementById("screenshot").style.animation = "revealup 0.3s 0.3s forwards";
    }

    document.getElementById("notifycont").style.animation = "slidein" + direction + " 0.5s linear forwards";
    document.getElementById("shadowdiv").style.animation = "slidein" + direction + " 0.5s linear forwards";
    document.getElementById("notifycont").style.borderRadius = borderradius;

    document.getElementById("screenshot").addEventListener('animationstart', function(event) {
        if (event.animationName == "revealdown" || event.animationName == "revealup") {
            document.getElementById("notifycont").style.transition = "0.2s";
            document.getElementById("notifycont").style.borderRadius = ssborderradius;
        }
    });

    document.getElementById("notifycont").addEventListener('animationend', function(event) {
        if (event.animationName == "slidein" + direction) {
            document.getElementById("notifycont").style.animation = "animpause " + ((pause * 0.001) + add) + "s linear forwards";
            document.getElementById("shadowdiv").style.animation = "animpause " + ((pause * 0.001) + add) + "s linear forwards";
        } else if (event.animationName == "animpause") {
            if (config.notifypos == "topcenter" || config.notifypos == "topleft" || config.notifypos == "topright") {
                document.getElementById("screenshot").style.animation = "revealdownrev 0.3s forwards";
                document.getElementById("notifycont").style.transition = "0.2s";
                document.getElementById("notifycont").style.borderRadius = borderradius;
            } else {
                document.getElementById("screenshot").style.animation = "revealuprev 0.3s forwards";
                document.getElementById("notifycont").style.transition = "0.2s";
                document.getElementById("notifycont").style.borderRadius = borderradius;
            }

            document.getElementById("notifycont").style.animation = "slideout" + direction + " 0.5s linear reverse backwards";
            document.getElementById("shadowdiv").style.animation = "slideout" + direction + " 0.5s linear reverse backwards";
        }
    });
}

var displaytime = config.displaytime;

if (displaytime == 15) {
    PlayNotification(14);
} else if (displaytime == 14) {
    PlayNotification(13);
} else if (displaytime == 13) {
    PlayNotification(12);
} else if (displaytime == 12) {
    PlayNotification(11);
} else if (displaytime == 11) {
    PlayNotification(10);
} else if (displaytime == 10) {
    PlayNotification(9);
} else if (displaytime == 9) {
    PlayNotification(8);
} else if (displaytime == 8) {
    PlayNotification(7);
} else if (displaytime == 7) {
    PlayNotification(6);
} else if (displaytime == 6) {
    PlayNotification(5);
} else if (displaytime == 5) {
    PlayNotification(4);
} else if (displaytime == 4) {
    PlayNotification(3);
} else if (displaytime == 3) {
    PlayNotification(2);
} else if (displaytime == 2) {
    PlayNotification(1);
}

ipcRenderer.on('pausenotify', function() {
    document.getElementById("notifycont").style.animationPlayState = "paused";
    document.getElementById("screenshot").style.animationPlayState = "paused";
});

ipcRenderer.on('playnotify', function() {
    document.getElementById("notifycont").style.animationPlayState = "running";
    document.getElementById("screenshot").style.animationPlayState = "running";
});
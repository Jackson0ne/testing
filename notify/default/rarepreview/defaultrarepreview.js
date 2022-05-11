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

var colour1 = config.rarecolour1;
var colour2 = config.rarecolour2;
var textcolour = config.raretextcolour;
var img;

if (config.rareimg == "default") {
    img = "../../../img/santextlogobg.png";
} else {
    img = config.rareimg;
}

var icon;

if (config.rareicon == "") {
    icon = "../../../img/sanlogosquare.svg";
} else {
    icon = config.rareicon;
    document.getElementById("icon1").style.boxShadow = "none";
}

var icon1 = "../../../img/sanlogosquare.svg";

var borderradius = config.rareroundness + "px ";
var ssborderradius;
var ssimgborderradius;

if (config.rarenotifypos == "topleft") {
    ssborderradius = "0px 0px " + config.rareroundness + "px " + config.rareroundness + "px ";
    ssimgborderradius = config.rareroundness + "px " + config.rareroundness + "px " + " 0px 0px";
} else if (config.rarenotifypos == "bottomleft") {
    ssborderradius = "0px 0px " + config.rareroundness + "px " + config.rareroundness + "px";
    ssimgborderradius = config.rareroundness + "px " + config.rareroundness + "px 0px 0px";
} else if (config.rarenotifypos == "topcenter") {
    ssborderradius = "0px 0px " + config.rareroundness + "px " + config.rareroundness + "px";
    ssimgborderradius = config.rareroundness + "px " + config.rareroundness + "px 0px 0px";
} else if (config.rarenotifypos == "topright") {
    ssborderradius = "0px 0px " + config.rareroundness + "px " + config.rareroundness + "px";
    ssimgborderradius = config.rareroundness + "px " + config.rareroundness + "px 0px 0px";
} else if (config.rarenotifypos == "bottomright") {
    ssborderradius = "0px 0px " + config.rareroundness + "px " + config.rareroundness + "px";
    ssimgborderradius = config.rareroundness + "px " + config.rareroundness + "px 0px 0px";
} else if (config.rarenotifypos == "bottomcenter") {
    ssborderradius = "0px 0px " + config.rareroundness + "px " + config.rareroundness + "px";
    ssimgborderradius = config.rareroundness + "px " + config.rareroundness + "px 0px 0px";
}

var solid = "background: " + colour1;
var solid1 = "background: " + colour2;
var background = "background: radial-gradient(circle, " + colour1 + " 0%, " + colour2 + " 100%)";
var background1 = "background: radial-gradient(circle, " + colour2 + " 0%, " + colour1 + " 100%)";
var imgbackground = "url('" + img + "')";

var scale = config.rarescale;
if (scale > 100) {
    document.getElementById("cont").style.transform = "translate(-50%, -50%) scale(" + (100 + scale * 0.1) + "%, " + (100 + scale * 0.1) + "%)";
} else {
    document.getElementById("cont").style.transform = "translate(-50%, -50%) scale(" + scale + "%, " + scale + "%)";
}

if (config.iconanim == "false") {
    document.getElementById("outline").style.display = "none";
    document.getElementById("outline1").style.display = "none";
    document.getElementById("outlinecont").style.display = "none";
    document.getElementById("outlinecont1").style.display = "none";
    document.getElementById("outlineinnercont").style.display = "none";
    document.getElementById("outlineinnercont1").style.display = "none";
    document.getElementById("icon1").style.boxShadow = "none";
    document.getElementById("icon2").style.boxShadow = "none";
}

var bgtype = config.rarebgtype;

if (bgtype == "bgsolid") {
    document.getElementById("cont").style.color = textcolour;
    document.getElementById("notifycont").style = solid;
    document.getElementById("desccont").style = solid1;
    document.getElementById("screenshot").style.borderRadius = ssimgborderradius;
    document.getElementById("notifycont").style.borderRadius = borderradius;
    document.getElementById("desccont").style.borderRadius = borderradius;
    document.getElementById("icon1").src = icon;
    document.getElementById("icon2").src = icon1;
    document.getElementById("icon1").style.borderRadius = "" + config.rareiconroundness + "px";
    document.getElementById("icon2").style.borderRadius = "" + config.rareiconroundness + "px";
} else if (bgtype == "bg") {
    document.getElementById("cont").style.color = textcolour;
    document.getElementById("notifycont").style = background;
    document.getElementById("desccont").style = background1;
    document.getElementById("screenshot").style.borderRadius = ssimgborderradius;
    document.getElementById("notifycont").style.borderRadius = borderradius;
    document.getElementById("desccont").style.borderRadius = borderradius;
    document.getElementById("icon1").src = icon;
    document.getElementById("icon2").src = icon1;
    document.getElementById("icon1").style.borderRadius = "" + config.rareiconroundness + "px";
    document.getElementById("icon2").style.borderRadius = "" + config.rareiconroundness + "px";
} else if (bgtype == "img") {
    document.getElementById("cont").style.color = textcolour;
    document.getElementById("screenshot").style.borderRadius = ssimgborderradius;
    document.getElementById("notifycont").style.backgroundImage = imgbackground;
    document.getElementById("notifycont").style.backgroundPosition = "center";
    document.getElementById("notifycont").style.backgroundRepeat = "no-repeat";
    document.getElementById("notifycont").style.backgroundSize = "300px";
    document.getElementById("notifycont").style.borderRadius = borderradius;
    document.getElementById("desccont").style.backgroundImage = imgbackground;
    document.getElementById("desccont").style.backgroundPosition = "center";
    document.getElementById("desccont").style.backgroundRepeat = "no-repeat";
    document.getElementById("desccont").style.backgroundSize = "300px";
    document.getElementById("desccont").style.borderRadius = borderradius;
    document.getElementById("icon1").src = icon;
    document.getElementById("icon2").src = icon1;
    document.getElementById("icon1").style.borderRadius = "" + config.rareiconroundness + "px";
    document.getElementById("icon2").style.borderRadius = "" + config.rareiconroundness + "px";
}

if (config.rarescreenshot == "true") {
    document.getElementById("cont").style.height = "219px";
    document.getElementById("screenshotcont").style.display = "flex";
} else {
    document.getElementById("cont").style.height = "50px";
    document.getElementById("screenshotcont").style.display = "none";
}

var text = "Rare Achievement Unlocked! (0.0%)";
var title = "Steam Achievement Notifier";
var desc = "Your notifications are working correctly";

document.getElementById("text").innerHTML = '<img id="trophyicon" src="../../../img/sanlogotrophy.svg" width="12px" style="margin-right: 5px; vertical-align: -2px;">' + text;
document.getElementById("game").innerHTML = title;
document.getElementById("desc").innerHTML = desc;

document.getElementById("cont").style.fontSize = 12.9 * config.rarefontsize * 0.01 + "px";
document.getElementById("textcont2").style.fontSize = 10 * config.rarefontsize * 0.01 + "px";
document.getElementById("game").style.fontSize = 10 * config.rarefontsize * 0.01 + "px";
document.getElementById("desc").style.fontSize = 9 * config.rarefontsize * 0.01 + "px";
document.getElementById("trophyicon").style.width = 12 * config.rarefontsize * 0.01 + "px";
document.getElementById("trophyicon").style.verticalAlign = "-" + 2 * config.rarefontsize * 0.01 + "px";

var pause = 0;

function PlayNotification(add) {
    document.getElementById("notifycont").style.animation = "popin 0.3s ease-in-out forwards";
    document.getElementById("textcont1").style.animation = "fadeout 0.5s 0.8s reverse forwards";

    document.getElementById("notifycont").addEventListener('animationend', function(event) {
        if (event.animationName == "popin") {
            document.getElementById("notifycont").style.animation = "moveright 0.5s ease-in-out forwards";
        } else if (event.animationName == "moveright") {
            if (config.rarescreenshot == "true") {
                document.getElementById("notifycont").style.borderRadius = ssborderradius;
            } else {
                document.getElementById("notifycont").style.borderRadius = borderradius;
            }
            document.getElementById("screenshot").style.animation = "width 0.3s 0.02s ease-in-out forwards";
            document.getElementById("notifycont").style.animation = "revealleft 0.3s ease-in-out forwards";
        } else if (event.animationName == "revealleft") {
            document.getElementById("notifycont").style.animation = "animpause " + ((pause * 0.001) + add) + "s linear forwards";
        } else if (event.animationName == "animpause") {
            document.getElementById("icon1").style.animation = "fadeout 0.3s ease-in-out forwards";
            document.getElementById("outlinecont").style.animation = "fadeout 0.3s ease-in-out forwards";
            document.getElementById("text").style.animation = "fadeout 0.3s ease-in-out forwards";
            document.getElementById("desccont").style.animation = "moveleft 0.5s forwards";
        }
    });

    document.getElementById("desccont").addEventListener('animationend', function(event) {
        if (event.animationName == "moveleft") {
            if (config.rarescreenshot == "true") {
                document.getElementById("desccont").style.borderRadius = ssborderradius;
            } else {
                document.getElementById("desccont").style.borderRadius = borderradius;
            }
            document.getElementById("desccont").style.animation = "revealright 0.3s ease-in-out forwards";
            document.getElementById("textcont2").style.animation = "slideinleft 0.3s ease-in-out forwards";
        } else if (event.animationName == "revealright") {
            document.getElementById("notifycont").style.opacity = "0";
            document.getElementById("desccont").style.animation = "animpause1 " + ((pause * 0.001) + add) + "s linear forwards";
        } else if (event.animationName == "animpause1") {
            document.getElementById("desccont").style.animation = "revealrightrev 0.5s ease-in-out forwards";
            document.getElementById("textcont2").style.animation = "slideoutleft 0.3s ease-in-out forwards";
            document.getElementById("screenshot").style.transform = "translateX(0%)";
            document.getElementById("screenshot").style.animation = "widthrev 0.5s ease-in-out forwards";
        } else if (event.animationName == "revealrightrev") {
            document.getElementById("desccont").style.animation = "slideup 0.2s ease-in forwards";
            document.getElementById("screenshot").style.animation = "shrinkdown 0.2s ease-in forwards";
        }
    });
}

function PlayFastNotification(add) {
    document.getElementById("text").outerHTML = "<div id='text' style='font-size: 12px'>" + title + "<br><span style='font-size: 10px'>" + desc + "</span></div>";

    document.getElementById("notifycont").style.animation = "popin 0.3s ease-in-out forwards";
    document.getElementById("textcont1").style.animation = "fadeout 0.5s 0.8s reverse forwards";

    document.getElementById("notifycont").addEventListener('animationend', function(event) {
        if (event.animationName == "popin") {
            document.getElementById("notifycont").style.animation = "moveright 0.5s ease-in-out forwards";
        } else if (event.animationName == "moveright") {
            if (config.rarescreenshot == "true") {
                document.getElementById("notifycont").style.borderRadius = ssborderradius;
            } else {
                document.getElementById("notifycont").style.borderRadius = borderradius;
            }
            document.getElementById("screenshot").style.animation = "width 0.3s ease-in-out forwards";
            document.getElementById("notifycont").style.animation = "revealleft 0.3s ease-in-out forwards";
        } else if (event.animationName == "revealleft") {
            document.getElementById("notifycont").style.animation = "animpause " + ((pause * 0.001) + add) + "s linear forwards";
        } else if (event.animationName == "animpause") {
            document.getElementById("icon1").style.animation = "fadeout 0.3s ease-in-out forwards";
            document.getElementById("outlinecont").style.animation = "fadeout 0.3s ease-in-out forwards";
            document.getElementById("text").style.animation = "fadeout 0.3s ease-in-out forwards";
            document.getElementById("notifycont").style.opacity = 0;
            document.getElementById("notifycont").style.transition = "0.5s";
            document.getElementById("desccont").style.animation = "moveleft 0.5s forwards";
            document.getElementById("screenshot").style.transform = "translateX(0%)";
            document.getElementById("screenshot").style.animation = "widthrev 0.5s forwards";
        }
    });

    document.getElementById("desccont").addEventListener('animationstart', function(event) {
        if (event.animationName == "moveleft") {
            if (config.rarescreenshot == "true") {
                setTimeout(function() {
                    document.getElementById("desccont").style.transition = "0.3s";
                    document.getElementById("desccont").style.borderRadius = ssborderradius;
                }, 200)
            } else {
                document.getElementById("desccont").style.borderRadius = borderradius;
            }
        }
    });

    document.getElementById("desccont").addEventListener('animationend', function(event) {
        document.getElementById("desccont").style.animation = "slideup 0.2s ease-in forwards";
        document.getElementById("screenshot").style.animation = "shrinkdown 0.2s ease-in forwards";
    });
}

function PlaySuperFastNotification(add) {
    document.getElementById("text").outerHTML = "<div id='text' style='font-size: 12px'>" + title + "<br><span style='font-size: 10px'>" + desc + "</span></div>";

    document.getElementById("notifycont").style.animation = "popin 0.2s ease-in-out forwards";
    document.getElementById("textcont1").style.animation = "fadeout 0.3s 0.6s reverse forwards";

    document.getElementById("notifycont").addEventListener('animationend', function(event) {
        if (event.animationName == "popin") {
            document.getElementById("notifycont").style.animation = "moveright 0.3s ease-in-out forwards";
        } else if (event.animationName == "moveright") {
            if (config.rarescreenshot == "true") {
                document.getElementById("notifycont").style.borderRadius = ssborderradius;
            } else {
                document.getElementById("notifycont").style.borderRadius = borderradius;
            }
            document.getElementById("screenshot").style.animation = "width 0.1s ease-in-out forwards";
            document.getElementById("notifycont").style.animation = "revealleft 0.1s ease-in-out forwards";
        } else if (event.animationName == "revealleft") {
            document.getElementById("notifycont").style.animation = "animpause " + ((pause * 0.001) + add) + "s linear forwards";
        } else if (event.animationName == "animpause") {
            document.getElementById("icon1").style.animation = "fadeout 0.1s ease-in-out forwards";
            document.getElementById("outlinecont").style.animation = "fadeout 0.1s ease-in-out forwards";
            document.getElementById("text").style.animation = "fadeout 0.1s ease-in-out forwards";
            document.getElementById("notifycont").style.opacity = 0;
            document.getElementById("notifycont").style.transition = "0.3s";
            document.getElementById("desccont").style.animation = "moveleft 0.3s forwards";
            document.getElementById("screenshot").style.transform = "translateX(0%)";
            document.getElementById("screenshot").style.animation = "widthrev 0.3s forwards";
        }
    });

    document.getElementById("desccont").addEventListener('animationend', function(event) {
        if (event.animationName == "moveleft") {
            if (config.rarescreenshot == "true") {
                document.getElementById("desccont").style.borderRadius = ssborderradius;
            } else {
                document.getElementById("desccont").style.borderRadius = borderradius;
            }
        }
        document.getElementById("desccont").style.animation = "slideup 0.1s ease-in forwards";
        document.getElementById("screenshot").style.animation = "shrinkdown 0.1s ease-in forwards";
    });
}

var displaytime = config.raredisplaytime;

if (displaytime == 15) {
    PlayNotification(6.19)
} else if (displaytime == 14) {
    PlayNotification(5.69)
} else if (displaytime == 13) {
    PlayNotification(5.19)
} else if (displaytime == 12) {
    PlayNotification(4.69)
} else if (displaytime == 11) {
    PlayNotification(4.19)
} else if (displaytime == 10) {
    PlayNotification(3.69)
} else if (displaytime == 9) {
    PlayNotification(3.19)
} else if (displaytime == 8) {
    PlayNotification(2.69)
} else if (displaytime == 7) {
    PlayNotification(2.19)
} else if (displaytime == 6) {
    PlayNotification(1.69)
} else if (displaytime == 5) {
    PlayNotification(1.19)
} else if (displaytime == 4) {
    PlayFastNotification(2.19)
} else if (displaytime == 3) {
    PlaySuperFastNotification(2.08)
} else if (displaytime == 2) {
    PlaySuperFastNotification(1.08)
}

ipcRenderer.on('pausenotify', function() {
    document.getElementById("notifycont").style.animationPlayState = "paused";
    document.getElementById("textcont1").style.animationPlayState = "paused";
    document.getElementById("screenshot").style.animationPlayState = "paused";
    document.getElementById("icon1").style.animationPlayState = "paused";
    document.getElementById("text").style.animationPlayState = "paused";
    document.getElementById("desccont").style.animationPlayState = "paused";
    document.getElementById("textcont2").style.animationPlayState = "paused";
});

ipcRenderer.on('playnotify', function() {
    document.getElementById("notifycont").style.animationPlayState = "running";
    document.getElementById("textcont1").style.animationPlayState = "running";
    document.getElementById("screenshot").style.animationPlayState = "running";
    document.getElementById("icon1").style.animationPlayState = "running";
    document.getElementById("text").style.animationPlayState = "running";
    document.getElementById("desccont").style.animationPlayState = "running";
    document.getElementById("textcont2").style.animationPlayState = "running";
});
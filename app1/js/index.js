// JavaScript Document
function id(obj) {
    return document.querySelector('#' + obj);
}

function view() {
    return {
        h: document.documentElement.clientHeight,
        w: document.documentElement.clientWidth,
    }
}

function fnLoad() {
    let iTime = new Date().getTime();
    let oW = id('welcome');
    let oTime = false;
    let oTimer = null;

    bind(oW, 'transitionend', fn);

    oTimer = setInterval(function () {
        if (new Date().getTime() - iTime > 6000) {
            oTime = true;
        }
        if (oTime) {
            oW.style.opacity = 0;
            clearInterval(oTimer);
        }
    }, 1000);

    function fn() {
        removeClass(oW, 'pageshow');
        fnTab();
        score();
    }

}
function fnTab() {
    let oTab = document.querySelector('.tabPic .picList');
    let oNav = document.querySelector('.tabPic .picMask nav');
    let aNav = oNav.querySelectorAll('a');
    let nowI = 0;
    let lastI = 0;
    let startX = 0;
    let iX = 0;
    let oTimer = null;
    let moveX = view().w;

    bind(oTab, 'touchstart', start);
    bind(oTab, 'touchmove', move);
    bind(oTab, 'touchend', end);

    auto();


    function auto() {
        oTimer = setInterval(function () {
            nowI++;
            nowI %= aNav.length;
            tab();
            navs();
        }, 4000)
    }

    function tab() {
        iX = -moveX * nowI;
        oTab.style.transition = '1s';
        oTab.style.transform = 'translateX(' + iX + 'px)';
    }

    function navs() {
        removeClass(aNav[lastI], 'active');
        addClass(aNav[nowI], 'active');
        lastI = nowI;
    }

    function start(ev) {
        clearInterval(oTimer);
        oTab.style.transition = '0s';
        ev = ev.changedTouches[0];
        startX = ev.pageX;
    }

    function move(ev) {
        ev = ev.changedTouches[0];
        let disX = ev.pageX - startX;
        oTab.style.transform = 'translateX(' + (iX + disX) + 'px)';
        nowI = Math.round(Math.abs(iX + disX) / moveX);
        if (iX == 0 && disX > 0 && nowI == 1) {
            nowI = 0;
        }
    }


    function end(ev) {
        if (nowI == aNav.length) {
            nowI--;
        }
        tab();
        navs();
        auto();
    }
}

function score() {
    let aNavs = document.querySelectorAll('#score .scoreList nav');
    let arr = ["好失望", "没有想象的那么差", "很一般", "良好", "棒极了"];

    for (let i = 0; i < aNavs.length; i++) {
        const ele = aNavs[i];
        fnScore(ele);
    }

    function fnScore(obj) {
        let oInput = obj.nextElementSibling;
        let stars = obj.querySelectorAll('a');
        for (let i = 0; i < stars.length; i++) {
            const element = stars[i];
            element.index = i;
            bind(element, 'touchstart', function (ev) {
                oInput.value = arr[this.index];
                for (let l = 0; l < stars.length; l++) {
                    if (l <= this.index) {
                        addClass(stars[l], 'active');
                    } else {
                        removeClass(stars[l], 'active');
                    }
                }
            });
        }
    }

    submit();

}

function submit() {
    let oIndex = document.querySelector('#index');
    let oSubmit = id('submit');
    let oP = id('info');
    let flag = true;

    bind(oSubmit, 'touchend', fnEnd);

    function fnEnd() {
        flag = check();
        if (!flag) {
            info(oP, '请给景区评分');
        } else {
            if (!isTag()) {
                info(oP, '请给景区添加标签');
            } else {
                indexOut();
            }
        }
    }

    function check() {
        let aInput = oIndex.querySelectorAll('#score input');

        for (let i = 0; i < aInput.length; i++) {
            const ele = aInput[i];
            if (ele.value === '0') {
                return false;
            }
        }
        return true;
    }

    function isTag() {
        let tag = id('tag');
        let aInput = tag.querySelectorAll('input');
        for (let i = 0; i < aInput.length; i++) {
            const ele = aInput[i];
            if (ele.checked) {
                return true;
            }
        }
        return false;
    }


}
function info(obj, infos) {
    obj.innerHTML = infos;
    obj.style.transform = 'scale(1)';
    obj.style.opacity = 1;
    setTimeout(function () {
        obj.style.transform = 'scale(0)';
        obj.style.opacity = 0;

    }, 2000);
}

function indexOut() {
    let oMask = id('mask');
    let index = id('index');
    let oNews = id('news');

    addClass(oMask, 'pageshow');
    addClass(oNews, 'pageshow');

    news();

    setTimeout(function () {
        oMask.style.opacity = 1;
        index.style.filter = 'blur(5px)';
    }, 10);

    setTimeout(function () {
        oMask.style.opacity = 0;
        oNews.style.opacity = 1;
        index.style.filter = 'blur(0px)';
        removeClass(oMask, 'pageshow');
    }, 400);


}

function news() {
    let info1 = id('info1');
    let oNews = id('news');
    let aInput = oNews.querySelectorAll('input');

    aInput[0].onchange = function () {
        if (this.files[0].type.split('/')[0] == 'video') {
        } else {
            info(info1, '请上传视频');
        }
        this.value = '';
    }

    aInput[1].onchange = function () {
        if (this.files[0].type.split('/')[0] == 'image') {
            newsOut();
        } else {
            info(info1, '请上传图片');
        }
        this.value = '';
    }
}

function newsOut() {
    let news = id('news');
    let oForm = id('form');
    addClass(oForm, 'pageshow');
    news.style.cssText = '';
    removeClass(news, 'pageshow');

    formIn();
}

function formIn() {
    let oForm = id('form');
    let over = id('over');
    let tag1 = id('tag1');
    let aTags = tag1.querySelectorAll('span');
    let oSubmit = oForm.querySelector('button');
    let btn = false;

    for (let i = 0; i < aTags.length; i++) {
        const ele = aTags[i];
        bind(ele, 'touchend', function () {
            removeClass(oSubmit, 'submit');
            btn = true;
        })
    }

    bind(oSubmit, 'touchend', function () {
        if (btn) {
            for (let i = 0; i < aTags.length; i++) {
                const ele = aTags[i];
                ele.previousElementSibling.checked = false;

            }
            addClass(over, 'pageshow');
            addClass(oSubmit, 'submit');
            removeClass(oForm, 'pageshow');
            btn = false;
            fnOver();
        }
    })

}

function fnOver() {
    let over = id('over');
    let oBtn = over.querySelector('input');

    bind(oBtn, 'touchend', function () {
        removeClass(over, "pageshow");
    });
}

function bind(obj, ev, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function () {
            fn.call(obj);
        })
    }
}

function removeClass(obj, sClass) {
    let aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (let i = 0; i < aClass.length; i++) {
        const oClass = aClass[i];
        if (oClass === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

function addClass(obj, sClass) {
    let aClass = obj.className.split(' ');

    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (let i = 0; i < aClass.length; i++) {
        const ele = aClass[i];
        if (ele == sClass) {
            return;
        }
    }

    obj.className += ' ' + sClass;
}


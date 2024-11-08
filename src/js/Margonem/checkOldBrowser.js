function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

function supportsArrowFunction() {
    try {
        new Function('(a) => a');
        return true;
    } catch (e) {
        return false;
    }
}

function supportsSpread() {
    try {
        new Function('a', 'b', 'return { ...a, ...b}');
        return true;
    } catch (e) {
        return false;
    }
}

if ((!supportsArrowFunction() || !supportsSpread()) && __build.lang === 'pl') { //if not supported arrow function or spread operator and lang is PL -> move to SI
    var ddd = new Date();
    ddd.setTime(ddd.getTime() + 3600000 * 24 * 30);
    setCookie('interface', 'si', ddd, '/', 'margonem.pl');
    window.location.reload();
}
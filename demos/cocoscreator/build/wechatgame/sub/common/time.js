export function getCurrTime() {
    return parseInt(+new Date() / 1000);
}

export function deepCopy(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch(e) {
        return obj;
    }
}

function isLeapYear(year) {
    if ( year == undefined ) {
        return null; }

    if ( year % 4 == 0 && year % 100 != 0 || year % 400 == 0 ) {
        return 1;
    }

    return 0;
}

function getMonthLastDay(year, month) {
    if ( year == undefined || month == undefined ) {
        return null;
    }

    var list = [];

    list[0] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 闰年
    list[1] = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    while ( month < 0 ) {
        year -= 1;
        month += 12;
    }

    return list[isLeapYear(year)][month];
}

export function getSomeDaysBefore(someDays, time = undefined) {
    if ( someDays == undefined ) {
        someDays = 0;
    }
    var t = 0;
    if (time == undefined || time == null) {
        t = new Date();
    } else {
        t = new Date(time);
    }

    var newT = new Date(t.getTime() - someDays * 24 * 3600 * 1000);

    var year = newT.getFullYear();
    var month = newT.getMonth();
    var day = newT.getDate();

    return {
        ms: +new Date(year, month, day),
        s: parseInt(+new Date(year, month, day) / 1000),
    }
}

export function getMonday(time) {      //当前时间的上一周周一
    var t = 0;
    var curr = 0;
    if (time == undefined || time == null) {
        t = new Date();
        curr = t.getTime();
    } else {
        t = new Date(time);
        curr = deepCopy(time);
    }
    var interval = (t.getDay() == 0 ? 6 : t.getDay());
    return getSomeDaysBefore(interval, curr);
}

export function getLastSunday(time) {   //当前时间的上一周周日
    var t = 0;
    var curr = 0;
    if (time == undefined || time == null) {
        t = new Date();
        curr = t.getTime();
    } else {
        t = new Date(time);
        curr = deepCopy(time);
    }

    var interval = t.getDay() == 0 ? 7 : t.getDay();
    return getSomeDaysBefore(interval, curr);
}

// 获取某个月前的第一天
export function getFirstDayOfSomeMonthsBefore(someMonths, time) {
    if (someMonths == undefined) {
        someMonths = 0;
    }

    var t = 0;
    if (time == undefined || time == null) {
        t = new Date();
    } else {
        t = new Date(time);
    }
    var year = t.getFullYear();
    var month = t.getMonth() - someMonths;

    while (month < 0) {
        year -= 1;
        month += 12;
    }

    while ( month > 11) {
        year += 1;
        month -= 12;
    }
    var day = 1;
    return {
        ms: +new Date(year, month, day),
        s: parseInt(+new Date(year, month, day) / 1000),
    }
}

// 获取某个月前的最后一天
export function getLastDayOfSomeMonthsBefore(someMonths, time) {
    if (someMonths == undefined) {
        someMonths = 0;
    }
    var t = 0;
    if (time == undefined || time == null) {
        t = new Date();
    } else {
        t = new Date(time);
    }
    var year = t.getFullYear();
    var month = t.getMonth() - someMonths;

    while (month < 0) {
        year -= 1;
        month += 12;
    }
    var day = getMonthLastDay(year, month);

    return {
        ms: +new Date(year, month, day),
        s: parseInt(+new Date(year, month, day) / 1000),
    }
}


/**
 * 日付のフォーマット変換関数
 * @param {変換したい日付データ}} date 
 * @param {指定したいフォーマット} format 
 * @param {AM/PM表記にするかどうかを指定} is12hours 
 */

export default function DateFormat(date, format, is12hours) {
    date = new Date(date);
    let weekday = ["日", "月", "火", "水", "木", "金", "土"];
    if (!format) {
        format = 'YYYY年MM月DD日(WW) hh時mm分'
    }
    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    let day = date.getDate();
        weekday = weekday[date.getDay()];
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let secounds = date.getSeconds();

    let ampm = hours < 12 ? 'AM' : 'PM';
    if (is12hours) {
        hours = hours % 12;
        hours = (hours != 0) ? hours : 12; // 0時は12時と表示する
    }

    let replaceStrArray =
        {
            'YYYY': year,
            'Y': year,
            'MM': ('0' + (month)).slice(-2),
            'M': month,
            'DD': ('0' + (day)).slice(-2),
            'D': day,
            'WW': weekday,
            'hh': ('0' + hours).slice(-2),
            'h': hours,
            'mm': ('0' + minutes).slice(-2),
            'm': minutes,
            'ss': ('0' + secounds).slice(-2),
            's': secounds,
            'AP': ampm,
        };

    let replaceStr = '(' + Object.keys(replaceStrArray).join('|') + ')';
    let regex = new RegExp(replaceStr, 'g');

    const ret = format.replace(regex, function (str) {
        return replaceStrArray[str];
    });

    return ret;
}
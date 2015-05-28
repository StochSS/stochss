var _ = require('underscore');

// Taken from: http://web.archive.org/web/20130826203933/http://my.opera.com/GreyWyvern/blog/show.dml/1671288

var alphaNum = function (a, b) {
    function chunkify(t) {
        var tz = [], x = 0, y = -1, n = 0, i, j;
        
        while (i = (j = t.charAt(x++)).charCodeAt(0)) {
            var m = (i == 46 || (i >=48 && i <= 57));
            if (m !== n) {
                tz[++y] = "";
                n = m;
            }
            tz[y] += j;
        }
        return tz;
    }
    
    var aa = chunkify(a.toLowerCase());
    var bb = chunkify(b.toLowerCase());
    
    for (x = 0; aa[x] && bb[x]; x++) {
        if (aa[x] !== bb[x]) {
            var c = Number(aa[x]), d = Number(bb[x]);
            if (c == aa[x] && d == bb[x]) {
                return c - d;
            } else return (aa[x] > bb[x]) ? 1 : -1;
        }
    }
    return aa.length - bb.length;
}

var alphaNumByName = function (a, b) {
    return alphaNum(a.name, b.name);
}

module.exports = {
    alphaNum : alphaNum,
    alphaNumByName : alphaNumByName
};

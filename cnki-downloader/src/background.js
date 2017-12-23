// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


function _classCallCheck (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var cnki_download = null;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('background.js got a message', request);
        switch (request.action) {
            case 'download':
                if (cnki_download === null)
                    cnki_download = new cnki();
                cnki_download.GetArticle(request.dbCode, request.fileName);
                sendResponse({ ret: 'download' });
                break;
            case 'close':
                chrome.tabs.remove(request.tabId);
                sendResponse({ ret: 'close' });
                break;
            default:
                sendResponse({ ret: 'undefined action' });
                break;
        }
    }
);

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        console.log('background.js got a external message', request);
        switch (request.action) {
            case 'close':
                chrome.tabs.remove(request.tabId);
                sendResponse({ ret: 'close' });
                break;
            default:
                sendResponse({ ret: 'undefined action' });
                break;
        }
    }
);

console.log('extension injected!');


var sha1 = function () {
    /*
    *   A   JavaScript   implementation   of   the   Secure   Hash   Algorithm,   SHA-1,   as   defined
    *   in   FIPS   PUB   180-1
    *   Version   2.1-BETA   Copyright   Paul   Johnston   2000   -   2002.
    *   Other   contributors:   Greg   Holt,   Andrew   Kepert,   Ydnar,   Lostinet
    *   Distributed   under   the   BSD   License
    *   See   http://pajhome.org.uk/crypt/md5   for   details.
    */
    /*
     *   Configurable   variables.   You   may   need   to   tweak   these   to   be   compatible   with
     *   the   server-side,   but   the   defaults   work   in   most   cases.
     */
    var hexcase = 0;
    /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
    var b64pad = '';
    /*   base-64   pad   character.   "="   for   strict   RFC   compliance       */
    var chrsz = 8;
    /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */

    /*
     *   These   are   the   functions   you'll   usually   want   to   call
     *   They   take   string   arguments   and   return   either   hex   or   base-64   encoded   strings
     */
    function hex_sha1 (s) {
        return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
    }

    function b64_sha1 (s) {
        return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
    }

    function str_sha1 (s) {
        return binb2str(core_sha1(str2binb(s), s.length * chrsz));
    }

    function hex_hmac_sha1 (key, data) {
        return binb2hex(core_hmac_sha1(key, data));
    }

    function b64_hmac_sha1 (key, data) {
        return binb2b64(core_hmac_sha1(key, data));
    }

    function str_hmac_sha1 (key, data) {
        return binb2str(core_hmac_sha1(key, data));
    }

    /*
     *   Perform   a   simple   self-test   to   see   if   the   VM   is   working
     */
    function sha1_vm_test () {
        return hex_sha1('abc') === 'a9993e364706816aba3e25717850c26c9cd0d89d';
    }

    /*
     *   Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length
     */
    function core_sha1 (x, len) {
        /*   append   padding   */
        x[len >> 5] |= 0x80 << 24 - len % 32;
        x[(len + 64 >> 9 << 4) + 15] = len;

        var w = new Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;

            for (var j = 0; j < 80; j++) {
                if (j < 16) w[j] = x[i + j]; else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                e = d;
                d = c;
                c = rol(b, 30);
                b = a;
                a = t;
            }

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
            e = safe_add(e, olde);
        }
        return [a, b, c, d, e];
    }

    /*
     *   Perform   the   appropriate   triplet   combination   function   for   the   current
     *   iteration
     */
    function sha1_ft (t, b, c, d) {
        if (t < 20) return b & c | ~b & d;
        if (t < 40) return b ^ c ^ d;
        if (t < 60) return b & c | b & d | c & d;
        return b ^ c ^ d;
    }

    /*
     *   Determine   the   appropriate   additive   constant   for   the   current   iteration
     */
    function sha1_kt (t) {
        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    }

    /*
     *   Calculate   the   HMAC-SHA1   of   a   key   and   some   data
     */
    function core_hmac_sha1 (key, data) {
        var bkey = str2binb(key);
        if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

        var ipad = new Array(16),
            opad = new Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
        return core_sha1(opad.concat(hash), 512 + 160);
    }

    /*
     *   Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally
     *   to   work   around   bugs   in   some   JS   interpreters.
     */
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xFFFF;
    }

    /*
     *   Bitwise   rotate   a   32-bit   number   to   the   left.
     */
    function rol (num, cnt) {
        return num << cnt | num >>> 32 - cnt;
    }

    /*
     *   Convert   an   8-bit   or   16-bit   string   to   an   array   of   big-endian   words
     *   In   8-bit   function,   characters   >255   have   their   hi-byte   silently   ignored.
     */
    function str2binb (str) {
        var bin = [];
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 24 - i % 32;
        }
        return bin;
    }

    /*
     *   Convert   an   array   of   big-endian   words   to   a   string
     */
    function binb2str (bin) {
        var str = '';
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz) {
            str += String.fromCharCode(bin[i >> 5] >>> 24 - i % 32 & mask);
        }
        return str;
    }

    /*
     *   Convert   an   array   of   big-endian   words   to   a   hex   string.
     */
    function binb2hex (binarray) {
        var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
        var str = '';
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 0xF);
        }
        return str;
    }

    /*
     *   Convert   an   array   of   big-endian   words   to   a   base-64   string
     */
    function binb2b64 (binarray) {
        var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var str = '';
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (binarray[i >> 2] >> 8 * (3 - i % 4) & 0xFF) << 16 | (binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4) & 0xFF) << 8 | binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4) & 0xFF;
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += b64pad; else str += tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
            }
        }
        return str;
    }

    return {
        hex_sha1: hex_sha1
    };
}();
var cnki = function cnki () {
    var _this = this;

    _classCallCheck(this, cnki);

    this.authInfo = {
        username: "voidpointer",
        password: "voidpointer",
        login: false
    };

    this.base64 = function (arr) {
        if (typeof Buffer !== 'undefined') return Buffer.from(arr).toString('base64');
        return btoa(arr.map(function (e) {
            return String.fromCharCode(e);
        }).join(''));
    };

    this.Auth = function (callback) {

        var appKey = "2isdlw";
        var appId = "cnkimdl_clcn";
        var encryptKey = 'jds)(#&dsa7SDNJ32hwbds%u32j33edjdu2@**@3w';
        var requestURL = "http://api.cnki.net/OAuth/OAuth/Token";

        //
        // calculate params
        //
        var encPassData = [];
        var bArray1 = _this.authInfo.password;
        var bArray2 = encryptKey;
        for (var i = 0; i < bArray1.length; i++) {
            encPassData[i] = bArray1.charCodeAt(i) ^ bArray2.charCodeAt(i % bArray2.length);
        }
        var encPass = _this.base64(encPassData) + '\n';

        var sign = String(Date.now());

        var secureKey = sha1.hex_sha1(sign + appKey);

        console.log(secureKey);

        var authInfo = 'grant_type=password';
        authInfo += '&username=' + encodeURIComponent(_this.authInfo.username);
        authInfo += '&password=' + encodeURIComponent(encPass);
        authInfo += '&client_id=' + encodeURIComponent(appId);
        authInfo += '&client_secret=' + encodeURIComponent(secureKey);
        authInfo += '&sign=' + encodeURIComponent(sign);

        $.ajax({
            url: 'http://api.cnki.net/OAuth/OAuth/Token',
            type: 'POST',
            data: authInfo,
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function success (ret) {
                console.log('login', ret);
                $.ajaxSetup({
                    beforeSend: function beforeSend (xhr) {
                        xhr.setRequestHeader('Authorization', ret.token_type + ' ' + ret.access_token);
                    }
                });
                _this.authInfo.login = true;
                callback && callback();
            },
            error: function error (xhr, _error, info) {
                console.error('Auth', xhr, _error, info);
                alert('插件登录失败!');
            },
            timeout: function timeout () {
                alert('插件登录超时!');
            }
        });
    };

    this.GetArticle = function (category, file) {
        var login = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (!_this.authInfo.login && login) {
            _this.Auth(function () {
                _this.GetArticle(category, file, false);
            });
            return;
        }
        $.ajax({
            url: 'http://api.cnki.net/file/' + category + '/' + file + '/download',
            type: 'GET',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function success (ret) {
                // cnki://oversea.d.cnki.net/DocService/padDoc.ashx?op=download&db=mastertheses&name=%e5%af%86%e7%a0%81%e5%ad%a6%e5%9c%a8%e7%bd%91%e7%bb%9c%e4%bf%a1%e6%81%af%e5%ae%89%e5%85%a8%e6%8a%80%e6%9c%af%e4%b8%ad%e7%9a%84%e5%ba%94%e7%94%a8%e7%a0%94%e7%a9%b6&fn=2005012953.nh&file=5JHSqpVb2BlUXdWZvB1VZRney12YxtCUOpVbJF1TRhGOix2Lv8Gbnh2NFx0cNZ2MvgHSaBjZjVVZTRlQaFWNjFmb4F3UFdHMwsGbttkcVJDN4hkR212YmNHehRERKZHd90zdqBXRyE2ZOJEb4Z2VNh1TpN2ZsJ1crYDMyd0Sx0Ga0c0LQFmWClGNRd2c3cjahZ0dJp2VsVWaS9WMN90ZUlzQ5hnTsdnSoVTMVRFUSFzVLZjQnd0Nx9WSVBjczEWe
                console.log('GetArticle success', ret);
                if (ret.indexOf('cnki') === -1) {
                    alert('获取下载地址失败!');
                    return;
                }
                var url = ret.replace('cnki:', 'http:');
                //window.open(url, '_blank');
                _this.GetDownload(url);
            },
            error: function error (xhr, _error2, info) {
                console.error('GetArticle', xhr, _error2, info);
                alert('获取下载地址失败!');
            },
            timeout: function timeout () {
                alert('获取下载地址超时!');
            }
        });
    };

    this.GetDownload = function (url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'xml',
            beforeSend: function beforeSend (xhr) {
                xhr.setRequestHeader('Request-Action', 'FileInfo');
            },
            success: function success (ret) {
                console.log('GetDownload', ret);
                _this.Download($(ret).find('url:first').text(), $(ret).find('filename').text());
            },
            error: function error (xhr, _error3, info) {
                console.error('GetDownload', xhr, _error3, info);
                alert('解析下载地址失败!');
            },
            timeout: function timeout () {
                alert('解析下载地址超时!');
            }
        });
    };

    this.Download = function (url, fileName) {
        _openWithHeader({
            url: url,
            method: 'GET',
            headers: { 'Accept-Range': 'bytes=0', 'Content-Type': 'application/octet-stream' }
        })
    }
};

var needInjectTabIds = [];
var needInjectOptions = {};

function _openWithHeader (options) {
    chrome.tabs.create(
        { url: chrome.runtime.getURL('src/helper/redirect.html') },
        function (tab) {
            options.tabId = tab.id;
            needInjectTabIds.push(tab.id);
            needInjectOptions[tab.id] = options;

            console.log('tab.id', tab.id, options.url);

            var handler = function (tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(handler);
                    chrome.tabs.sendMessage(tabId, options);
                }
            };

            // in case we're faster than page load (usually):
            chrome.tabs.onUpdated.addListener(handler);

            // just in case we're too late with the listener:
            chrome.tabs.sendMessage(tab.id, options);
        }
    );
    return true;
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        var index = needInjectTabIds.indexOf(details.tabId);
        if (index > -1) {
            var headers = needInjectOptions[details.tabId].headers;
            needInjectTabIds.splice(index, 1);
            delete needInjectOptions[details.tabId];

            for (var key in headers) {
                if (headers.hasOwnProperty(key))
                    modifyHeader(details.url, details.requestHeaders, key, headers[key]);
            }
            console.log(details);
            setTimeout(function () { // very bad method !!
                chrome.tabs.remove(details.tabId);
            }, 5000);
            return { requestHeaders: details.requestHeaders };
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ['*://*/*'] },
    ['blocking', 'requestHeaders']
);

function modifyHeader (_url, headers, name, value) {

    if (name.toLocaleLowerCase() === 'cookie') {
        var url = new URL(_url);
        var arr = value.split(';');
        for (var c = 0; c < arr.length; c++) {
            var line = arr[c].split('=');
            if (line.length === 2) {
                chrome.cookies.set({
                    'url': url.origin,
                    'domain': url.hostname,
                    'name': line[0].trim(),
                    'value': line[1]
                }, function (cookie) {
                    console.log(JSON.stringify(cookie));
                });
            }
        }

    }
    for (var i = 0; i < headers.length; i++) {
        if (headers[i].name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
            headers[i].value = value;
            return;
        }
    }
    headers.push({ name: name, value: value });
}

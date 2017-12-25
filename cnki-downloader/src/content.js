// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


// load button
var insertBtn = function insertBtn () {
    if (typeof $ !== 'undefined' && window && window.frames && window.frames['iframeResult']) {

        var lines = $(window.frames['iframeResult'].document).find('.GridTableContent tr');
        lines.each(function () {
            if (!$(this).find('.fz14').length) return;
            var a = $(this).find('.fz14:first');
            if (a.attr('inserted') === '1') return;
            var url = a.attr('href');
            ///kns/detail/detail.aspx?QueryID=4&CurRec=1&recid=&FileName=1016009115.nh&DbName=CDFDLAST2017&DbCode=CDFD&yx=&pr=&URLID=
            if (!url || url.indexOf('FileName=') === -1) return;
            var fileName = url.match(/FileName=(.+?)&/)[1];
            var dbCode = url.match(/DbCode=(.+?)&/)[1];
            dbCode = {
                CLFQ: 'literatures', //文献
                //CJFQ: 'journals', //期刊
                CDFD: 'doctortheses', //博士
                CMFD: 'mastertheses', //硕士
                CCFD: 'conferences', //会议
                //CCND: 'newspapers', // 报纸
                //SCPD: '',//中国专利
                //CPFD: '',//中国会议
            }[dbCode];
            //a.before('<a class="briefDl_Y" target="_blank" onclick="window.cnki.GetArticle(\'' + dbCode + '\', \'' + fileName + '\')"></a>');

            if(dbCode){
                var link_dom = document.createElement('a');
                link_dom.setAttribute('class', 'briefDl_Y');
                link_dom.addEventListener('click', function () {

                    chrome.runtime.sendMessage(
                        { action: 'download', dbCode: dbCode, fileName: fileName },
                        function (response) {
                            console.log('response', response);
                        }
                    );


                });
                var a_node = a.get(0);
                a_node.parentElement.insertBefore(link_dom, a_node);
            }


            a.attr('inserted', '1');
            console.log('btn inserted! ' + a.text());
        });
    }
    setTimeout(insertBtn, 1000);
};
insertBtn();



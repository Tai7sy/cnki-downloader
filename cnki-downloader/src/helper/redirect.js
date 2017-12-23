/**
 * According to Issue 91191, we can't modify form data in chrome extension now.
 * so we can post like this
 */
var onMessageHandler = function (message) {
    // Ensure it is run only once, as we will try to message twice
    chrome.runtime.onMessage.removeListener(onMessageHandler);

    // code from https://stackoverflow.com/a/7404033/934239
    var form = document.createElement('form');
    form.style = 'position: absolute;width: 1;height: 1;display: block;overflow: hidden;';
    form.setAttribute('method', message.method);
    form.setAttribute('action', message.url);

    if (message.method.toLocaleLowerCase() === 'get') {
        location.href = message.url;
        return;
    }

    function appendString (name, val) {
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        field.setAttribute('name', name);
        field.setAttribute('value', val);
        form.appendChild(field);
    }

    function appendArray (name, val_arr) {
        for (var key in val_arr) {
            if (val_arr.hasOwnProperty(key)) {
                if (typeof val_arr[key] === 'object') {
                    appendArray(name + '[]', val_arr[key]);
                } else {
                    var field = document.createElement('input');
                    field.setAttribute('type', 'checkbox');
                    field.setAttribute('checked', 'true');
                    field.setAttribute('name', name);
                    field.setAttribute('value', val_arr[key]);
                    form.appendChild(field);
                }
            }
        }
    }

    for (var key in message.data) {
        if (!message.data.hasOwnProperty(key)) continue;
        if (typeof message.data[key] === 'object') {
            appendArray(key + '[]', message.data[key]);
        } else {
            appendString(key, message.data[key]);
        }
    }
    document.body.appendChild(form);
    form.submit();

    /* TODO don't work
    chrome.runtime.sendMessage(
        'cccdmmlingochekibhmehflapndcdmhf',
        { action: 'close', tabId:  message.tabId}
    );
    chrome.runtime.sendMessage(
        { action: 'close', tabId:  message.tabId}
    );
    */
};

chrome.runtime.onMessage.addListener(onMessageHandler);

//ChromeとBrowserの名前空間対策
if (!("browser" in window)) {
    window.browser = chrome;
}


//EventHandler when page loaded.
function initOnLoadCompleted(e) {
    //add handler to event that receive message from popup page.
    browser.runtime.onMessage.addListener((message) => {
        switch (message.command) {
            case 'getSelectedString':
                var selectedString = window.getSelection().toString();
                browser.runtime.sendMessage({ command: 'sendSelectedString', string: selectedString });

                console.log(selectedString);
                break;
        }
    });
}
window.addEventListener("load",initOnLoadCompleted,false);
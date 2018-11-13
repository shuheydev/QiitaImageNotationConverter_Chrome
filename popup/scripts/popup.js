(function () {

    //chromeとbrowserの名前空間対策
    if (!("browser" in window)) {
        window.browser = chrome;
    }

    var textArea_From = document.querySelector("#textArea_From");
    var textArea_To = document.querySelector("#textArea_To");

    var input_Width = document.querySelector("#input_Width");
    var input_Height = document.querySelector("#input_Height");

    var clearButton = document.querySelector("#buttonClear");
    var convertButton = document.querySelector("#buttonConvert");

    function sendMessageToContentScript(tabs) {
        //現在表示中のタブへメッセージを送信
        //tabs[0]というのがカレントタブか？
        browser.tabs.sendMessage(tabs[0].id, { command: "getSelectedString" });
    }

    let qiitaImagePattern = /!\[.*?\]\(.*?\)/;//全体のパターン
    let qiitaImageUrlPattern = /(?<=^\!\[.*?\]\().*?(?=\s|\))/;
    let qiitaImageTitlePattern = /(?<=").*?(?=")/;
    let qiitaAltPattern = /(?<=\!\[).*?(?=\]\(.*?\))/;

    let cantConvertMessage = "すみません。変換できませんでした。";

    function ConvertQiitaToHTML(text_From) {
        let text_To = "";

        //Qiitaの画像挿入の表記方法かどうかをチェック
        let qiitaImageString = qiitaImagePattern.exec(text_From);
        if (qiitaImageString) {
            //そこからURLを取得する。
            let imageUrl = qiitaImageUrlPattern.exec(qiitaImageString);
            if (!imageUrl) {
                imageUrl = "";
            }
            //タイトルを取得する。
            let title = qiitaImageTitlePattern.exec(qiitaImageString);
            if (!title) {
                title = "";
            }
            //代替文字列を取得する。
            let altText = qiitaAltPattern.exec(qiitaImageString);
            if (!altText) {
                altText = "";
            }
            let width = input_Width.value;
            let height = input_Height.value;

            text_To = `<img src="${imageUrl}" title="${title}" alt="${altText}" width="${width}" height="${height}" >`;
        }
        else {
            text_To = cantConvertMessage;
        }

        return text_To;
    }


    //現在の入力状態をLocalStorageに入れる
    function SetToLocalStorage() {
        localStorage.setItem('textArea_From', textArea_From.value);
        localStorage.setItem('textArea_To', textArea_To.value);
        localStorage.setItem('input_Width', input_Width.value);
        localStorage.setItem('input_Height', input_Height.value);
    }


    //Set Eventhandler to 'Clear' button.
    clearButton.addEventListener('click', (e) => {
        textArea_From.value = "";
        textArea_To.value = "";

        SetToLocalStorage();
    });

    //Set Eventhandler to 'Convert' button.
    convertButton.addEventListener('click', (e) => {
        textArea_To.value = ConvertQiitaToHTML(textArea_From.value);
        SetToLocalStorage();
    });

    // let textArea = document.querySelector("#textAreaTarget");
    textArea_From.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            textArea_To.value = ConvertQiitaToHTML(textArea_From.value);
            SetToLocalStorage();
        }
    });
    textArea_From.addEventListener('focus', (e) => {
        textArea_From.select();
    });

    textArea_To.addEventListener('focus', (e) => {
        textArea_To.select();
    });

    input_Width.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            textArea_To.value = ConvertQiitaToHTML(textArea_From.value);
            SetToLocalStorage();
        }

    });
    input_Width.addEventListener('focus', (e) => {
        input_Width.select();
    });

    input_Height.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            textArea_To.value = ConvertQiitaToHTML(textArea_From.value);
            SetToLocalStorage();
        }

    });
    input_Height.addEventListener('focus', (e) => {
        input_Height.select();
    });



    //contentScript側からのメッセージを受け取るイベントハンドラ
    browser.runtime.onMessage.addListener(function (message) {
        if (message.command === 'sendSelectedString') {
            //選択中の文字列があるか
            if (message.string) {
                textArea_From.value = message.string;
                textArea_To.value = ConvertQiitaToHTML(textArea_From.value);
            }
            else {
                textArea_From.value = localStorage.getItem('textArea_From');
                textArea_To.value = localStorage.getItem('textArea_To');
            }
        }
        else {
            textArea_From.value = localStorage.getItem('textArea_From');
            textArea_To.value = localStorage.getItem('textArea_To');
        }

        SetToLocalStorage();
    });

    //ここでcontentScript経由で選択中の文字列を取得する
    browser.tabs.query({ active: true, currentWindow: true }, sendMessageToContentScript);

    input_Width.value = localStorage.getItem('input_Width');
    input_Height.value = localStorage.getItem('input_Height');

    textArea_From.focus();

})();





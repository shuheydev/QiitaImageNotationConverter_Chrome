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
    var changeButton = document.querySelector("#buttonConvert");

    // function sendSearchMessage(tabs) {

    //     // let textArea_From = document.querySelector("#textArea_From");
    //     let string_From = textArea_From.value;

    //     // localStorage.setItem('target', string_From);

    //     //現在表示中のタブへメッセージを送信
    //     //tabs[0]というのがカレントタブか？
    //     browser.tabs.sendMessage(tabs[0].id, { command: "getSelectedString", target: string_From });
    // }

    let qiitaImagePattern = /!\[.+\]\(.+?\)/;
    let qiitaImageUrlPattern = /(?<=\!\[.+?\]\().+(?=\))/;
    let qiitaAltPattern = /(?<=\!\[).+?(?=\]\(.+\))/;

    function ConvertQiitaToHTML(text_From) {
        let text_To = "";

        //Qiitaの画像挿入の表記方法かどうかをチェック
        let qiitaImageString = qiitaImagePattern.exec(text_From);
        if (qiitaImageString) {
            //そこからURLを取得する。
            let imageUrl = qiitaImageUrlPattern.exec(qiitaImageString);

            //代替文字列を取得する。
            let altText=qiitaAltPattern.exec(qiitaImageString);

            let width = input_Width.value;
            let height = input_Height.value;


            if (width && height) {
                text_To = `<img src="${imageUrl}" alt="${altText}" width="${width}" height="${height}" >`;
            }
            else if (width && !height) {
                text_To = `<img src="${imageUrl}" alt="${altText}" width="${width}" >`;
            }
            else if (!width && height) {
                text_To = `<img src="${imageUrl}" alt="${altText}" height="${height}" >`;
            }
            else {
                text_To = `<img src="${imageUrl}" alt="${altText}" >`;
            }
        }
        else {
            text_To = "It does not seems to be Qiita style image description.\nPlease check again.";
        }


        return text_To;
    }




    //Set Eventhandler to 'Search' button.
    clearButton.addEventListener('click', (e) => {
        textArea_From.value = "";
        textArea_To.value = "";
    });

    //Set Eventhandler to 'Change' button.
    changeButton.addEventListener('click', (e) => {
        let converted = ConvertQiitaToHTML(textArea_From.value);
        textArea_To.value = converted;
        localStorage.setItem('textArea_To',textArea_To.value);
    });

    // let textArea = document.querySelector("#textAreaTarget");
    textArea_From.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            let converted = ConvertQiitaToHTML(textArea_From.value);
            textArea_To.value = converted;
            localStorage.setItem('textArea_To',textArea_To.value)
        }

        localStorage.setItem('textArea_From',textArea_From.value);
    });
    textArea_From.addEventListener('focus',(e)=>{
        textArea_From.select();
    });

    textArea_To.addEventListener('focus',(e)=>{
        textArea_To.select();
    });

    input_Width.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            let converted = ConvertQiitaToHTML(textArea_From.value);
            textArea_To.value = converted;
            localStorage.setItem('textArea_To',textArea_To.value)
        }

        localStorage.setItem('input_Width',input_Width.value)
    });
    input_Width.addEventListener('focus',(e)=>{
        input_Width.select();
    });

    input_Height.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            let converted = ConvertQiitaToHTML(textArea_From.value);
            textArea_To.value = converted;
            localStorage.setItem('textArea_To',textArea_To.value)
        }

        localStorage.setItem('input_Height',input_Height.value);
    });
    input_Height.addEventListener('focus',(e)=>{
        input_Height.select();
    });

    
    textArea_From.value = localStorage.getItem('textArea_From');
    textArea_To.value = localStorage.getItem('textArea_To');
    input_Width.value=localStorage.getItem('input_Width');
    input_Height.value=localStorage.getItem('input_Height');

    textArea_From.focus();

})();





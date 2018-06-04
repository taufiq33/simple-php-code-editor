(function(){
    "use strict";

    // Ketika dibuka langsung di browser, maka akan terbuka lewat protocol file:///
    // Sehingga saat itu window.location.hostname bernilai kosong
    if(window.location.hostname == ''){
        alert("You need a Web Server to run this file");
        window.close();
    }

    var $editor             = document.getElementById('editor');
    var $result             = document.getElementById('result');
    var $buttonViewResult   = document.getElementById('viewResult');
    var $form               = document.forms[0];
    var $textarea           = $form.textarea;
    var mainURL             = $form.mainUrl.value;


    // Fungsi untuk membuat objek XMLHttpRequest
    function createAjax () {
        return new XMLHttpRequest();
    };

    // Fungsi untuk melakukan ajax request (GET)
    // Untuk mengetahui hasil dari script php yang dihasilkan
    // penggunaan codeId semata2 untuk mencegah adanya cache (karena GET biasanya menyimpan cache)
    function displayCodeResult(codeId){
        var ajaxObject = createAjax();
        ajaxObject.onreadystatechange = function(){
            if( ajaxObject.readyState == 4 && ajaxObject.status == 200){
                $result.innerHTML = '';
                $result.innerHTML = ajaxObject.responseText;
            }
        };

        ajaxObject.open('GET', mainURL + "api/editor-result.php?codeId=" + codeId, true);
        ajaxObject.send();
    };

    function processToAjax(){
        var textareaContent = $textarea.value;
        var ajaxObject = createAjax();
        var data = new FormData();
        data.append('mainCodeContent', textareaContent);

        ajaxObject.onreadystatechange = function(){
            if(ajaxObject.readyState == 4 && ajaxObject.status == 200){
                var response = JSON.parse(ajaxObject.responseText);
                if ("statusWriteable" in response == false){
                    var jsonResponse = JSON.parse(ajaxObject.responseText);
                    var codeId = jsonResponse.codeId;
                    displayCodeResult(codeId);
                }
            }
        };
        ajaxObject.open("POST", mainURL + "api/front.php", true);
        ajaxObject.send(data);
    };

    function eventButtonClicked(e){
        if ($textarea.value == '<?php' || $textarea.value == '') {
            alert('Please insert PHP Code to Process..');
        } else {
            e.target.classList.remove("btn-success");
            e.target.classList.add("btn-primary");

            processToAjax();
        }
    };

    function eventTextareaTyped(e){
        $buttonViewResult.classList.remove("btn-primary");
        $buttonViewResult.classList.add("btn-success");
    };

    $buttonViewResult.addEventListener('click', eventButtonClicked);
    $textarea.addEventListener('click', eventTextareaTyped);

}());

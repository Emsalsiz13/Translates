// Bu kodlar, web sayfasındaki çeviri arayüzüne ilişkin öğelerin tanımlanması ve ülke seçeneklerinin dinamik olarak oluşturulması için kullanılıyor.
// const anahtar kelimesi ile değişkenler fromText, toText, exchangeIcon, selectTag, icons, translateBtn tanımlanıyor. document.querySelector() fonksiyonuyla, HTML'deki ilgili öğeler seçiliyor ve değişkenlere atanıyor.
// document.querySelectorAll() fonksiyonuyla, sayfadaki tüm select etiketleri ve .row i sınıfına sahip olan tüm ikonlar selectTag ve icons adlı değişkenlere atanıyor.
const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchageIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("button"),
// forEach() döngüsü kullanılarak selectTag dizisindeki her bir select etiketi için bir dizi ülke seçeneği oluşturuluyor. for...in döngüsü kullanarak, countries nesnesindeki her bir öğe üzerinde geziniliyor ve her bir seçenek, option değişkenine atanıyor. insertAdjacentHTML() fonksiyonuyla, option değişkeni, tag değişkeninin sonuna ekleniyor.
selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "tr-TR" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});
// Bu kod bloğu, "exchange" adlı bir simgeye tıklanıldığında, iki metin kutusunun (fromText ve toText) içeriğinin yerlerini değiştiren bir işlevi tanımlar. Ayrıca, iki dil seçeneği arasında da bir değiş tokuş gerçekleştirir.
exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});
// Bu kod bloğu, fromText adlı input alanına herhangi bir tuşa basıldığında tetiklenen bir olay dinleyicisi ekler. Eğer fromText değeri boşsa (!fromText.value), toText değeri de boşaltılır (toText.value = ""), yani çeviri sonucu da boş olacaktır. Bu kod bloğu, çeviri işleminin doğru şekilde yapılabilmesi için gereklidir.
fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});
// Bu kod, translateBtn öğesine bir tıklama olayı dinleyicisi ekler. Düğmeye tıklandığında işlev yürütülür.
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});
//Bu kod JavaScript dilinde yazılmış bir event listener fonksiyonudur. Kodlar bir butona (translateBtn) bir click eventi ekler. Butona tıklandığında, fromText input elementinin değeri alınır ve trim() fonksiyonu kullanılarak başındaki ve sonundaki boşluklar temizlenir. Ayrıca, selectTag adında bir dizi oluşturulur ve ilk elemanı, translateFrom olarak atanan selectTag[0].value ile eşleştirilirken, ikinci elemanı translateTo olarak atanan selectTag[1].value ile eşleştirilir.
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
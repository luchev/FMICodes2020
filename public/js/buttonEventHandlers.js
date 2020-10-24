function sliderHandler(caller, span) {
    span.innerText = caller.value;
}

function fillOfferSummary(){
    let summary = document.getElementById("offer-summary");
    if(summary){
        summary.innerText = "";
        summary.innerText += "Оферта: " + document.getElementById("title").value + "\n" + 
                    "налични бройки: " + document.getElementById("count").value + "\n Цена: " + document.getElementById("price").value;
                    document.getElementById("offer-summary").classList.add("text-dark");
    }
}
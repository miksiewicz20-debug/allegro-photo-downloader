// ==UserScript==
// @name         Allegro Toolbox
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Pobieranie zdjęć HD + kopiowanie opisu katalogowego Allegro
// @match        https://*.salescenter.allegro.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let cachedProductData = null;

    // =========================
    // INIT
    // =========================
    setTimeout(() => {

        // tylko ekran katalogu produktu
        if (!document.body.innerText.includes("ZMIEŃ PRODUKT")) {
            console.log("Nie jest to ekran katalogu produktu");
            return;
        }

        // zabezpieczenie przed duplikatem
        if (document.getElementById("allegroToolbox")) {
            return;
        }

        createToolbox();

    }, 4000);


    // =========================
    // UI
    // =========================
    function createToolbox() {

        const panel = document.createElement("div");
        panel.id = "allegroToolbox";

        panel.style.position = "fixed";
        panel.style.bottom = "20px";
        panel.style.right = "20px";
        panel.style.zIndex = "99999";
        panel.style.background = "white";
        panel.style.border = "1px solid #ddd";
        panel.style.padding = "12px";
        panel.style.borderRadius = "8px";
        panel.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
        panel.style.fontFamily = "Arial";
        panel.style.minWidth = "220px";

        const title = document.createElement("div");
        title.innerText = "ALLEGRO TOOLBOX";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.textAlign = "center";

        const downloadBtn = createButton("POBIERZ ZDJĘCIA", downloadImages);
        const copyBtn = createButton("KOPIUJ OPIS", copyDescription);

        panel.appendChild(title);
        panel.appendChild(downloadBtn);
        panel.appendChild(copyBtn);

        document.body.appendChild(panel);
    }


    function createButton(text, action) {
        const btn = document.createElement("button");

        btn.innerText = text;
        btn.style.width = "100%";
        btn.style.padding = "10px";
        btn.style.marginBottom = "8px";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid #ccc";
        btn.style.background = "#f8f8f8";
        btn.style.borderRadius = "5px";
        btn.style.fontWeight = "bold";

        btn.addEventListener("click", action);

        return btn;
    }


    // =========================
    // API
    // =========================
    async function fetchProductData() {

        // cache — żeby nie robić fetch dwa razy
        if (cachedProductData) {
            return cachedProductData;
        }

        const params = new URLSearchParams(window.location.search);
        const productId = params.get("productId");

        if (!productId) {
            throw new Error("Brak productId");
        }

        const response = await fetch(
            `https://edge.salescenter.allegro.com/sale/products/${productId}`,
            {
                headers: {
                    "Accept": "application/vnd.allegro.form.v1+json"
                },
                credentials: "omit"
            }
        );

        const data = await response.json();

        console.log("API RESPONSE:", data);

        cachedProductData = data;

        return data;
    }


    // =========================
    // DOWNLOAD IMAGES
    // =========================
    async function downloadImages() {
    try {

        const data = await fetchProductData();

        if (!data.images || !data.images.length) {
            alert("Brak zdjęć");
            return;
        }

        for (let i = 0; i < data.images.length; i++) {

            const img = data.images[i];

            // pobranie obrazka jako blob
            const response = await fetch(img.url);
            const blob = await response.blob();

            // tworzymy lokalny URL
            const blobUrl = URL.createObjectURL(blob);

            // wymuszamy download
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `allegro_${i + 1}.jpg`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            // czyszczenie pamięci
            URL.revokeObjectURL(blobUrl);

            // mała przerwa żeby Chrome nie zgłupiał
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        alert(`Pobrano ${data.images.length} zdjęć`);

    } catch (error) {
        console.error(error);
        alert("Błąd pobierania zdjęć");
    }
}

    // =========================
    // COPY DESCRIPTION
    // =========================
    async function copyDescription() {
        try {

            const data = await fetchProductData();

            if (!data.description || !data.description.sections) {
                alert("Brak opisu");
                return;
            }

            let htmlBlocks = [];

            data.description.sections.forEach(section => {
                section.items.forEach(item => {
                    if (item.type === "TEXT") {
                        htmlBlocks.push(item.content);
                    }
                });
            });

            const fullHtml = htmlBlocks.join("<br><br>");

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = fullHtml;

            // listy → bullet points
            tempDiv.querySelectorAll("li").forEach(li => {
                li.innerHTML = "\n• " + li.innerText;
            });

            // paragrafy → nowe linie
            tempDiv.querySelectorAll("p").forEach(p => {
                p.innerHTML = p.innerText + "\n";
            });

            const finalText = tempDiv.innerText
                .replace(/\n{3,}/g, "\n\n")
                .trim();

            await navigator.clipboard.writeText(finalText);

            alert("Opis skopiowany do schowka");

        } catch (error) {
            console.error(error);
            alert("Błąd kopiowania opisu");
        }
    }

})();

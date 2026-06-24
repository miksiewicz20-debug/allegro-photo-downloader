// ==UserScript==
// @name         Allegro Downloader HD Stable Final
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  Pobiera zdjęcia katalogu Allegro tylko na stronie katalogu produktu
// @match        https://*.salescenter.allegro.com/*
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    // czekamy aż Allegro załaduje stronę
    setTimeout(() => {

        // pokazuj tylko jeśli istnieje przycisk ZMIEŃ PRODUKT
        if (!document.body.innerText.includes("ZMIEŃ PRODUKT")) {
            console.log("Nie jest to ekran katalogu produktu");
            return;
        }

        // znajdź zdjęcia katalogowe
        const productImages = [...document.querySelectorAll("img")]
            .filter(img =>
                img.src.includes("a.allegroimg.com") &&
                (
                    img.src.includes("/s64b/") ||
                    img.src.includes("/s360b/")
                )
            );

        if (productImages.length < 3) {
            console.log("Brak zdjęć katalogowych");
            return;
        }

        // nie twórz drugi raz
        if (document.getElementById("allegro-hd-btn")) {
            return;
        }

        // przycisk
        const button = document.createElement("button");
        button.id = "allegro-hd-btn";
        button.innerText = "⬇ POBIERZ HD";

        button.style.position = "fixed";
        button.style.bottom = "25px";
        button.style.right = "25px";
        button.style.zIndex = "999999";
        button.style.padding = "12px 18px";
        button.style.background = "#ff6900";
        button.style.color = "white";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.fontWeight = "bold";
        button.style.borderRadius = "8px";
        button.style.boxShadow = "0 3px 8px rgba(0,0,0,0.25)";
        button.style.fontSize = "14px";

        document.body.appendChild(button);

        // pobieranie
        button.addEventListener("click", () => {

            const images = [...document.querySelectorAll("img")]
                .filter(img => img.src.includes("a.allegroimg.com"))
                .filter(img =>
                    img.src.includes("/s64b/") ||
                    img.src.includes("/s360b/")
                )
                .map(img => img.src);

            const unique = [...new Set(images)];

            const originalLinks = unique.map(url =>
                url.replace(/\/s[^/]+\//, "/original/")
            );

            originalLinks.forEach((url, index) => {
                GM_download({
                    url: url,
                    name: `allegro_${index + 1}.jpg`,
                    saveAs: false
                });
            });

            alert("Pobieranie rozpoczęte: " + originalLinks.length + " zdjęć");
        });

        console.log("Przycisk dodany");

    }, 4000);

})();
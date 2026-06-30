// ==UserScript==
// @name         Allegro Toolbox
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Pobieranie zdjęć HD + kopiowanie opisu katalogowego Allegro
// @match        https://*salescenter.allegro.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let cachedProductData = null;
    let cachedProductId = null;
    let lastUrl = location.href;

    // =========================
    // INIT
    // =========================
    function initToolbox() {

        // tylko ekran katalogu produktu
        if (!document.body.innerText.includes("ZMIEŃ PRODUKT")) {
            return;
        }

        // nie twórz drugi raz
        if (document.getElementById("allegroToolbox")) {
            return;
        }

        console.log("Tworzę toolbox");

        createToolbox();
    }

    function watchUrlChange() {

        setInterval(() => {

            const currentUrl = location.href;

            if (currentUrl !== lastUrl) {

                console.log("Zmiana URL wykryta");

                lastUrl = currentUrl;

                // reset cache
                cachedProductData = null;
                cachedProductId = null;

                // usuń stary panel
                const oldPanel = document.getElementById("allegroToolbox");

                if (oldPanel) {
                    oldPanel.remove();
                }

                // poczekaj aż allegro dorysuje DOM
                setTimeout(() => {
                    initToolbox();
                }, 2000);
            }

        }, 1000);
    }

    setTimeout(() => {
        initToolbox();
    }, 3000);

    watchUrlChange();


    function showToast(message) {

        const oldToast = document.getElementById("allegroToast");

        // usuń poprzedni jeśli istnieje
        if (oldToast) {
            oldToast.remove();
        }

        const toast = document.createElement("div");
        toast.id = "allegroToast";
        toast.innerText = message;

        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "20px";
        toast.style.background = "#1f9d55";
        toast.style.color = "white";
        toast.style.padding = "12px 18px";
        toast.style.borderRadius = "8px";
        toast.style.fontFamily = "Arial";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "bold";
        toast.style.zIndex = "999999";
        toast.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
        toast.style.opacity = "1";
        toast.style.transition = "opacity 0.4s ease";

        document.body.appendChild(toast);

        // fade out
        setTimeout(() => {
            toast.style.opacity = "0";
        }, 1800);

        // usuń z DOM
        setTimeout(() => {
            toast.remove();
        }, 2300);
    }


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
        panel.style.background = "#f8f9fa";
        panel.style.border = "1px solid #e5e7eb";
        panel.style.padding = "14px";
        panel.style.borderRadius = "12px";
        panel.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        panel.style.fontFamily = "Arial";
        panel.style.minWidth = "200px";

        const title = document.createElement("div");
        title.innerText = "ALLEGRO TOOLBOX";
        title.style.fontWeight = "600";
        title.style.fontSize = "14px";
        title.style.letterSpacing = "0.5px";
        title.style.marginBottom = "12px";
        title.style.textAlign = "center";
        title.style.color = "#222";

        const downloadBtn = createButton("POBIERZ ZDJĘCIA", downloadImages);
        const copyBtn = createButton("KOPIUJ OPIS", copyDescription);
        const manufacturerBtn = createButton("DANE PRODUCENTA", manufacturerSearch);
        const safetyBtn = createButton("OPIS BEZPIECZEŃSTWA", safetyDescriptionSearch);
        const aiDescriptionBtn = createButton("OPIS AI", aiDescriptionSearch);

        panel.appendChild(title);
        panel.appendChild(downloadBtn);
        panel.appendChild(copyBtn);
        panel.appendChild(manufacturerBtn);
        panel.appendChild(safetyBtn);
        panel.appendChild(aiDescriptionBtn);

        document.body.appendChild(panel);
    }


    function createButton(text, action) {
        const btn = document.createElement("button");

        btn.innerText = text;
        btn.style.width = "100%";
        btn.style.padding = "8px";
        btn.style.marginBottom = "4px";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid #e5e7eb";
        btn.style.background = "#ffffff";
        btn.style.borderRadius = "8px";
        btn.style.fontWeight = "600";
        btn.style.fontSize = "12px";
        btn.style.transition = "all 0.15s ease";
        btn.style.color = "#333";

        btn.addEventListener("click", action);

        btn.addEventListener("mouseenter", () => {
            btn.style.background = "#f3f4f6";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.background = "#ffffff";
        });

        return btn;
    }


    // =========================
    // API
    // =========================
    async function fetchProductData() {


        const params = new URLSearchParams(window.location.search);
        const productId = params.get("productId");

        // cache tylko dla aktualnego produktu
        if (cachedProductData && cachedProductId === productId) {
            return cachedProductData;
        }

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

        if (data.name) {
            cachedProductData = data;
            cachedProductId = productId;
        }

        return data;
    }


    // =========================
    // DOWNLOAD IMAGES
    // =========================
    async function downloadImages() {
        try {

            const data = await fetchProductData();

            if (!data.images || !data.images.length) {
                showToast("❌ Błąd pobierania zdjęć");
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

            showToast(`✓ Pobrano ${data.images.length} zdjęć`);

        } catch (error) {
            console.error(error);
            showToast("❌ Błąd pobierania zdjęć");
        }
    }

    // =========================
    // COPY DESCRIPTION
    // =========================
    async function copyDescription() {
        try {

            const data = await fetchProductData();

            if (!data.description || !data.description.sections) {
                showToast("❌ Brak opisu");
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

            showToast("✓ Opis skopiowany");

        } catch (error) {
            console.error(error);
            showToast("❌ Błąd kopiowania opisu");
        }
    }

    async function manufacturerSearch() {
        try {

            const data = await fetchProductData();

            let productName = data.name;

            // czyszczenie marketingowych dodatków
            productName = productName
                .replace(/\bNOWOŚĆ\b/gi, "")
                .replace(/PROMOCJA/gi, "")
                .replace(/OKAZJA/gi, "")
                .replace(/\bHIT\b/gi, "")
                .replace(/SUPER CENA/gi, "")
                .replace(/BESTSELLER/gi, "")
                .replace(/MEGA ZESTAW/gi, "")
                .trim();

            const query =
                `znajdź mi dane producenta lub osoby odpowiedzialnej na terenie UE dla produktu "${productName}" z nazwą firmy i adresem kontaktowym - wymagane do aukcji allegro`;

            const url =
                "https://www.google.com/search?q=" + encodeURIComponent(query) + "&udm=50";

            window.open(url, "_blank");

        } catch (error) {
            console.error(error);
            showToast("❌ Błąd wyszukiwania producenta");
        }
    }

    async function aiDescriptionSearch() {
        try {

            const data = await fetchProductData();

            let productName = data.name;

            if (!productName) {
                throw new Error("Brak nazwy produktu");
            }

            // czyszczenie title
            productName = productName
                .replace(/\bNOWOŚĆ\b/gi, "")
                .replace(/\bPROMOCJA\b/gi, "")
                .replace(/\bOKAZJA\b/gi, "")
                .replace(/\bHIT\b/gi, "")
                .replace(/\bSUPER CENA\b/gi, "")
                .replace(/\bBESTSELLER\b/gi, "")
                .replace(/\bMEGA ZESTAW\b/gi, "")
                .trim();

            const query =
                `Stwórz mi profesjonalny opis sprzedażowy do aukcji Allegro zgodny z regulaminem Allegro dla produktu "${productName}". Opis ma być atrakcyjny marketingowo, podkreślać zalety produktu, być napisany naturalnym językiem sprzedażowym i gotowy do wklejenia na aukcję. Nie dodawaj komentarzy ani żadnych wstępów poza samym opisem.`;

            const url =
                "https://www.google.com/search?q=" + encodeURIComponent(query) + "&udm=50";

            window.open(url, "_blank");

        } catch (error) {
            console.error(error);
            showToast("❌ Błąd generownaia opisu AI");
        }
    }

    async function safetyDescriptionSearch() {
        try {

            const data = await fetchProductData();

            let productName = data.name;
            if (!productName) {
                throw new Error("Brak nazwy produktu");
            }





            // czyszczenie title
            productName = productName
                .replace(/\bNOWOŚĆ\b/gi, "")
                .replace(/\bPROMOCJA\b/gi, "")
                .replace(/\bOKAZJA\b/gi, "")
                .replace(/\bHIT\b/gi, "")
                .replace(/\bSUPER CENA\b/gi, "")
                .replace(/\bBESTSELLER\b/gi, "")
                .replace(/\bMEGA ZESTAW\b/gi, "")
                .trim();

            const query =
                `Stwórz wyłącznie czysty opis bezpieczeństwa Allegro dla "${productName}" w markdown, bez żadnych powitań, wstępów i komentarzy na końcu.`;

            const url =
                "https://www.google.com/search?q=" + encodeURIComponent(query) + "&udm=50";

            window.open(url, "_blank");

        } catch (error) {
            console.error(error);
            showToast("❌ Błąd generowania opisu bezpieczeństwa");
        }
    }



})();

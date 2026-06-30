# ALLEGRO TOOLBOX v3.5

Userscript do automatyzacji workflow podczas wystawiania ofert na Allegro.

## Funkcje

* Pobieranie zdjęć HD z katalogu
* Kopiowanie ukrytego opisu produktu
* Wyszukiwanie danych producenta (UE / GPSR)
* Generowanie zapytań bezpieczeństwa GPSR
* Generowanie opisów sprzedażowych AI
* Integracja z Google AI Mode
* Inteligentne przełączanie między produktami bez odświeżania strony
* Nowoczesny interfejs użytkownika
* Automatyzacja procesu jednym kliknięciem

## Instalacja

1. Zainstaluj Tampermonkey
2. Otwórz plik `.user.js`
3. Kliknij **RAW**
4. Zainstaluj skrypt

---

# Changelog

### v3.5

Duży update skupiony na stabilności działania oraz poprawie UX.

#### Core improvements

* Naprawiono problem z cache API podczas przechodzenia między produktami
* Cache został powiązany z aktualnym `productId` zamiast przechowywać ostatnio załadowany produkt
* Wyeliminowano konieczność ręcznego odświeżania strony (`F5`) po wejściu w nowy katalog produktu
* Dodano automatyczne wykrywanie zmiany URL w Allegro Sales Center
* Toolbox automatycznie przeładowuje się przy przechodzeniu między produktami
* Dodano pełne wsparcie dla SPA (Single Page Application) używanego przez Allegro Sales Center

#### UI / UX improvements

* Usunięto klasyczne `alert()` blokujące workflow
* Dodano nowoczesny system powiadomień typu **Toast Notifications**
* Powiadomienia pojawiają się automatycznie bez przerywania pracy użytkownika
* Odświeżono wygląd panelu toolbox
* Poprawiono styling przycisków
* Dodano hover effects dla lepszej interakcji
* Ulepszono spacing, padding oraz nowoczesny minimalistyczny wygląd UI

Efekt:

* szybsza praca bez odświeżania strony
* lepszy komfort pracy przy seryjnym wystawianiu ofert
* bardziej profesjonalny interfejs użytkownika
* płynniejszy workflow dla użytkowników lombardów

---

### v3.4

* Dodano nowy przycisk:

```text
OPIS AI
```

Nowa funkcja automatycznie:

* pobiera nazwę produktu z API Allegro
* czyści nazwę z marketingowych dodatków
* otwiera Google AI Mode
* generuje prompt do stworzenia opisu sprzedażowego

Prompt został zaprojektowany do tworzenia:

* opisów zgodnych z regulaminem Allegro
* tekstów sprzedażowych gotowych do aukcji
* naturalnego marketingowego copy bez zbędnych komentarzy AI

Cel:

* przyspieszenie procesu tworzenia opisów aukcji
* ograniczenie ręcznego promptowania AI
* automatyzacja kolejnego etapu workflow

---

### v3.3.2

* Hotfix dla funkcji `OPIS BEZPIECZEŃSTWA`

Naprawiono problem, gdzie AI generowało:

* zbyt długie odpowiedzi
* emoji w tekście
* zbędne wyjaśnienia

Zmieniono prompt, aby zwracał:

* czysty markdown
* zwięzły tekst
* gotowy format do szybkiego kopiowania

---

### v3.3.1

* Ulepszono prompt dla funkcji `OPIS BEZPIECZEŃSTWA`
* Poprawiono jakość odpowiedzi AI
* Lepsze dopasowanie odpowiedzi pod workflow Allegro

---

### v3.3

* Integracja z Google AI Mode

Odkrycie parametru Google:

```text
&udm=50
```

* `DANE PRODUCENTA` otwiera bezpośrednio AI Mode
* `OPIS BEZPIECZEŃSTWA` otwiera bezpośrednio AI Mode

---

### v3.2

Dodano przycisk:

```text
OPIS BEZPIECZEŃSTWA
```

* Automatyczne tworzenie zapytania GPSR
* Naprawa cache API (`401 unauthorized`)
* Optymalizacja wyglądu UI (mniejszy panel)

---

### v3.1

Dodano przycisk:

```text
DANE PRODUCENTA
```

* Pobieranie nazwy produktu z API
* Automatyczne wyszukiwanie producenta / osoby odpowiedzialnej UE

---

### v3.0

* Kopiowanie ukrytego opisu katalogowego
* Zachowanie struktury tekstu

---

### v2.0

* Migracja z DOM scraping → Allegro API

---

### v1.0

* Pobieranie zdjęć HD z katalogu

---

**Current version:**

# ALLEGRO TOOLBOX v3.5 🚀

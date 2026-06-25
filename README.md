# ALLEGRO TOOLBOX v3.3.2

Userscript do automatyzacji workflow podczas wystawiania ofert na Allegro.

## Funkcje

- Pobieranie zdjęć HD z katalogu  
- Kopiowanie ukrytego opisu produktu  
- Wyszukiwanie danych producenta (UE / GPSR)  
- Generowanie zapytań bezpieczeństwa GPSR  
- Integracja z Google AI Mode  
- Automatyzacja procesu jednym kliknięciem  

## Instalacja

1. Zainstaluj Tampermonkey  
2. Otwórz plik `.user.js`  
3. Kliknij **RAW**  
4. Zainstaluj skrypt  

---

# Changelog

### v3.3.2

- Hotfix dla funkcji `OPIS BEZPIECZEŃSTWA`

Naprawiono problem, gdzie AI generowało:

- zbyt długie odpowiedzi  
- emoji w tekście  
- zbędne wyjaśnienia  

Zmieniono prompt, aby zwracał:

- czysty markdown  
- zwięzły tekst  
- gotowy format do szybkiego kopiowania

---

### v3.3.1

- Ulepszono prompt dla funkcji `OPIS BEZPIECZEŃSTWA`
- Poprawiono jakość odpowiedzi AI
- Lepsze dopasowanie odpowiedzi pod workflow Allegro

---

### v3.3

- Integracja z **Google AI Mode**
- Odkrycie parametru Google:

```text
&udm=50
```

- `DANE PRODUCENTA` otwiera bezpośrednio AI Mode  
- `OPIS BEZPIECZEŃSTWA` otwiera bezpośrednio AI Mode  

---

### v3.2

- Dodano przycisk:

```text
OPIS BEZPIECZEŃSTWA
```

- Automatyczne tworzenie zapytania GPSR  
- Naprawa cache API (`401 unauthorized`)  
- Optymalizacja wyglądu UI (mniejszy panel)  

---

### v3.1

- Dodano przycisk:

```text
DANE PRODUCENTA
```

- Pobieranie nazwy produktu z API  
- Automatyczne wyszukiwanie producenta / osoby odpowiedzialnej UE  

---

### v3.0

- Kopiowanie ukrytego opisu katalogowego  
- Zachowanie struktury tekstu  

---

### v2.0

- Migracja z DOM scraping → Allegro API  

---

### v1.0

- Pobieranie zdjęć HD z katalogu  

---

**Current version:**

# ALLEGRO TOOLBOX v3.3 🚀

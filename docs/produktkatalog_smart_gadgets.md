# Smart Gadgets & Dashboards · Produktkatalog

> **3NC Solo | Premium 3D-Druck & IoT-Integration · Dresden**  
> Hardware-Lösungen für Führungskräfte, Teams und Kunden.

---

## Kategorie A: Führungskräfte / C-Suite

### 📊 MGT-001: Executive Desk Command

| Feld | Detail |
|------|--------|
| **Claim** | *„Dein KPI-Dashboard, das nur du kennst."* |
| **Zielgruppe** | CEOs, CFOs, COOs, Geschäftsführer, Kanzleiinhaber |
| **Konzept** | 7" IPS-Touchdisplay (Elecrow CrowPanel), motorisiert vertikal eingelassen in den Schreibtisch wie ein CD-Laufwerk. Im Ruhezustand bündig mit der Tischplatte. Auf Befehl fährt ein 12V-Linearaktor den Screen senkrecht nach oben aus. Oberhalb des Slots: 5 dedizierte Edelstahl-Drucktaster. |

#### Display-Inhalte

| Page | KPI-Gruppe | Metriken |
|------|-----------|----------|
| 1 | **Finance** | Umsatz (Tag/MoM/YoY), Gewinnmarge, EBITDA, operativer Cashflow, Budget vs. Ist |
| 2 | **Sales** | Pipeline-Wert, Conversion Rate, CAC, LTV, NRR |
| 3 | **HR/People** | Fluktuation, Engagement-Score, Krankheitsquote, offene Stellen |
| 4 | **Ops** | Projekt-Profitabilität, Cycle Time, Kapazitätsauslastung |
| 5 | **Market** | Live Börsenticker (eigene Aktie, DAX, Branchenindex), NPS, Marktanteil |
| 6 | **Liquidity** | Cash Runway, Liquiditätswarnung, Forderungen/Verbindlichkeiten |

#### Bedienelemente

| Element | Typ | Funktion |
|---------|-----|----------|
| Taster 1 – 📈 Finance | Edelstahl-Drucktaster (8mm, graviert) | Umsatz, Marge, EBITDA, Cash Flow, Budget vs. Ist |
| Taster 2 – 💹 Sales | Edelstahl-Drucktaster (8mm, graviert) | Pipeline, Conversion, CAC, LTV, Neukundenquote |
| Taster 3 – 👥 People | Edelstahl-Drucktaster (8mm, graviert) | Fluktuation, Engagement, Krankheitsquote, offene Stellen |
| Taster 4 – ⚙️ Ops | Edelstahl-Drucktaster (8mm, graviert) | Projekt-Profitabilität, Cycle Time, Kapazitätsauslastung |
| Taster 5 – ⏬ Retract | Edelstahl-Drucktaster (8mm, graviert) | Bildschirm einfahren (Panik-Button) |
| Touchscreen | 7" kapazitiv | Swipe = Zeiträume (Tag/Woche/Monat/Quartal), Tap = Drill-Down |

#### 6 Ausfahrmechanismen

| # | Name | Technik | Sicherheit |
|---|------|---------|------------|
| 1 | **NFC-Schlüssel** | PN532 liest NFC-Karte/Ring auf Tischplatte → Magnetverriegelung → Aktor | Nur registrierte UIDs |
| 2 | **Geheimschalter** | Verdeckter Mikrotaster unter Tischkante/Schublade | Doppelklick-Sequenz optional |
| 3 | **Klopf-Erkennung** | Piezo-Sensor + Timing-Analyse (z.B. 3× schnell) | Pattern-Matching ignoriert Zufallsstöße |
| 4 | **Magnetischer Trigger** | 3D-gedruckter Briefbeschwerer mit Neodym auf definierter Stelle → Reed | Spezifische Feldstärke nötig |
| 5 | **Proximity + Auto** | mmWave LD2410 erkennt Person → Auto-Deploy, >30s weg → Auto-Retract | Zero-Interaction |
| 6 | **BLE Smartphone** | ESP32 erkennt registriertes BLE-Gerät → Bluetooth-Nähe = Deploy | Optional mit PIN-Bestätigung |

#### Stückliste

| Komponente | Modell | Preis |
|------------|--------|-------|
| Display | Elecrow CrowPanel 7" IPS (ESP32-S3, kapazitiv) | ~45€ |
| Linearaktor | 12V, 150mm Hub, 1500N, integrierte Endschalter | ~25€ |
| Taster (5×) | Bündige 8mm Edelstahl-Drucktaster, gravierte Icons | ~15€ |
| NFC Reader | PN532 (Smartphone-kompatibel) | ~8€ |
| Gehäuse + Schlitten | ASA 3D-Druck + 2020 Alu-Profil Linearführung | ~20€ |
| Netzteil + Relais | 12V/3A Meanwell + Dualkanal-Relais | ~15€ |
| Energiekette | 10×10mm Schleppkette | ~5€ |
| **Gesamt** | | **~133€** |

---

## Kategorie B: Teams & HR

### 👥 TEAM-001: Smart Team Board

| Feld | Detail |
|------|--------|
| **Claim** | *„Guten Morgen, Sarah. Dein Streak: 12 Tage."* |
| **Zielgruppe** | Unternehmen ab 10 MA, Produktion, Büro, Callcenter, Logistik |
| **Konzept** | Wandmontiertes 10" IPS-Display im Pausenraum. Zeigt standardmäßig öffentliche Daten. mmWave-Sensor erkennt Person → Wechsel zur Begrüßung. NFC-Badge-Scan → personalisiertes Dashboard. Auto-Logout bei Abwesenheit. |

#### Anzeige-Modi

| Modus | Trigger | Inhalt |
|-------|---------|--------|
| **Idle** | Kein Signal | Schichtplan, Geburtstage, Team-Announcements, Wetter |
| **Begrüßung** | mmWave erkennt Person | „Halte deinen Badge hoch" + animierter NFC-Icon |
| **Persönlich** | NFC-Badge UID erkannt | Eigene KPIs, Streak, Quests, Goodies, Zeiterfassung |
| **Admin** | Admin-Badge | Team-Auslastung, Stimmungsindex, Frühwarnsignale |
| **Auto-Logout** | mmWave verliert Signal >10s | Sanfter Übergang zurück zu Idle |

#### Gamification-Layer

| Element | Mechanik | Belohnung |
|---------|----------|-----------|
| **Tages-Streak** | Jeden Tag einloggen = Streak +1 | Ab 5d: Badge, ab 30d: Gutschein |
| **KPI-Quests** | „Erreiche 95% Pünktlichkeit" | Kaffeegutschein, Extra-Pause |
| **Leaderboard** | Opt-in, anonymisiert möglich | Team-Challenges, Wochen-MVP |
| **Meilensteine** | 100 Logins, 50 Quests, 1 Jahr | Physische 3D-gedruckte Trophäe |

#### Stille Analytik (nur HR/Management)

| Signal | Erkennung | Warnschwelle |
|--------|-----------|-------------|
| Nutzungsfrequenz | Login-Zählung pro MA/Woche | Sinkende Nutzung über 3 Wochen |
| Engagement-Trend | KPI-Ansichten pro Session | Reine Pflicht-Logins vs. freiwillige Nutzung |
| Zeitfenster-Muster | Login-Timestamps | Nur Dienstbeginn = geringe Eigenmotivation |
| Stimmungsindex | 1-Tap-Emoji beim Logout (freiwillig) | Trend unter 3.0/5.0 über 5 Tage |

> ⚖️ **DSGVO:** Alle Daten lokal auf ESP32 oder firmeninternes Intranet. Keine Cloud. Stimmungsvoting anonymisiert und freiwillig.

#### Stückliste

| Komponente | Modell | Preis |
|------------|--------|-------|
| Display | Waveshare 10.1" IPS + RPi 4 / ESP32-S3 | ~85€ |
| NFC Reader | PN532 | ~8€ |
| Präsenzsensor | HLK-LD2410 mmWave Radar | ~5€ |
| NFC-Badges (50×) | NTAG215 Scheckkartenformat | ~25€ |
| Gehäuse | ASA 3D-Druck, VESA-Wandhalterung | ~15€ |
| Software | ESPHome + InfluxDB/Grafana (Open Source) | 0€ |
| **Gesamt** | | **~138€** |

---

## Kategorie C: Kunden & Retail

### 🤝 CX-001: Customer Experience Terminal

| Feld | Detail |
|------|--------|
| **Claim** | *„Willkommen zurück. Dein Lieblingskaffee wartet."* |
| **Zielgruppe** | Cafés, Hotels, Friseure, Fitnessstudios, Handwerksbetriebe, Showrooms, Arztpraxen |
| **Konzept** | Elegantes 5" IPS-Touch-Terminal in skulpturalem ASA-Gehäuse mit Gold-Akzent. NFC-Karte/Smartphone → persönliche Begrüßung, Treuepunkte, Angebote, Feedback. |

#### Anzeige-Inhalte

| Feature | Beschreibung |
|---------|-------------|
| **Treuepunkte** | Punktestand, nächste Belohnung, Fortschrittsbalken |
| **Personalisierte Angebote** | Rabatte basierend auf Kaufhistorie |
| **Bestellhistorie** | Letzte Käufe, Lieblings-Items, saisonale Empfehlungen |
| **VIP-Status** | Bronze → Silber → Gold → Platin (Level-Up-Animation) |
| **QR Cross-Sell** | Dynamischer QR für App-Download, Online-Gutschein, Bewertung |
| **Feedback-Tap** | 1-Tap Zufriedenheitsbewertung, Echtzeit-NPS |

#### Stückliste

| Komponente | Modell | Preis |
|------------|--------|-------|
| Display | Waveshare 5" IPS Touch (ESP32-S3) | ~30€ |
| NFC Reader | PN532 + LED-Ring (Amber) | ~10€ |
| Gehäuse | ASA schwarz + PLA-Silk Gold | ~8€ |
| Backend | ESP32 WiFi → REST-API / Google Sheets | 0€ |
| Kundenkarten (100×) | NTAG215 mit Logobedruckung | ~40€ |
| **Gesamt** | | **~88€** |

---

## Kategorie D: Promo-Gadgets

*Physische Markenerlebnisse in 3 Eskalationsstufen.*

| ID | Name | Stufe | Elektronik | Stückkosten | Batterie |
|----|------|-------|-----------|-------------|----------|
| P-001 | Thermochromer Token | Passiv | 0€ | ~3€ | Keine |
| R-001 | Phantom-Trigger | Reaktiv | ~5€ | ~8€ | CR2032 (1+ Jahr) |
| S-001 | Treue-Kristall | Smart | ~20€ | ~24€ | CR2032 (3-6 Monate) |
| S-002 | Mood-Stein | Smart | ~18€ | ~22€ | LiPo USB-C (2 Wochen) |
| S-003 | Meeting-Sanduhr | Smart | ~22€ | ~26€ | LiPo (3 Tage) |
| S-004 | Atem-Objekt | Smart | ~16€ | ~20€ | LiPo (1 Woche) |

---

## Kategorie E: IoT / Custom

### 🏠 IoT-001: Smart Garden Controller (Hunde-Fontäne)

| Feld | Detail |
|------|--------|
| **Claim** | *„Dein Hund betritt den Garten – die Fontäne springt an."* |
| **Konzept** | Wetterfestes ASA-Gehäuse in Steinoptik. ESP32 scannt BLE iBeacon am Hundehalsband. Hund < 10m → Relais → Pumpe ein. Signal weg → 60s Toleranz → Pumpe aus. |
| **Gesamtkosten** | ~45€ |
| **Stromversorgung** | Netzbetrieb (12V + USB) |
| **Software** | ESPHome YAML, optional Home Assistant |

**Weitere IoT-Ideen (keine Grenzen):**
- Bewässerung per Bodenfeuchte-Sensor
- Motorisierte Katzenklappe per RFID
- Automatische Rollos bei Sonneneinstrahlung
- Briefkasten-Benachrichtigung aufs Handy
- Türklingel → Foto → Telegram-Push
- Kühlschrank-Temperaturwarnung

---

*Alle Preise sind Materialkosten für Einzelstücke. Bei Serienfertigung sinken die Kosten um 20-40%.  
Dieses Dokument ist ein lebendiger Katalog – neue Konzepte werden laufend ergänzt.*

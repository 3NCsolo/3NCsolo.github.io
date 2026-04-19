# Machbarkeitsstudie: Smarte 3D-Druck Integrationen jenseits von NFC & QR

> Hintergrund: NFC-Chips und QR-Codes sind die Einsteiger-Droge der interaktiven Werbemittel. Jeder kann sie. Sie sind billig, funktional, aber **langweilig**. Diese Studie untersucht, welche Elektronik-Module, Sensoren und IoT-Systeme sich realistisch in 3D-gedruckte Objekte integrieren lassen – und was für komplett verrückte Use-Cases damit möglich werden.

---

## Teil 1: Das Baukasten-Arsenal

Hier sind die konkreten, heute kaufbaren Module, geordnet nach Integrations-Komplexität. Alle sind mit dem Qidi Q1 Pro / Bambu Lab X1C druckbar (Gehäuse aus ASA/PC bei Outdoor, PLA/PETG bei Indoor).

### 🟢 Stufe 1: Passiv (kein Strom nötig)

| Modul | Größe | Preis ca. | Was es kann |
|-------|-------|-----------|-------------|
| **NFC Tag (NTAG215)** | ∅25mm, 0.5mm dick | 0,30€ | URL öffnen, vCard, WiFi-Zugangsdaten teilen |
| **QR-Code** (gedruckt/graviert) | beliebig | 0€ | Statischer Link. Langweilig aber robust |
| **Thermochrome Pigmente** | Pulver | ~15€/100g | Farbe ändert sich bei Körperwärme (z.B. Logo erscheint erst beim Anfassen) |
| **Photochrome Pigmente** | Pulver | ~18€/100g | Farbe ändert sich bei UV-Licht (Outdoor = sichtbar, Indoor = unsichtbar) |
| **Fluoreszenz-Filament** | 1kg Rolle | ~25€ | Leuchtet im Dunkeln nach (Glow-in-the-dark Branding) |

> [!TIP]
> **Thermochrome Filamente** sind der unterschätzteste Trick: Man druckt ein Objekt in Schwarz, und sobald der Empfänger es in die Hand nimmt, erscheint durch die Körperwärme das Logo in Gold. **Null Elektronik, maximaler WOW-Effekt.**

---

### 🟡 Stufe 2: Aktiv-Einfach (Batterie, kein WiFi)

| Modul | Größe | Preis ca. | Was es kann |
|-------|-------|-----------|-------------|
| **CR2032 + LED** | ∅20mm Coin Cell | ~0,50€ | Pulsierendes Licht bei Druck auf Taster |
| **Piezo-Summer** | ∅12mm | ~0,80€ | Akustisches Feedback (Klick, Melodie, Alarm) |
| **Vibrationsmotor (Coin-Type)** | ∅10mm × 3mm | ~1,50€ | Haptisches Feedback beim Aufheben/Schütteln |
| **MEMS-Mikrofon (SPH0645)** | 3.5mm × 2.6mm | ~4€ | Geräuscherkennung (Klatschen → Aktion) |
| **Reed-Schalter** | 2mm × 14mm | ~0,50€ | Reagiert auf Magnete (versteckte Aktivierung) |

**Killer-Kombination:**  
Ein 3D-gedruckter Schreibtisch-Würfel mit einem **Reed-Schalter** innen und einem kleinen **Neodym-Magneten** im Sockel. Wenn du den Würfel vom Sockel hebst, unterbricht der Reed-Kontakt → ein **Piezo** spielt einen Branding-Sound, eine **LED** pulsiert auf. Null WiFi, null App, rein mechanisch-elektronisch. **Kosten: <5€ pro Stück.**

---

### 🔴 Stufe 3: Aktiv-Smart (WiFi/BLE, Mikrocontroller)

Hier wird es richtig interessant. Diese Module brauchen eine Stromversorgung (LiPo-Akku oder USB-C), ermöglichen aber vollständige IoT-Konnektivität.

| Modul | Größe (mm) | Preis ca. | Konnektivität | Besonderheit |
|-------|-----------|-----------|---------------|-------------|
| **Seeed XIAO ESP32C3** | 21 × 17.5 | ~5€ | WiFi + BLE | Kleinstes vollwertiges IoT-Board. Arduino-kompatibel. |
| **Seeed XIAO ESP32C6** | 21 × 17.5 | ~7€ | WiFi 6 + BLE + Zigbee + Thread | Zukunftssicher, Smart-Home-ready |
| **ESP32 "Super Mini"** | 25 × 18 | ~3€ | WiFi + BLE | Billigster ESP32. Perfekt für Massen-Gadgets. |
| **Arduino Nano 33 BLE Sense** | 45 × 18 | ~25€ | BLE | Hat IMU, Mikro, Temperatur, Luftdruck, Geste ONBOARD |
| **Shelly Plus 1 Mini** | 39 × 36 × 16 | ~12€ | WiFi | Fertiges Relais! Steuert 240V direkt. Kein Löten. |
| **Shelly BLU Button1** | ∅36mm | ~10€ | BLE | Fertige Taste mit Bluetooth. 1 Jahr CR2032. |

**Display-Module zum Einbetten:**

| Display | Größe (aktive Fläche) | Preis | Typ | Warum geil? |
|---------|----------------------|-------|-----|-------------|
| **Waveshare 1.54" e-Paper** | 28 × 28mm | ~12€ | E-Ink (SPI) | Zeigt Bild OHNE Strom. Akku hält Monate. |
| **Waveshare 2.13" e-Paper** | 49 × 24mm | ~14€ | E-Ink (SPI) | Größer, perfekt für Visitenkarten-Größe |
| **0.96" OLED SSD1306** | 22 × 11mm | ~3€ | OLED (I2C) | Hell, kontrastreich, aber braucht dauerhaft Strom |
| **WS2812B LED-Ring** | ∅diverse | ~2-8€ | Addressable RGB | Individuell steuerbare Farb-LEDs im Ring |

**Sensor-Module:**

| Sensor | Mess-Wert | Größe | Preis |
|--------|----------|-------|-------|
| **BME280** | Temp, Luftfeuchtigkeit, Druck | 2.5 × 2.5mm | ~4€ |
| **MPU6050** | 6-Achsen Beschleunigung/Gyroskop | 4 × 4mm (Breakout: 20×16mm) | ~2€ |
| **VL53L0X** | Laser-Entfernungsmessung (bis 2m) | Breakout: 13 × 18mm | ~5€ |
| **MAX30102** | Herzfrequenz / SpO2 | 5.6 × 3.3mm | ~3€ |
| **PIR HC-SR501** | Bewegung (Infrarot) | ∅23mm | ~1,50€ |
| **BLE iBeacon** | Präsenz / Entfernung (RSSI) | ∅30mm | ~5€ |

---

## Teil 2: Konkrete Gadget-Konzepte (Die verrückten Ideen)

### 💡 Konzept A: "Der Mood-Stein" (B2B Desk-Gadget)

**Was:** Ein organisch geformter, schwerer Desk-Stein aus mattschwarzem ASA.  
**Innen:**  
- XIAO ESP32C3  
- BME280 (Temperatur + Luftfeuchtigkeit)  
- WS2812B LED-Ring (8 LEDs) unter einer transluzenten PETG-Deckschicht  
- 500mAh LiPo + USB-C Ladebuchse

**Funktion:** Der Stein "atmet" sanft in Farben, die sich nach der Raumluftqualität richten:
- **Blau** = Perfektes Raumklima (20-22°C, 40-60% rH)
- **Grün** = Leicht warm/feucht → Fenster öffnen
- **Rot** = Zu trocken oder zu heiß → CO2-Warnung (indirekt)

**Marketing-Pitch:** *"Ein Objekt, das dein Wohlbefinden spürt. Kein Screen, kein Lärm – nur Licht, das atmet."*  
**Kosten/Stück:** ~18€ (Material + Elektronik)

---

### 💡 Konzept B: "Die Sanduhr" (Meeting-Timer)

**Was:** Eine 3D-gedruckte "digitale Sanduhr" aus PC (transluzent/klar).  
**Innen:**  
- XIAO ESP32C3  
- MPU6050 (Gyro/Accelerometer)  
- 8×8 LED-Matrix (WS2812B)  
- 300mAh LiPo  

**Funktion:** Man dreht die Sanduhr physisch um → der Gyro erkennt die Rotation → die LED-Matrix startet einen visuellen Countdown (z.B. 15 Min Meeting-Timer). Die "Sand"-Pixel rieseln tatsächlich von oben nach unten durch die Matrix.  
Wenn die Zeit abläuft: Vibrationsmotor-Buzz.

**Marketing-Pitch:** *"Die physischste Art, ein Meeting zu beenden. Kein Handy, kein Screen – dreh um und die Zeit läuft."*  
**Kosten/Stück:** ~22€

---

### 💡 Konzept C: "Der Treue-Kristall" (Loyalty mit E-Ink)

**Was:** Ein geometrischer Kristall (Voronoi / Low-Poly) aus schwarzem PETG.  
**Innen:**  
- XIAO ESP32C3 (WiFi)  
- Waveshare 1.54" E-Ink Display (unter einer transparenten PETG-Facette eingelassen)  
- CR2032 Knopfzelle (kein LiPo nötig, da E-Ink nur beim Update Strom zieht)

**Funktion:** Der Kristall verbindet sich einmal täglich per WiFi mit dem Server des Kunden. Das E-Ink-Display aktualisiert sich dann:
- Aktuelles Treuepunkte-Guthaben
- Persönliche Nachricht des Unternehmens
- Tages-Coupon / Secret-Deal
- Wetter-Widget (warum nicht?)

**Da E-Ink ohne Strom das Bild hält, zeigt der Kristall permanent die letzte Info an – sogar wenn die Batterie leer ist.** Monate Laufzeit mit einer einzigen Knopfzelle.

**Marketing-Pitch:** *"Ein physisches Dashboard deiner Lieblingsmarke. Immer aktuell, immer auf deinem Schreibtisch."*  
**Kosten/Stück:** ~20€

---

### 💡 Konzept D: "Der Phantom-Trigger" (Reed-Switch Magie)

**Was:** Ein 3D-gedrucktes Firmen-Logo als Desk-Skulptur.  
**Innen (im Logo):**  
- Reed-Schalter  
- Piezo-Buzzer  
- CR2032  

**Zusätzlich (im Sockel):**  
- Neodym-Magnet (versteckt)

**Funktion:** Logo steht auf dem Sockel → Magnet hält Reed-Schalter geschlossen → Stille. Jemand hebt das Logo vom Sockel → Magnetfeld bricht ab → Reed öffnet → Piezo spielt einen kurzen Branding-Jingle oder Vibration.

**Null WiFi. Null App. Null Programmierung. Rein elektromechanisch.**

Bonus-Variante: Statt Piezo einen ESP32 mit BLE → beim Abheben vom Sockel wird ein Push-Notification ans Handy des Besitzers geschickt: *"Hey, beschäftigst du dich gerade mit [Markenname]? Hier ist dein exklusiver Deal..."*

**Kosten/Stück:** ~4€ (Basis) / ~12€ (mit ESP32 + BLE)

---

### 💡 Konzept E: "Das Atem-Objekt" (Anti-Stress Gadget)

**Was:** Ein ergonomisch geformter Handschmeichler aus TPU (flexibel, gummiartig).  
**Innen:**  
- XIAO ESP32C3  
- MAX30102 (Puls-Sensor, unter durchscheinender Stelle)  
- Vibrationsmotor  
- WS2812B (3 LEDs)  

**Funktion:** Der Nutzer legt den Daumen auf die markierte Stelle → Puls wird gemessen → das Objekt vibriert sanft im Rhythmus des eigenen Herzschlags. Die LED pulsiert synchron.
Optional: Bei hoher Herzfrequenz (>90 bpm) wechselt die Farbe zu Rot und die Vibration wird langsamer als der Puls → *biofeedback-gesteuertes Herunterregulieren.*

**Marketing-Pitch:** *"Halte dein Unternehmen in der Hand. Es spürt deinen Puls."*  
**Kosten/Stück:** ~16€

---

## Teil 3: Dein Hunde-Fontänen-Problem – Die Machbarkeitsstudie

### Die Aufgabe
> *Teichfontäne AN, sobald der Hund das Haus verlässt und den Garten betritt. AUS, wenn er nicht mehr im Garten ist.*

### Mein Lösungsansatz (3 Varianten, aufsteigend nach Komplexität):

---

### Variante 1: BLE-Beacon am Halsband + ESP32 am Teich ⭐ (Empfohlen)

```
┌─────────────────────┐      BLE Signal       ┌──────────────────────┐
│   Hund (Halsband)   │ ─────────────────────► │  ESP32 am Teichrand  │
│   BLE iBeacon       │      (< 10m RSSI)      │  + Relais-Modul      │
│   (CR2032, ~1 Jahr) │                        │  + 12V Tauchpumpe    │
└─────────────────────┘                        └──────────────────────┘
```

**Hardware-Liste:**

| Teil | Produkt | Preis ca. |
|------|---------|-----------|
| Hundehalsband-Beacon | Wasserdichter BLE iBeacon (z.B. Minew C6) | ~12€ |
| Empfänger | Seeed XIAO ESP32C3 | ~5€ |
| Schaltung | 5V Relais-Modul (opto-isoliert) | ~2€ |
| Gehäuse | 3D-gedruckt aus ASA (IP65 mit Kabelverschraubung) | ~3€ (Material) |
| Stromversorgung | 12V Netzteil (für Pumpe) + USB-C Adapter (für ESP32) | ~8€ |
| Teichpumpe | 12V DC Tauchpumpe (10W) | ~15€ |
| **Gesamt** | | **~45€** |

**Funktionslogik (ESPHome YAML):**

```yaml
esphome:
  name: gartenfonäne

esp32:
  board: seeed_xiao_esp32c3

binary_sensor:
  - platform: ble_presence
    mac_address: "XX:XX:XX:XX:XX:XX"  # MAC des iBeacon am Halsband
    name: "Hund im Garten"
    id: hund_da
    # Timeout: Wie lange kein Signal → als "weg" werten
    timeout: 30s

switch:
  - platform: gpio
    pin: GPIO4
    name: "Teichfontäne"
    id: fontaene
    restore_mode: ALWAYS_OFF

automation:
  - trigger:
      platform: state
      entity_id: binary_sensor.hund_da
    action:
      - if:
          condition:
            binary_sensor.is_on: hund_da
          then:
            - switch.turn_on: fontaene
          else:
            # 60s Verzögerung, damit die Fontäne nicht bei kurzzeitigem
            # Signalverlust sofort abschaltet (Hund hinter Hecke etc.)
            - delay: 60s
            - if:
                condition:
                  binary_sensor.is_off: hund_da
                then:
                  - switch.turn_off: fontaene
```

**Vorteile:**
- ✅ Kein Internet nötig (rein lokaler BLE-Scan)
- ✅ iBeacon am Halsband hält ~1 Jahr mit CR2032
- ✅ ESP32 + Relais ist winzig → passt in 3D-gedrucktes wetterfestes Gehäuse
- ✅ Komplett ohne App bedienbar, Plug-and-Forget

**Nachteile:**
- ⚠️ BLE-Reichweite: ~10-15m outdoor. Wenn der Garten groß ist, könnte ein zweiter ESP32 als Proxy nötig sein.
- ⚠️ Der Beacon unterscheidet nicht "im Garten" vs. "durchs Fenster im Haus nah am Teich". Man braucht eine saubere RSSI-Schwelle.

---

### Variante 2: PIR-Sensor (Infrarot-Bewegungsmelder) am Hundedurchgang

```
                    Hundeklappe / Gartentür
                          │
              ┌───────────┼───────────┐
              │     PIR HC-SR501      │
              │     (erkennt Wärme)   │
              └───────────┬───────────┘
                          │ GPIO Signal
                    ┌─────┴─────┐
                    │  ESP32    │
                    │  + Relais │
                    └─────┬─────┘
                          │ 12V
                    ┌─────┴─────┐
                    │   Pumpe   │
                    └───────────┘
```

**Funktionslogik:**
- PIR erkennt warmes Objekt (Hund) in der Durchgangszone
- ESP32 schaltet Pumpe ein
- Pumpe bleibt X Minuten an (Timer)
- Wenn PIR X Minuten lang nichts mehr erkennt → Pumpe aus

**Vorteil:** Billig (~25€ gesamt), kein Beacon am Hund nötig.  
**Nachteil:** PIR erkennt auch Katzen, Vögel, den Postboten und dich. Keine Unterscheidung.

---

### Variante 3: AI-Kamera (overkill, aber bulletproof)

**Hardware:** ESP32-CAM Modul (~8€) + TensorFlow Lite Micro  
**Funktion:** Die Kamera erkennt per On-Device ML-Modell, ob ein *Hund* (und nicht eine Katze oder ein Mensch) im Bild ist.

**Vorteil:** 100% akkurate Hundd-Erkennung, inklusive Unterscheidung von verschiedenen Tieren.  
**Nachteil:** Komplex zu implementieren, höherer Stromverbrauch, Datenschutz-Bedenken (Kamera im Garten).

---

### Meine Empfehlung: Variante 1 (BLE iBeacon)

Es ist die **sauberste Lösung**. Der Beacon am Halsband ist so leicht, dass der Hund nichts merkt. Der ESP32 am Teich scannt passiv nach dem Signal. Kommt der Hund in Reichweite → Fontäne an. Geht er rein → Fontäne aus.

Das Ganze lässt sich als **3D-gedrucktes Produkt verpacken**: Ein wetterfestes ASA-Gehäuse in Form eines Steins oder einer Gartenfigur, das am Teichrand steht und die gesamte Elektronik enthält.

---

## Teil 4: Was bedeutet das für die Website?

Statt nur NFC/QR auf der B2B-Seite zu bewerben, könnten wir die Kampagnen auf **drei Komplexitäts-Stufen** umstellen:

1. **"Passiv" (0€ Elektronik):** Thermochrome Werbemittel, die erst beim Anfassen ihr Geheimnis preisgeben
2. **"Reaktiv" (5€ Elektronik):** Der Phantom-Trigger mit Reed-Switch + Piezo. Rein mechanisch, aber magisch.
3. **"Smart" (15-25€ Elektronik):** Mood-Steine, E-Ink-Kristalle, Meeting-Timer mit Gyro-Steuerung.

Das positioniert dich nicht als "NFC-Tag-Kleber", sondern als **"Embedded-Tech-Designer für physische Markenerlebnisse"**.

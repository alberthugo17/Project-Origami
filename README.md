# Origami: NASA Planetary Analog Explorer

**Planetary Analog & Aerospace Material Explorer**: an interactive geospatial web application for mapping analog sites on Earth for prospective landing sites and bases on the **Moon** and **Mars**, while simultaneously evaluating aerospace material suitability at each location.

Developed for **NASA Space Apps Challenge, Local Event Surabaya (November 14-15, 2026)**.

## Team CyberLife - BT

| No | Member Name |
| -- | ------------ |
| 1 | Hugo Antonio Hien Wijaya |
| 2 | I Kadek Mahesa Arta Wibawa |
| 3 | Yosua Gavrilla Santoso |
| 4 | Nirwasita Dwi Ardiyanti |

Technologies: React 19, TypeScript, Tailwind CSS v4, Leaflet (Esri satellite imagery), Motion, and Vite. **No API key required.**

## How to Run the Program

> This project must be built first. Double-clicking `index.html` will display a blank page. Use one of the methods below.

**Requirements:** [Node.js LTS](https://nodejs.org) version 20 or newer, and an internet connection (for satellite maps and fonts).

### Quick start

- **Windows:** double-click `run.bat`
- **Mac / Linux:** run `./run.sh` in the terminal (if not yet executable: `chmod +x run.sh`)

The script will install dependencies, build the application, and run it at **http://localhost:4173**. Press `Ctrl+C` to stop.

### Manual setup

```bash
npm install        # install dependencies (once only)
npm run dev        # development mode: http://localhost:3000
```

or for the built version:

```bash
npm start          # build and run at http://localhost:4173
```

### Other commands

| Command | Function |
| -------- | ------ |
| `npm run build` | Builds the application into the `dist/` folder |
| `npm run preview` | Runs the existing build output |
| `npm run lint` | Runs TypeScript type checking |

### Online via GitHub Pages

1. Push the repo to GitHub (`main` branch).
2. Open **Settings > Pages > Source** and select **GitHub Actions**.
3. Wait for the "Deploy to GitHub Pages" workflow to finish in the **Actions** tab. The site will be live at `https://USERNAME.github.io/REPO-NAME/`.

## Application Features

### 1. Interactive Analog Site Map
- **14 analog sites** across 6 biomes (Volcanic, Desert, Polar, Impact Crater, Cave / Lava Tube, Hydrothermal), including 2 Indonesian sites: Kawah Ijen and Gunung Bromo / Lautan Pasir Tengger.
- **Quick search** by name, country, or biome, with instant suggestions and *Top Finding* badges.
- **Mission target filter** (All, Moon, Mars). Blue pins for the Moon, red for Mars, and split blue-red pins for dual analogs (Moon and Mars).
- **Site catalog** (drawer) sorted according to the active filter, along with Previous / Next visit history buttons.
- Zoom controls, **pin color legend**, **scale bar**, and coordinates in DMS format.
- **4 display combinations**: *Realistic* style (Esri satellite imagery) or *Lo-Fi Cartoon* (vector map with space-themed stickers), each available in **Dark** or **Light** themes.
- The map stays active in the background when switching pages, preserving the zoom position.
- Responsive layout for desktop and mobile.

### 2. Site Analysis Panel
Click a pin or a site in the catalog to fly the map to that location and open a panel containing:
- Site identity: country, elevation, biome, and **validation status** (Official NASA/ESA, Peer-Reviewed Journal, or Local Exploratory).
- **Moon and Mars similarity scores** (realistic maximum of 91.5%) along with a breakdown of 4 components: Geology & Mineralogy, Terrain & Morphology, Climate & Temperature, and Mission Validation & Heritage.
- Temperature profile, surface pH, terrain roughness, and **optimal testing season window** along with recommended experiments.
- **Top 5 materials** best suited for the site, complete with technical justifications.
- Links to data sources, scientific DOIs, and NASA NTRS.

### 3. Material Info
- Knowledge base of **12 aerospace materials** (Orthofabric, Aluminized Kapton, Silica Aerogel, Ti-6Al-4V, Nitinol, CFRP-PEEK, Al 7075-T6, Hastelloy C-276, Vectran/Kevlar, Fluorosilicone, SiC Ceramic, and Gold-coated Sapphire).
- Filter across 4 categories: Spacesuit & EVA, Transportation & Rover, Equipment & Sensors, Structure & Habitat.
- Full specifications for each material: density, operating temperature range, corrosion resistance, field limitations, and scientific references.
- **Location simulator**: select a site to view material suitability scores and engineering justifications (28% to 92% scale, 65% viability threshold).

### 4. Compare Locations (A vs B)
- Select 2 pins directly from the map (0/2, 1/2, 2/2 guide).
- Comparison of average temperature difference and diurnal swing, winner of each score component, and Top 5 materials for each location.
- Mission requirement filters and highlights of **shared materials** viable at both locations.

### 5. Data Sources
- Catalog of **13 official datasets** from NASA, ESA, JAXA, USGS, PGC ArcticDEM, BIG/PVMBG, and Esri, complete with instruments, resolution, and the role of each dataset.
- Filter by target (Moon, Mars, Earth) and link to the data analysis document (`public/docs/analisis-data.pdf`).

## Project Structure

```
.
├── src/
│   ├── App.tsx, main.tsx, index.css
│   ├── components/     Map, analysis panel, comparison, material info, data sources
│   ├── data/           Analog site data, materials, data sources, coastlines
│   ├── types/          Theme tokens (dark/light, realistic/cartoon)
│   └── utils/          Site scoring, material matching, filters, geoMath (+ unit tests)
├── public/             Static assets (logo, data analysis PDF, pitch deck PDF)
├── .github/workflows/  GitHub Pages deployment automation (deploy.yml)
├── Proposal_Origami_CyberLife_BT.docx
├── Origami_Pitch_Deck_Updated.pptx
├── run.bat / run.sh    Scripts to run the application
└── package.json, vite.config.ts, tsconfig.json, index.html
```

## Note

The data and scores in this application are summaries for competition and demonstration purposes. Verify with official sources (NASA, ESA, USGS) before using them as scientific references.
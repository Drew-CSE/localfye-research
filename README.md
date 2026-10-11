# Localfye Research Prototype

Localfye is a tourist-focused application for discovering local hidden gems and lesser-known places.

This repository contains a research prototype built with React Native, Expo, and TypeScript. It explores navigation, interactive maps, location access, and adding Gems before those features are developed in the full application.

## Research Objective

The goal of this project is to investigate how React Native and Expo can support Localfye's core functionality.

I originally wanted to explore the application's functionality on an iPhone using the Expo Go app. For the demonstration video, however, running the prototype in a web browser made more sense because it was easier to record and demonstrate without relying on a reliable Wi-Fi connection between my computer and phone.

The current map implementation runs in a **web browser** using Leaflet. It demonstrates browser map and location functionality; native mobile map functionality remains a future research step.

## Features

- **Prototype login:** Enter a username and password, then navigate to Home. The username appears in the navigation header.
- **Interactive map:** Pan and zoom an OpenStreetMap map.
- **Current location:** Request browser location permission and center the map on the returned coordinates.
- **Sample Gems:** Display Maple Mug Cafe and Corner Grill near the map center.
- **Gem details:** Click a marker to open a bottom panel with its name, category, description, price, location, and hours.
- **Add Gem:** Complete a form to create a labeled marker with your own information.
- **Basic validation:** Required fields must contain more than whitespace.

## Technologies Used

| Technology | Purpose |
|---|---|
| React Native | Application components and layout |
| Expo | Development tooling and application framework |
| TypeScript | Type checking |
| Expo Router | Navigation between screens |
| React Native Web | Browser support |
| Leaflet | Interactive browser map and markers |
| OpenStreetMap | Map tiles |
| Browser Geolocation API | Current location lookup |
| CSS | Browser map, marker, and panel styling |

## Getting Started

### Requirements

- Node.js compatible with the project's Expo SDK
- npm
- A modern web browser
- Internet access for installing dependencies and loading map tiles

### Installation

Clone the repository, open its folder in a terminal, and install dependencies:

```bash
npm install
```

### Run in a Browser

```bash
npm run web
```

Open the local URL shown in the terminal. Use the `localhost` address when testing location access.

### Run with Expo

```bash
npm start
```

You can open the application in Expo Go to test the login and navigation screens. The current map is implemented for the browser; the mobile version displays a placeholder.

## Trying the Prototype

1. Enter a username and tap **Login**. The password is not checked.
2. Allow browser location access when prompted.
3. Pan or zoom the map and click either sample Gem.
4. Click **+ Add Gem**.
5. Enter a name, description, category, price range, location, and hours.
6. Click **Submit** to add a marker.
7. Click the new marker to view the information you entered.

If location access is unavailable, denied, or times out, the application displays a message and keeps its default map centered on Manhattan.

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx       # Navigation stack and screen headers
│   ├── index.tsx         # Prototype login screen
│   └── home.tsx          # Home screen with username header and map
└── components/
    ├── gem-map.web.tsx   # Browser map, location, markers, and Add Gem form
    ├── gem-map.tsx       # Mobile map placeholder
    └── gem-map.css       # Browser map and form styling
```

## Prototype Limitations

- **No authentication:** Login only passes the username to Home.
- **No database:** Added Gems remain in memory and are lost when the page refreshes or the map screen unmounts.
- **Demo locations:** Sample Gems appear near the detected location or default map center.
- **No address lookup:** Submitted Gems receive fixed demo coordinates. Entering an address changes the displayed details, not the marker's position.
- **Browser map only:** Native mobile maps have not been implemented.
- **Location accuracy varies:** Browser coordinates may be approximate.
- **Internet is required:** Map tiles load from OpenStreetMap.

## Development Checks

Run lint:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Build the web version:

```bash
npx expo export --platform web
```

## Future Application

The full Localfye application may include user accounts, saved Gems, reviews, photos, Swag Score, verification, and database persistence.

Supabase, PostgreSQL, Supabase Auth, and Supabase Storage are possible technologies for that future work. These features and services are outside the scope of this prototype.

## Map Attribution

Map data is provided by [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). The browser map uses [Leaflet](https://leafletjs.com/).

# Control Camera Path and Animations on a Photorealistic 3D Map

## Overview

In the Maps JavaScript API (`maps3d` library), the 3D map view is modeled as a
camera looking down on a plane. You can control the camera's viewpoint,
orientation, distance, and perspective on a `<gmp-map-3d>` element using
properties and event listeners.

### Prerequisites

-   **Add an interactive, photorealistic 3D map to a web page**: Ensure the Maps
    JavaScript API bootstrap loader is configured, the `maps3d` library is
    imported, and a `<gmp-map-3d>` element is present in the DOM.

--------------------------------------------------------------------------------

## Camera Positioning Modes

The camera position and map rendering are controlled by two linked positioning
modes:

1.  **By Target Point (`center`)**: Specifies the coordinate on the map (`{ lat,
    lng, altitude }`) that the camera faces. Best used when keeping a landmark
    or specific area in focus.
2.  **By Camera Coordinates (`cameraPosition`)**: Places the camera itself at
    exact `{ lat, lng, altitude }` coordinates. Ideal for defining a precise
    viewpoint (e.g., looking out from a specific building or elevation).

> **Note:** `center` and `cameraPosition` are logically linked. When you set
> one, the other is automatically calculated based on the camera's orientation
> (`tilt`, `heading`, `roll`) and distance (`range`).

--------------------------------------------------------------------------------

## Camera Parameters Reference

Property / Attribute | Type                               | Range / Units                     | Description
:------------------- | :--------------------------------- | :-------------------------------- | :----------
`center`             | `LatLngAltitudeLiteral` / `string` | `lat`, `lng`, `altitude` (meters) | The target coordinate on the map that the camera faces. In HTML, format as `"lat,lng,altitude"`.
`cameraPosition`     | `LatLngAltitudeLiteral`            | `lat`, `lng`, `altitude` (meters) | The exact coordinate where the camera is positioned in 3D space.
`range`              | `number`                           | Meters (e.g., `100` to `10000+`)  | Physical distance in meters between the camera and the `center` target point. Controls distance-based zoom.
`fov`                | `number`                           | `5` to `80` degrees               | Vertical angle of the camera lens. Higher values (up to `80°`) act like a wide-angle lens; lower values (down to `5°`) act like a telephoto lens. Controls perspective.
`tilt`               | `number`                           | `0` to `90` degrees               | Camera angle relative to nadir (`0°` looks straight down; `90°` looks parallel to the ground).
`heading`            | `number`                           | `-180` to `180` degrees           | Compass direction of the camera (`0°` is North).
`roll`               | `number`                           | `-180` to `180` degrees           | Rotation angle of the camera around its viewing axis.

--------------------------------------------------------------------------------

## Implementation Patterns

### 1. Toggling Between `center` and `cameraPosition`

Use `center` to look *at* a location from a distance (`range`), and
`cameraPosition` to place the camera *at* a specific location and altitude.

#### HTML

```html
<gmp-map-3d
    center="40.7860524,-73.9634983"
    range="1500"
    tilt="70"
    heading="-150"
    mode="satellite"
    internal-usage-attribution-ids="gmp_git_agentskills_v1">
    <gmp-marker
        position="40.7860524,-73.9634983"
        altitude-mode="clamp-to-ground"></gmp-marker>
</gmp-map-3d>

<div id="ui-container">
    <button id="switch-mode-btn" type="button">
        Switch to Camera Position
    </button>
</div>
```

#### TypeScript / JavaScript

```typescript
async function init(): Promise<void> {
    await google.maps.importLibrary('maps3d');

    const map3DElement = document.querySelector('gmp-map-3d')!;
    const btn = document.getElementById('switch-mode-btn') as HTMLButtonElement;

    const initialCenter = { lat: 40.7860524, lng: -73.9634983, altitude: 0 };
    let isCenterMode = true;

    btn.addEventListener('click', () => {
        if (isCenterMode) {
            // Switch to Camera Position Mode:
            // Place the camera at the marker's location, 50m up in the air
            map3DElement.cameraPosition = { ...initialCenter, altitude: 50 };
            map3DElement.tilt = 80;

            btn.textContent = 'Switch to Center Mode';
            isCenterMode = false;
        } else {
            // Revert back to Center Mode (looking AT the marker)
            map3DElement.center = initialCenter;
            map3DElement.tilt = 70;
            map3DElement.range = 1500; // Restore the original range value

            btn.textContent = 'Switch to Camera Position';
            isCenterMode = true;
        }
    });
}

void init();
```

--------------------------------------------------------------------------------

### 2. Controlling Field of View (`fov`), `range`, and Listening to Camera Events

Adjusting `range` moves the camera physically closer or further from the
subject, while adjusting `fov` changes the camera lens perspective. You can also
listen to camera state change events (`gmp-headingchange`, `gmp-tiltchange`,
`gmp-rangechange`, `gmp-fovchange`) to keep application state or UI controls
synchronized.

#### HTML

```html
<gmp-map-3d
    center="40.7811,-73.9599,0"
    mode="HYBRID"
    tilt="76"
    range="3270"
    heading="-154"
    internal-usage-attribution-ids="gmp_git_agentskills_v1"></gmp-map-3d>
```

#### TypeScript / JavaScript

```typescript
async function init(): Promise<void> {
    await google.maps.importLibrary('maps3d');

    const map3DElement = document.querySelector('gmp-map-3d')!;

    // Programmatically update camera perspective and orientation
    const setCameraView = (options: {
        lat?: number;
        lng?: number;
        altitude?: number;
        heading?: number;
        tilt?: number;
        range?: number;
        fov?: number;
        roll?: number;
    }) => {
        const currentCenter = map3DElement.center;
        if (currentCenter && (options.lat !== undefined || options.lng !== undefined || options.altitude !== undefined)) {
            map3DElement.center = {
                lat: options.lat ?? currentCenter.lat,
                lng: options.lng ?? currentCenter.lng,
                altitude: options.altitude ?? currentCenter.altitude,
            };
        }

        if (options.heading !== undefined) map3DElement.heading = options.heading;
        if (options.tilt !== undefined) map3DElement.tilt = Math.max(0, options.tilt);
        if (options.range !== undefined) map3DElement.range = options.range;
        if (options.fov !== undefined) map3DElement.fov = Math.min(80, Math.max(5, options.fov));
        if (options.roll !== undefined) map3DElement.roll = options.roll;
    };

    // Synchronize state when the user or code modifies the camera
    const onCameraUpdate = () => {
        const heading = map3DElement.heading?.toFixed(0) ?? '0';
        const tilt = map3DElement.tilt?.toFixed(0) ?? '0';
        const range = map3DElement.range?.toFixed(0) ?? '0';
        const rawFov = parseFloat(map3DElement.fov?.toFixed(0) ?? '45');
        const fov = Math.min(80, Math.max(5, rawFov)).toString();
        const roll = map3DElement.roll?.toFixed(0) ?? '0';
        const center = map3DElement.center;

        if (center) {
            console.log(
                `Camera updated -> Center: ${center.lat.toFixed(4)},${center.lng.toFixed(4)} | ` +
                `Range: ${range}m | FOV: ${fov}° | Tilt: ${tilt}° | Heading: ${heading}° | Roll: ${roll}°`
            );
        }
    };

    // Listen to 3D map camera change events
    map3DElement.addEventListener('gmp-headingchange', onCameraUpdate);
    map3DElement.addEventListener('gmp-tiltchange', onCameraUpdate);
    map3DElement.addEventListener('gmp-rangechange', onCameraUpdate);
    map3DElement.addEventListener('gmp-fovchange', onCameraUpdate);
}

void init();
```

--------------------------------------------------------------------------------

## Best Practices & Guardrails

-   **Clamping `fov` and `tilt`**: Always clamp `fov` values between `5` and
    `80` degrees (`Math.min(80, Math.max(5, val))`) and ensure `tilt` is
    non-negative (`Math.max(0, val)`).
-   **Restoring `range` After `cameraPosition`**: Switching to `cameraPosition`
    alters the relationship with `center`. When switching back to `center` mode,
    explicitly set `map3DElement.range` to restore your desired viewing
    distance.
-   **Updating `center` Coordinates Partially**: `map3DElement.center` expects a
    complete `{ lat, lng, altitude }` object. When updating a single coordinate
    (such as `altitude` or `lat`), read `map3DElement.center` first and spread
    or copy the existing properties into the new object assignment.
-   **Preventing UI Feedback Loops**: When binding interactive sliders or inputs
    to `gmp-*change` events, track an `isUserInteracting` boolean flag during
    `input`/`change` events so that incoming map events do not overwrite active
    user input.

# Customize the controls that appear on a photorealistic 3D map

The 3D Maps in Maps JavaScript API display UI elements known as **exploration
controls** by default to support user interaction with the map. You can
customize the map UI by hiding these default controls for simplicity or to leave
room for custom UI elements.

> **Note:** Keyboard shortcuts for map exploration remain available even when
> the UI controls are disabled.

## Prerequisites

-   **Add an interactive, photorealistic 3D map to a web page:** Ensure the Maps
    JavaScript API is loaded and the `maps3d` library is imported.

## Default Exploration Controls

By default, a 3D map displays the following full set of exploration controls:

-   **Zoom control:** Displays `+` and `-` buttons for changing the zoom level
    (range) of the map.
-   **Move control:** Displays `←`, `→`, `↑`, and `↓` buttons for
    panning/changing the center of the map.
-   **Rotate controls:** Lets the user change the camera's heading.
-   **Tilt control:** Lets the user change the camera's tilt angle.
-   **Compass control:** Indicates the direction of compass north and allows
    resetting the camera to a northerly heading.

--------------------------------------------------------------------------------

## Toggling Exploration Controls

You can hide the default exploration controls either programmatically in
JavaScript using the `defaultUIHidden` property on `Map3DElement`, or
declaratively in HTML using the `default-ui-disabled` attribute on the
`<gmp-map-3d>` web component.

### 1. Programmatic Approach (JavaScript / TypeScript)

Set `defaultUIHidden: true` when instantiating `Map3DElement` from the `maps3d`
library.

```javascript
async function initMap() {
  const { Map3DElement, MapMode } = await google.maps.importLibrary("maps3d");

  const map = new Map3DElement({
    center: { lat: 37.819852, lng: -122.478549, altitude: 2000 },
    tilt: 75,
    heading: 330,
    mode: MapMode.SATELLITE,
    defaultUIHidden: true,
  });

  // Set usage attribution ID on the underlying custom element
  map.setAttribute("internal-usage-attribution-ids", "gmp_git_agentskills_v1");

  document.body.append(map);
}

initMap();
```

### 2. Declarative Approach (HTML Web Component)

Add the boolean attribute `default-ui-disabled` directly to the `<gmp-map-3d>`
element.

```html
<gmp-map-3d
  mode="hybrid"
  range="639.274301042242"
  tilt="64.92100184857551"
  center="34.0768990953219,-118.47450491266041,292.9794737933403"
  heading="-61.02026752077781"
  default-ui-disabled
  internal-usage-attribution-ids="gmp_git_agentskills_v1"
></gmp-map-3d>
```

### 3. React (`@vis.gl/react-google-maps`)

When using the `@vis.gl/react-google-maps` library, you can configure the
`<Map3D>` component and overlay your own custom control panels in the DOM
alongside the map.

Reference implementation pattern from
[examples/map-3d-markers/src/app.tsx](https://github.com/visgl/react-google-maps/blob/HEAD/examples/map-3d-markers/src/app.tsx?utm_campaign=gmp_git_agentskills_v1):

```tsx
import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Map3D, MapMode } from '@vis.gl/react-google-maps/3d';

const App = () => {
  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={['maps3d']}>
      <Map3D
        mode={MapMode.SATELLITE}
        defaultCenter={{ lat: 37.819852, lng: -122.478549, altitude: 2000 }}
        defaultTilt={75}
        defaultHeading={330}
        defaultUIHidden={true}
        internalUsageAttributionIds={['gmp_git_agentskills_v1']}
      />
    </APIProvider>
  );
};

export default App;
```

--------------------------------------------------------------------------------

## Related Capabilities & Next Steps

-   **Restrict the map and camera:** To enforce boundaries on latitude,
    longitude, altitude, and camera behavior rather than just hiding UI buttons,
    see
    [Control the map and camera](https://developers.google.com/maps/documentation/javascript/3d/interaction).
-   **Handle user interactions:** To respond to clicks and camera changes
    programmatically, see
    [Listen for and handle user interaction](https://developers.google.com/maps/documentation/javascript/3d/map-events).

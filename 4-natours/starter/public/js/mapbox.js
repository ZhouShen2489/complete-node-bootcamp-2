/*eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoibm9haHNoZW56aG91IiwiYSI6ImNtZDVrazQwaTAwa3EybW9sd3B4MzB2YncifQ.QuC-HB9KYotDqZGcF25-0Q';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/noahshenzhou/cmd5ljo76031u01rfafmj77ek',
    scrollZoom: false
    //   center: [-118.113491, 34.111745], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //   zoom: 9, // starting zoom
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    const popup = new mapboxgl.Popup({
      offset: 30,
      closeOnClick: false
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Track if popup is open
    let isPopupOpen = false;

    // Show popup on marker click
    marker.getElement().addEventListener('click', () => {
      if (!isPopupOpen) {
        popup.addTo(map).setLngLat(marker.getLngLat());
        isPopupOpen = true;
      }
    });

    // Update state when popup is closed
    popup.on('close', () => {
      isPopupOpen = false;
    });

    // Extend map bounds to includes current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100
    }
  });
};

if (list.geometry?.coordinates?.length === 2) {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    center: list.geometry.coordinates,
    zoom: 9,
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(list.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${list.title}</h3>
                     <p>Exact location will be provided after booking</p>`,
      ),
    )
    .addTo(map);
}

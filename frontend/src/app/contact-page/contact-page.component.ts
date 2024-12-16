import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: 39.095670, lng: -77.131310 },
    zoom: 18,
    draggable: false, // Disables panning (moving the map)
    streetViewControl: false, // Disables Street View
    zoomControl: true, // Optionally enable zoom controls
    scrollwheel: false, // Disables zooming with the scroll wheel
    disableDoubleClickZoom: true, // Disables zooming with double-click
  };

  marker = { position: { lat: 39.095670, lng: -77.131310 } }

}

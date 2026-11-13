"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type Pin = { id: number; name: string; address: string; stage: string; lat: number; lng: number };

/** Leaflet map with OpenStreetMap tiles. Centered on Los Angeles County, or fitted to the pins. */
export function MapView({ pins }: { pins: Pin[] }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: true }).setView([34.15, -118.25], 9);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const icon = L.divIcon({ className: "", html: '<div class="mapPin"></div>', iconSize: [22, 22], iconAnchor: [11, 22], popupAnchor: [0, -22] });
      const markers = pins.map((p) => {
        // Build the popup with DOM text nodes so saved text is never interpreted as HTML.
        const box = document.createElement("div");
        box.className = "popup";
        const name = document.createElement("strong");
        name.textContent = p.name;
        box.append(name);
        if (p.address) {
          const a = document.createElement("span");
          a.textContent = p.address;
          box.append(a);
        }
        if (p.stage) {
          const s = document.createElement("span");
          s.textContent = `Stage: ${p.stage}`;
          box.append(s);
        }
        const actions = document.createElement("div");
        actions.className = "popupActions";
        const open = document.createElement("a");
        open.href = `/projects/${p.id}?from=${encodeURIComponent("/map")}`;
        open.textContent = "Open project";
        const dir = document.createElement("a");
        dir.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address || `${p.lat},${p.lng}`)}`;
        dir.target = "_blank";
        dir.rel = "noreferrer";
        dir.textContent = "Directions";
        actions.append(open, dir);
        box.append(actions);
        return L.marker([p.lat, p.lng], { icon, title: p.name, alt: p.name, keyboard: true }).bindPopup(box).addTo(map!);
      });
      if (markers.length === 1) map.setView(markers[0].getLatLng(), 14);
      else if (markers.length > 1) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.15));
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [pins]);
  return <div ref={el} className="map" role="region" aria-label={`Map of ${pins.length} project ${pins.length === 1 ? "pin" : "pins"}`} />;
}

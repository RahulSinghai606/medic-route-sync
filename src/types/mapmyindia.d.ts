
declare namespace MapmyIndia {
  class Map {
    constructor(element: HTMLElement, options: MapOptions);
    fitBounds(bounds: LatLngBounds, options?: FitBoundsOptions): this;
    getLayer(id: string): any;
    getSource(id: string): any;
    removeLayer(layer: any): void;
    on(event: string, listener: Function): this;
    remove(): void;
  }
  
  interface MapOptions {
    center: [number, number];
    zoom: number;
    search?: boolean;
    location?: boolean;
  }
  
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }
  
  class LatLngBounds {
    constructor();
    extend(latLng: LatLng): this;
    isValid(): boolean;
  }
  
  interface FitBoundsOptions {
    padding?: number;
    maxZoom?: number;
  }
  
  class Marker {
    constructor(options: MarkerOptions);
    remove(): void;
  }
  
  interface MarkerOptions {
    map: Map;
    position: LatLng;
    icon?: string;
    draggable?: boolean;
    title?: string;
  }
  
  class Popup {
    constructor();
    setLatLng(latLng: LatLng): this;
    setContent(content: string): this;
    addTo(map: Map): this;
  }
  
  class Polygon {
    constructor(options: PolygonOptions);
  }
  
  interface PolygonOptions {
    map: Map;
    paths: any[][];
    strokeColor: string;
    strokeOpacity: number;
    strokeWeight: number;
  }
  
  class DirectionService {
    route(options: DirectionOptions, callback: (result: any) => void): void;
  }
  
  interface DirectionOptions {
    origin: string;
    destination: string;
    alternatives?: boolean;
    resource?: string;
  }
}

interface Window {
  MapmyIndia: typeof MapmyIndia;
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"; 
import { Observable } from "rxjs";

@Injectable
  ({
    providedIn: 'root'
  })
export class NominatimService{
  private apiUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';

  constructor(private http: HttpClient) {}

  searchPlace(placeName: string) {
    const url = `${this.apiUrl}${encodeURIComponent(placeName)}`;
    return this.http.get(url);
  }

  searchAddress(params: any): Observable<any> {
    const url = `${this.apiUrl}&${this.serializeParams(params)}`;
    return this.http.get(url);
  }

  searchAddres(params: any): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(params).toString()}`;
    return this.http.get(url);  // Supondo que você esteja usando HttpClient
  }
  

  private serializeParams(params: any): string {
    return Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
}


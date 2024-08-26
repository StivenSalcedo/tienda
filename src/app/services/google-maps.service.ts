import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GoogleMapsService {
ApiKey:string='AIzaSyBvYkMQby0QFnb5B3XYZzTEXTMGBJdYPr8';
  constructor(private http: HttpClient) {}

  getAddress(lat: number, lng: number, apiKey: string): Observable<any> {
    if(apiKey=='')
    {
      apiKey=this.ApiKey;
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    return this.http.get(url);
  }

  reverseGeocode(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.ApiKey}`;
    return this.http.get(url);
    
  }

  
}

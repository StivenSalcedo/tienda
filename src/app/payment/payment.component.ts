import { Component, Input, OnInit, afterRender  } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import{CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-payment-process',
 templateUrl: './payment.component.html',
  styleUrl: './payment.component.sass',
  standalone: true,
  imports: [CommonModule]
})
export class PaymentComponent implements OnInit {
  steps = ['Pedido', 'Datos de contacto', 'Método de pago', 'Confirmación'];
  currentStep:number = 0;
  city: string = '';
  constructor(private httpClient: HttpClient) { }

  ngOnInit(){
    this.getCurrentCity();
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
    }
  }

  getCurrentCity() {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.reverseGeocode(lat, lng);
    });
  }

  reverseGeocode(lat: number, lng: number) {
    const apiKey = 'AIzaSyBvYkMQby0QFnb5B3XYZzTEXTMGBJdYPr8';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    
    this.httpClient.get(url).subscribe((response: any) => {
      if (response.results && response.results.length > 0) {
        this.city = response.results[0].address_components.find(
          (component: any) => component.types.includes('locality')
        )?.long_name || 'Ciudad no encontrada';
      }
    });
  }
}
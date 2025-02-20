/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

fetch('/assets/config.json')
  .then((response) => response.json())
  .then((config) => {
    (window as any).config = config; // Guardar globalmente la configuración*/
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
})
.catch((err) => {
  console.error('Error cargando config.json', err);
});
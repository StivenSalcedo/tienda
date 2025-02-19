/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';

  function loadConfig(http: HttpClient): Promise<void> {
    return http.get('/assets/config.json').toPromise().then((config: any) => {
      (window as any).config = config; // Guarda la config en una variable global
    });
  }

  fetch('/assets/config.json')
  .then((response) => response.json())
  .then((config) => {
    (window as any).config = config; // Guardar globalmente la configuración
    bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
  })
  .catch((err) => {
    console.error('Error cargando config.json', err);
  });

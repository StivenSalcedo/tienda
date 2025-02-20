import { ApplicationConfig, importProvidersFrom, inject} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {  provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {

  providers: [provideHttpClient(),provideRouter(routes), provideClientHydration(withEventReplay()),importProvidersFrom([BrowserAnimationsModule])]
};


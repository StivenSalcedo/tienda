import { ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';


export const appConfig: ApplicationConfig = {
 
  providers: [provideRouter(routes), provideClientHydration(),provideHttpClient(),NgbCarousel]
};

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor(@Inject(DOCUMENT) private document: Document) {
  }
  // BehaviorSubject que contendrá los datos actualizados de la caché.
  public cache$ = new BehaviorSubject<any>({});

  // El método 'set' para almacenar datos en la caché.
  set(key: string, data: any[], date: Date): void {
    // Si no existen datos para esta clave, los almacenamos en la caché y actualizamos el BehaviorSubject.
    var localStorage = this.document.defaultView?.localStorage;
    var d = { data: data, expire: date }
    localStorage?.setItem(key, JSON.stringify(d));
    this.cache$.next(data);
  }

  // El método 'get' para recuperar datos de la caché.
  get(key: string, minutes?: number): any {
    if (!minutes) { minutes = 30 };
    var localStorage = this.document.defaultView?.localStorage;
    var stringdata = localStorage?.getItem(key);
    var data = null;
    if (stringdata != null) {
      data = JSON.parse(stringdata);
    }

    //console.log('data', data);
    if (data != null) {
      console.log(new Date((+new Date(data.expire) + (60000 * minutes))));
      if (new Date((+new Date(data.expire) + (60000 * minutes))) > (new Date())) {

        this.cache$.next(data);
        return data.data;
      }
      else {
        this.clear(key);
        return null;
      }

    }
    else {
      return null;
    }
  }

  // El método 'clear' para borrar datos de la caché.
  clear(key: string): void {
    // Eliminamos los datos de la caché y actualizamos el BehaviorSubject.
    localStorage?.removeItem(key);
    this.cache$.next({});
  }
}
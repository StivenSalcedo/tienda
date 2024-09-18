import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, afterRender, PLATFORM_ID, Inject, Optional } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, OperatorFunction, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { orderByPipe } from '../pipes/main.pipe';
import { ApiService } from '../services/api.service';
import { CacheService } from '../services/cache.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { GoogleMapsService } from '../services/google-maps.service';
import { request } from 'http';


@Component({
  selector: 'app-payment-process',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.sass',
  standalone: true,
  imports: [CommonModule, NgbTypeaheadModule, FormsModule, JsonPipe, orderByPipe, ReactiveFormsModule, HeaderComponent],
  providers: [orderByPipe]
})
export class PaymentComponent implements OnInit, AfterContentInit {
  steps = ['Pedido', 'Datos de contacto', 'Método de pago', 'Confirmación'];
  currentStep: number = 0;
  city: string = '';
  citiestemp: any = [];
  cities: any = [];
  Data: any = {};
  PaymentMethods: any = [];
  PaymentMethod: any = {};

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private order: orderByPipe, private Service: ApiService, private cacheService: CacheService, private _router: Router, private mapsService: GoogleMapsService) {

   
  }

  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  @ViewChild('ClientName') ClientName: ElementRef | undefined;
  @ViewChild('instance1') instance1: ElementRef | undefined;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  form!: UntypedFormGroup;
  //form!: FormGroup;
  loading = false;
  cartItems: any = [];
  lat: any = 0;
  lng: any = 0;


  ngOnInit() {


    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)]),
      complemento: new UntypedFormControl(null),
      address: new UntypedFormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9, ñÑáéíóúÁÉÍÓÚ\s#-]+$")]),
      phone: new UntypedFormControl(null, [Validators.required, Validators.pattern("^((?=(?:.{7}|.{10}|.{13})$)[0-9]*)$")]),
      city: new UntypedFormControl(null, [Validators.required]),
      mail: new UntypedFormControl(null, [Validators.required, Validators.pattern("^([A-Za-z0-9._%\+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,3})$")]),

    });
    this.loadPaymentMethods().then((data: any) => {
      this.PaymentMethods = data;
      if (this.PaymentMethods.length == 1) {
        this.PaymentMethod = this.PaymentMethods[0];
        this.steps = ['Pedido', 'Datos de contacto', 'Confirmación'];
        console.log('this.PaymentMethod', this.PaymentMethod);
      }

    });
    this.getItemsCart();
    


  }
  removeItem(id: number) {
    var cachedData = this.cacheService.get('cart', 600);
    cachedData = cachedData.filter((item: { id: number; }) => item.id !== id);
    this.cacheService.set('cart', cachedData, new Date());
    this.getItemsCart();
  }

  updateQuantity(id: number, newQuantity: number) {
    console.log(newQuantity)
    this.cartItems.find((item: { id: number; }) => item.id === id).quantity = newQuantity;
    this.cacheService.set('cart', this.cartItems, new Date());
    this.getItemsCart();
  }

  getTotal() {
    return this.cartItems.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
  }

  getItemsCart(): any[] {
    var c = this.cacheService.get('cart', 600);
    if (c != null) {
      this.cartItems = c;

    }
    else {
      this.cartItems = [];

    }
    return this.cartItems;

  }


  async loadCities(url: string, assign: boolean): Promise<any> {

    return this.Service.getPosts('get', {}, url)
      .subscribe({
        next: (cities: any) => {
          this.citiestemp = cities;
          this.citiestemp = this.citiestemp.data;
          if (this.citiestemp.length == 1 && assign) {
            this.Data.city = this.citiestemp[0];

            //this.cities.push(this.citiestemp[0]);
          }
          else if (this.citiestemp.length >= 1) {
            this.cities = this.citiestemp;
          }
          return this.cities;


        },
        error: error => {
          return [];
        }
      });

  }

  loadPaymentMethods(): any {
    return new Promise(resolve => {
      this.Service.getPosts('get', {}, '/metodos-de-pagos?populate=*').subscribe({
        next: (data: any) => {
          resolve(data.data);
        },
        error: error => {
          resolve([]);
        }
      });
    })

  }
  Focused() {
    setTimeout(() => {
      try {
        if (this.Data.city.id > 0) {
          this.ClientName?.nativeElement.focus();
        }
        else {
          this.instance1?.nativeElement.focus();
        }
      }
      catch (ex) { }

    }, 500)
  }

  getcurrentStep() {
    try {
      return this.steps[this.currentStep].toLowerCase();
    }
    catch (ex) {
      return '';
    }

  }

  nextStep() {
    if (this.currentStep <= this.steps.length - 1) {
      this.currentStep++;
    }
    console.log(this.currentStep);
    if (this.currentStep === this.steps.length) {
      this.Data.ciudad = this.Data.city.id;
      var Order: any = { data: {} };
      Order.data = this.Data;
      Order.data.city = null;
      Order.data.celular = String(Order.data.celular);
      Order.data.productos = this.cartItems;
      this.Service.getPosts('post', Order, 'ordenes')
        .subscribe({
          next: order => {
            //this.cacheService.set('cart', [], new Date());
          },
          error: error => {

          }
        });
    }
    else if (this.steps[this.currentStep].toLowerCase() == 'datos de contacto') {
      this.Focused();

    }
    else if (this.steps[this.currentStep].toLowerCase() == 'método de pago') {

      if (this.PaymentMethods.length == 1) {
        this.PaymentMethod = this.PaymentMethods[0];
        this.currentStep++;
      }
    }
    else if (this.steps[this.currentStep].toLowerCase() == 'confirmación') {


    }

  }

  prevStep() {
    if (this.getcurrentStep() == '') {
      this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this._router.navigate(['/']));
      // this._router.navigate(['']);
    }
    if (this.currentStep > 0) {
      // this.goToStep(this.currentStep-1);
      this.currentStep--;
    }

    else if (this.steps[this.currentStep].toLowerCase() == 'método de pago') {

      if (this.PaymentMethods.length == 1) {
        this.PaymentMethod = this.PaymentMethods[0];
        this.currentStep = 1;
      }
    }
  }

  goToStep(step: number) {
    if (step >= 0 && step < this.steps.length) {
      if (this.steps[step].toLowerCase() == 'método de pago') {

        if (this.PaymentMethods.length == 1) {
          this.PaymentMethod = this.PaymentMethods[0];
          this.currentStep = 3;
        }
      }
      else {
        this.currentStep = step;
      }

    }
    this.Focused();
  }

  getCurrentCity() {
    try {
    navigator?.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.lat = lat;
      this.lng = lng;
      console.log('position', position);
      //this.getAddress(lat, lng);
      this.reverseGeocode(lat, lng);

    })
     }
     catch (ex) { }
  }
  ngAfterContentInit() {
    this.loadCities('/ciudades?sort=orden:asc&pagination[start]=0&pagination[limit]=10&populate=*', false);
    setTimeout(() => {
      this.getCurrentCity();
    }, 1500)


  }


  search: OperatorFunction<string, readonly { attributes: { nombre: string } }[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
    const inputFocus$ = this.focus$;



    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) => {
        if (term != '' && term != null) {
          this.loadCities('/ciudades?filters[nombre][$containsi]=' + term + '&sort=orden:asc&pagination[start]=0&pagination[limit]=10&populate=*', true);
          return this.cities.filter((v: { attributes: { nombre: string } }) => v.attributes.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);

        }
        else {
          this.loadCities('/ciudades?sort=orden:asc&pagination[start]=0&pagination[limit]=10&populate=*', false);
          return this.cities;
        }

      }
        ,
      ),
    );
  };


  formatter = (x: { attributes: { nombre: string } }) => x.attributes.nombre;


  getAddress(lat: number, lng: number) {
    if (lat == 0) {
      lat = this.lat;
    }
    if (lng == 0) {
      lng = this.lng;
    }
   
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.lat=lat;
      this.lng=lng;
    
      this.mapsService.getAddress(lat, lng, '').subscribe(
        (response) => {
          if (response.results && response.results.length > 0) {
            this.Data.direccion = response.results[0].formatted_address;
            this.Data.complemento = response.results[0].formatted_address;
          }
        },
        (error) => console.error('Error fetching address:', error)
      );

    })
    

  }


  reverseGeocode(lat: number, lng: number) {
    this.mapsService.reverseGeocode(lat, lng).subscribe(
      (response: any) => {
        console.log('response', response);
        if (response.results && response.results.length > 0) {
          this.city = response.results.find((component: any) => component.address_components.find((c: any) => c.types.includes('locality') && component.address_components[0].long_name == c.long_name))?.address_components[0]?.long_name || '';
          console.log('city', this.city);
          var filterCity = "filters[nombre][$eqi]=";
          if (this.city != "" && this.city != null) {
            filterCity += this.city;
          }
          else {
            filterCity = '';
          }
          console.log('/ciudades?' + filterCity + '&sort=orden:asc&pagination[start]=0&pagination[limit]=10&populate=*');
          this.loadCities('/ciudades?' + filterCity + '&sort=orden:asc&pagination[start]=0&pagination[limit]=10&populate=*', true);
          // this.Focused();
        }
      },
      (error) => console.error('Error fetching address:', error)
    );
  }




}

import { Component, ElementRef, EventEmitter, Inject, NgModule, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MainPipe, orderByPipe } from '../pipes/main.pipe';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbOffcanvas, NgbOffcanvasConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CacheService } from '../services/cache.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
  standalone: true,
  imports: [CommonModule,orderByPipe,FormsModule, NgbCarouselModule],
  // add NgbModalConfig and NgbModal to the component providers
	providers: [NgbModalConfig, NgbModal, NgbOffcanvas, NgbOffcanvasConfig],

})


export class HeaderComponent implements OnInit,OnDestroy {
  LoadData:boolean=true;
  Menu:any=[];
  Categories:any=[];
  SearchProduct: string = '';
  Products:any=[];
  ProductsFiltered: any = [];
  FocusInput:boolean=false;
  @ViewChild('Search') Search: ElementRef | undefined;
  private cacheSubscription: Subscription = new Subscription;
  
  
  constructor(private cacheService: CacheService, private Service: ApiService, private http: HttpClient, private _router: Router, config: NgbModalConfig, private modalService: NgbModal, private offcanvasService: NgbOffcanvas,) {

    // customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
    config.fullscreen = true;
    config.backdropClass = 'bg-white';
    
  }

  open(content: any) {
		this.modalService.open(content);
	}

  openTwo(contents: any) {
		this.offcanvasService.open(contents);
	}
  
  ngOnInit(): void {
     // Nos suscribimos al BehaviorSubject en el servicio de caché para recibir actualizaciones de datos.
    this.cacheSubscription = this.cacheService.cache$.subscribe(data => {
    // this.data = data;
     // console.log('this.data',this.data);
    //  console.log(this.data);
    });

    

    this.loadMenu('/paginas?filters[tipo][nombre][$eq]=pagina&populate=*');
    this.loadCategories('/categorias?populate=*');
    this.loadProducts('/productos?populate=*');
  
  }

  ngOnDestroy(): void {
   this.cacheSubscription.unsubscribe();
  }

  loadCategories(url:string) {
  const cachedData = this.cacheService.get(url,60);
  if (cachedData==null) {
    this.Service.getPosts('get', {}, url)
        .subscribe({
            next: categories => {
                this.Categories = categories;
                this.Categories = this.Categories.data;
                try {
                  this.cacheService.set(url, this.Categories,new Date());
                } catch (error) {
                  console.error(error);
                  // maneja el error como prefieras aquí
                }
            },
            error: error => {

            }
        });
      }
      else
      {
        this.Categories=cachedData;
      }
}

loadProducts(url:string) {
  const cachedData = this.cacheService.get(url,60);
  if (cachedData==null) {
  this.Service.getPosts('get', {}, url)
      .subscribe({
          next: data => {
              this.Products = data;
              this.Products = this.Products.data;
              this.Products.forEach((data: any, index2: number) => {
                  if (data.attributes.imagen.data != null) {
                      var MainImage = data.attributes.imagen.data.filter((data1: any) => { return data1.attributes.caption == "1"; });
                      if (MainImage.length > 0) {
                          data.imagen = MainImage[0].attributes;
                          if (!data.imagen.url.includes('http')) {
                              var img = this.Service.urlBase + data.imagen.url;
                              data.imagen.url = img;
                          }
                      }
                      else if (data.attributes.imagen.data.length > 0) {
                          data.imagen = data.attributes.imagen.data[0].attributes;
                          if (!data.imagen.url.includes('http')) {
                              var img = this.Service.urlBase + data.imagen.url;
                              data.imagen.url = img;
                          }
                      }
                      else {
                          data.imagen = {};
                          data.imagen.url = this.Service.urlBase + "/uploads/blanco_17b7000fd4.jpg";
                      }
                  }
                  else {
                      data.imagen = {};
                      data.imagen.url = this.Service.urlBase + "/uploads/blanco_17b7000fd4.jpg";
                  }
              })
              this.LoadData=false;
              try {
                this.cacheService.set(url, this.Products,new Date());
              } catch (error) {
                console.error(error);
                // maneja el error como prefieras aquí
              }
          },
          error: error => {

          }
      });
    }
    else
    {
      this.Products=cachedData;
    }
}

Focus(value:string)
{
  setTimeout(() => {
    this.Search?.nativeElement.focus();
}, 500)
}

SearchProducts() {
  this.ProductsFiltered=[];
  setTimeout(() => {
  if(this.SearchProduct!="" && this.SearchProduct!=null)
  {
      this.ProductsFiltered= this.Products.filter((c: any) => { return c.attributes.titulo.toLowerCase().indexOf(this.SearchProduct.toLowerCase()) !== -1 });
  }
}, 1000)
  
 
}


redirectTo(uri: string) {
  this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this._router.navigate([uri]));

}

  loadMenu(url:string){
    const cachedData = this.cacheService.get(url,1);
  if (cachedData==null) {
        //'/paginas?filters[$or][0][tipo][nombre][$eq]=pagina&filters[$or][1][tipo][nombre][$eq]=footer&populate=*'
        this.Service.getPosts('get', {}, url)
        .subscribe({
          next: data => {
            this.Menu= data;
            try {
              this.cacheService.set(url, this.Menu,new Date());
            } catch (error) {
              console.error(error);
              // maneja el error como prefieras aquí
            }
            this.Menu= this.Menu.data.filter((data: any) => {
              return data.attributes.menu>0 && data.attributes.tipo.data.attributes.nombre=='pagina';
            });
            
            
          },
          error: error => {
          }
        });
       }
      else {
        this.Menu=cachedData;
        this.Menu= this.Menu.data.filter((data: any) => {
          return data.attributes.menu>0 && data.attributes.tipo.data.attributes.nombre=='pagina';
        });
      }
  }

}

import { Component, ElementRef, EventEmitter, Inject, NgModule, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MainPipe, orderByPipe } from '../pipes/main.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
  standalone: true,
  imports: [CommonModule,
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
orderByPipe,FormsModule],

})


export class HeaderComponent implements OnInit {
  LoadData:boolean=true;
  Menu:any=[];
  Categories:any=[];
  SearchProduct: string = '';
  Products:any=[];
  ProductsFiltered: any = [];
  FocusInput:boolean=false;
  @ViewChild('Search') Search: ElementRef | undefined;

  constructor(private Service: ApiService, private http: HttpClient, private _router: Router,@Inject(DOCUMENT) private document: Document) {
   
     
  }
  
  ngOnInit(): void {
    this.loadMenu(true);
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.Service.getPosts('get', {}, '/categorias?populate=*')
        .subscribe({
            next: categories => {
                this.Categories = categories;
                this.Categories = this.Categories.data;
            },
            error: error => {

            }
        });
}

loadProducts() {
  this.Service.getPosts('get', {}, '/productos?populate=*')
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
          },
          error: error => {

          }
      });
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

  loadMenu(reload:boolean){
    var localStorage = this.document.defaultView?.localStorage;
    var localdata =reload?null: localStorage?.getItem('paginas');
    var CurrentDate=new Date();
       if (localdata == null) {
        //'/paginas?filters[$or][0][tipo][nombre][$eq]=pagina&filters[$or][1][tipo][nombre][$eq]=footer&populate=*'
        this.Service.getPosts('get', {}, '/paginas?filters[tipo][nombre][$eq]=pagina&populate=*')
        .subscribe({
          next: data => {
            this.Menu= data;
            this.Menu= this.Menu.data.filter((data: any) => {
              return data.attributes.menu>0 && data.attributes.tipo.data.attributes.nombre=='pagina';
            });
            this.Menu.forEach((data: any, index2: number) => {
              data.localcreated=CurrentDate;
              data.menu=data.attributes.menu;
            })
          },
          error: error => {
          
          }
         

          
        });
       
     
       }
      else {
        this.Menu=JSON.parse(localdata);
        this.Menu=this.Menu.data;
        var CurrentDate1=CurrentDate.getDate()-1;
        this.Menu =this.Menu.filter((data: any) => {
          var current=new Date(data.localcreated);
          return current.getDate()>CurrentDate1 && data.attributes.menu>0;
        });
        this.Menu.forEach((data: any, index2: number) => {
          data.menu=data.attributes.menu;
        })
        if(this.Menu.length==0)
        {
          this.loadMenu(true);
        }
      
      }
     
      
  }

}

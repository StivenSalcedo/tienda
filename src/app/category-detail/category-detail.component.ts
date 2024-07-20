import { afterRender, Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT ,LowerCasePipe, CurrencyPipe} from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { orderByPipe } from '../pipes/main.pipe';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, LowerCasePipe, CurrencyPipe, orderByPipe, HeaderComponent, FooterComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.sass'
})
export class CategoryDetailComponent {
  Products: any = [];
  Categories: any = [];
  CurrentCategory: any={};
  Pages: any = [];
  Promotion: any = [];
  Testimonials: any = [];
  Blog: any = [];
  Slider: any = [];
  Footer: any = [];
  Loading: boolean = true;
  public Links: any = [];
  CategoryId: string | null;
  CategoryName: string | null;
  showImage: boolean=true;
  constructor(private _Activatedroute: ActivatedRoute,private Service: ApiService, private http: HttpClient, private _router: Router, @Inject(DOCUMENT) private document: Document, private sanitizer: DomSanitizer) {
    this.CategoryId = this._Activatedroute.snapshot.queryParamMap.get("Id");
    this.CategoryName = this._Activatedroute.snapshot.queryParamMap.get("c");
    if ((this.CategoryName === "" || this.CategoryName == null)) {
     // this.redirectTo('./', '');
    }
    else {
      afterRender(() => {
       if(this.Loading)
       {
       
       }
        this.Loading = false;
        
      })
      this.loadCategories();
      this.loadProductsByCategory();
    }
  }
  ngOnInit(): void {
     // this.loadProducts(true);

  }


  

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  loadCategories() {
    this.Service.getPosts('get', {}, '/categorias?filters[$or][0][favoritos1][$eq]=1&filters[$or][1][favoritos2][$eq]=1&populate=*')
        .subscribe({
            next: categories => {
                this.Categories = categories;
                this.Categories = this.Categories.data;
                if (this.CategoryId != '' && this.CategoryId != null) {
                  this.CurrentCategory=this.Categories.filter((c: any) => { return c.id == this.CategoryId; })[0];
                }
                else if (this.CategoryName != '' && this.CategoryName != null) {
                  this.CurrentCategory=this.Categories.filter((c: any) => { return c.attributes.nombre == this.CategoryName; })[0];
                }
               
            },
            error: error => {

            }
        });
}

getCategories(){
  return this.Categories.filter((c: any) => { return c.id != this.CurrentCategory.id; });
}


  loadProductsByCategory() {
    var Filter = "/productos?filters[categoria][nombre][$eq]=";
    var ComplementQuery = "&populate=*";
    if (this.CategoryId != '' && this.CategoryId != null) {
      Filter = "/productos?filters[categoria][id][$eq]=";
    }
    else if (this.CategoryName != '' && this.CategoryName != null) {
      this.CategoryId=this.CategoryName;
    }
    else {
      this.redirectTo('./', '');
    }
    this.Service.getPosts('get', {},  Filter + this.CategoryId + ComplementQuery)
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
                

            },
            error: error => {

            }



        });
    


}

redirectTo(uri: string, tableid: string) {
  if (tableid != '' && tableid != undefined && tableid != null) {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this._router.navigate([uri], {
        queryParams: { TableId: tableid }
      }
      )
    )
  }
  else {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this._router.navigate([uri]));
  }

}

}
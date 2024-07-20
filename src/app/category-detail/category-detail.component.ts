import { afterRender, Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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
  imports: [],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.sass'
})
export class CategoryDetailComponent {
  Products: any = [];
  Products1: any = [];
  Products2: any = [];
  Pages: any = [];
  Promotion: any = [];
  Testimonials: any = [];
  Blog: any = [];
  Slider: any = [];
  Footer: any = [];
  Loading: boolean = true;
  public Links: any = [];
  ProductId: string | null;
  ProductName: string | null;
  constructor(private _Activatedroute: ActivatedRoute,private Service: ApiService, private http: HttpClient, private _router: Router, @Inject(DOCUMENT) private document: Document, private sanitizer: DomSanitizer) {
    this.ProductId = this._Activatedroute.snapshot.queryParamMap.get("Id");
    this.ProductName = this._Activatedroute.snapshot.queryParamMap.get("p");
    if ((this.ProductName === "" || this.ProductName == null)) {
      this.redirectTo('./', '');
    }
    else {
      afterRender(() => {
       if(this.Loading)
       {
       
       }
        this.Loading = false;
        
      })
      this.loadProducts(true);
    }
  }
  ngOnInit(): void {
     // this.loadProducts(true);

  }


  
  loadProducts(reload: boolean) {
    this.Service.getPosts('get', {}, '/productos?filters[$or][0][categoria][favoritos1][$eq]=1&filters[$or][1][categoria][favoritos2][$eq]=1&populate=*')
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
                this.Products1 = this.Products.filter((p: any) => {
                    if (p.attributes.categoria.data[0].attributes.favoritos1) {
                        return p;
                    }

                });
                this.Products2 = this.Products.filter((p: any) => {
                    if (p.attributes.categoria.data[0].attributes.favoritos2) {
                        return p;
                    }

                });

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

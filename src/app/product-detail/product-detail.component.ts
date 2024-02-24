import { Component, afterRender } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { orderByPipe } from '../pipes/main.pipe';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, orderByPipe, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})
export class ProductDetailComponent {
  ProductId: string | null;
  ProductName: string | null;
  Loading: Boolean = true;
  ProductDetail: any = {};
  CurrentImagen: any = {};
  public Links: any = [];
  Colors: any = [];
  constructor(private _Activatedroute: ActivatedRoute, private http: HttpClient, private _router: Router, public Service: ApiService) {
    this.ProductId = this._Activatedroute.snapshot.queryParamMap.get("Id");
    this.ProductName = this._Activatedroute.snapshot.queryParamMap.get("P");
    if ((this.ProductName === "" || this.ProductName == null)) {
      this.redirectTo('./', '');
    }
    else {
      afterRender(() => {
       if(this.Loading)
       {
        this.GetProductDetail();
       }
        this.Loading = false;
        
      })
    }

  }
  GetLinks(data: any) {
    this.Links = data;
  }
  ShowDetail(data: any) {
    console.log(data.attributes);
    this.CurrentImagen = data.attributes;
  }
  GetProductDetail() {
    var Filter = "/productos?filters[id][$eq]=";
    var ComplementQuery = "&populate[color]=*&populate[imagen]=*&populate[productos][populate]=*";
    if (this.ProductId != '' && this.ProductId != null) {
      Filter = "/productos?filters[id][$eq]=";
    }
    else if (this.ProductName != '' && this.ProductName != null) {
      Filter = "/productos?filters[titulo][$eq]=";
    }
    else {
      //this.redirectTo('./', '');
    }

    this.Service.getPosts('get', {}, Filter + this.ProductId + ComplementQuery)
      .subscribe({
        next: data => {
          this.ProductDetail = data;
          this.ProductDetail = this.ProductDetail.data[0].attributes;
          if (this.ProductDetail.imagen.data.length > 0) {
            this.CurrentImagen = this.ProductDetail.imagen.data[0].attributes;
          }
          if (this.ProductDetail.color.data != null) {
            this.Colors.push(this.ProductDetail.color.data);
            console.log(this.ProductDetail.productos.data.length);
       
              if (this.ProductDetail.productos.data.length > 0) {
                /* this.ProductDetail.productos.data.forEach((data1: any, index2: number) => {
                   if (data1.attributes.color.data != null) {
                     var Validate = this.Colors.filter((data2: any) => { return data2.id == data1.attributes.color.data.id; });
                     if (Validate.length == 0) {
                       this.Colors.push(data1.attributes.color.data);
                     }
                   }
                 })*/
              }
            
          }
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

import { Component, OnInit, TemplateRef, ViewChild, afterRender } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { orderByPipe } from '../pipes/main.pipe';
import { HttpClient } from '@angular/common/http';
import { NgbTooltipModule,NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PaymentCreateData } from 'mercadopago/dist/clients/payment/create/types';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import { PaymentComponent } from '../payment/payment.component';
import MercadoPagoConfig, { Preference } from 'mercadopago';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, orderByPipe, CommonModule,NgbTooltipModule,PaymentComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})
export class ProductDetailComponent implements OnInit {
  ProductId: string | null;
  ProductName: string | null;
  Loading: Boolean = true;
  ProductDetail: any = {};
  CurrentImagen: any = {};
  public Links: any = [];
  Colors: any = [];
  Products: any = [];
  public DataSelects:any={};
  

  @ViewChild('ContentPayment') templateRefPayment: TemplateRef<any> | undefined;
  preferenceData:PreferenceCreateData= {
    body: {
      additional_info: undefined,
      auto_return: undefined,
      back_urls: undefined,
      binary_mode: undefined,
      coupon_code: undefined,
      coupon_labels: undefined,
      date_of_expiration: undefined,
      differential_pricing: undefined,
      expiration_date_from: undefined,
      expiration_date_to: undefined,
      expires: undefined,
      external_reference: undefined,
      items:[],
      marketplace: undefined,
      marketplace_fee: undefined,
      metadata: undefined,
      notification_url: undefined,
      operation_type: undefined,
      payer: undefined,
      payment_methods: undefined,
      processing_modes: undefined,
      purpose: undefined,
      redirect_urls: undefined,
      shipments: undefined,
      statement_descriptor: undefined,
      taxes: undefined,
      tracks: undefined
    }
  };
 
  constructor(private _Activatedroute: ActivatedRoute, private http: HttpClient, private _router: Router, public Service: ApiService,private modalService: NgbModal) {
    this.ProductId = this._Activatedroute.snapshot.queryParamMap.get("Id");
    this.ProductName = this._Activatedroute.snapshot.queryParamMap.get("P");
    if ((this.ProductName === "" || this.ProductName == null)) {
      this.redirectTo('./', '');
    }
    else {
      afterRender(() => {
       
        this.Loading = false;
      
         
          //this.DataSelects.Url='ok';
          
        
      })
      this.GetProductDetail();
    }
    
   // const 
   // 

    
  }
  ngOnInit(): void {
    var client=new MercadoPagoConfig({ accessToken: 'TEST-7096063323697644-030520-5c4d187f3119c1f696971d2e758c5e57-555283711', options: { timeout: 5000, idempotencyKey: 'test123' } });
    var preference= new Preference(client);
  
    this.preferenceData.body={
      items: [
        {
          id:'',
          title: 'My product',
          quantity: 1,
          unit_price: 2000
        }
      ]
    }
     preference.create(this.preferenceData).then((data)=>{
     
     this.DataSelects=data;
      console.log(data.init_point);
    }).catch(console.log);
    
   
  }

  Pay(){
   
    

       
     this.modalService.open(this.templateRefPayment, { fullscreen: false,size:'lg' });
     
  }
  ShowProduct(id: any) {
    console.log(this.ProductDetail);
    console.log(this.Products);
    if(this.ProductDetail.color.data.id!=id)
    {
        this.ProductDetail= this.Products.filter((p: any) => { return p.color.data.id == id;})[0];
        if(this.ProductDetail.imagen.data!=undefined)
        {
          this.ShowDetail(this.ProductDetail.imagen.data[0]);
        }
        console.log(this.ProductDetail);
       
    }
   
   // this.CurrentImagen = data.attributes;
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
          this.ProductDetail.data[0].attributes.id=this.ProductDetail.data[0].id;
          this.ProductDetail = this.ProductDetail.data[0].attributes;
          this.Products.push(this.ProductDetail);
          if (this.ProductDetail.imagen.data.length > 0) {
            this.CurrentImagen = this.ProductDetail.imagen.data[0].attributes;
          }
          if (this.ProductDetail.color.data != null) {
            console.log(this.ProductDetail.color);
           // this.ProductDetail.color.data.id=this.ProductDetail.color.id;
            this.Colors.push(this.ProductDetail.color.data);
            console.log(this.ProductDetail.productos.data.length);
       
              if (this.ProductDetail.productos.data.length > 0) {
                 this.ProductDetail.productos.data.forEach((data1: any, index2: number) => {
                  var p:any={};
                  p=data1.attributes;
                  p.id=data1.id;
                  this.Products.push(p);
                   if (data1.attributes.color.data != null) {
                     var Validate = this.Colors.filter((data2: any) => { return data2.id == data1.attributes.color.data.id; });
                     if (Validate.length == 0) {
                       this.Colors.push(data1.attributes.color.data);
                     }
                   }
                 })
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

import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild, afterRender, importProvidersFrom } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { orderByPipe } from '../pipes/main.pipe';
import { HttpClient } from '@angular/common/http';
import { NgbTooltipModule,NgbModal, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from '../services/cache.service';
import { PaymentComponent } from '../payment/payment.component';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition,ɵBrowserAnimationBuilder } from '@angular/animations';
import { Meta, Title } from '@angular/platform-browser';



@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,HeaderComponent, FooterComponent, orderByPipe, CommonModule,NgbTooltipModule,FormsModule,ReactiveFormsModule, NgbCarouselModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass',
  animations: [
    trigger('addToCartAnimation', [
      state('start', style({
        transform: 'scale(1) translate(0, 0)',
        opacity: 1
      })),
      state('end', style({
        transform: 'scale(0.1) translate(+5920px, -1000px)',
        opacity: 0
      })),
      transition('start => end', animate('1500ms ease-out'))
    ])
  ]
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
  form!: UntypedFormGroup;
  scrHeight:any;
  scrWidth:any;
  @ViewChild('commentsContainer')
    commentsContainer!: ElementRef;

  scrollLeft() {
    this.commentsContainer.nativeElement.scrollBy({ left: -this.commentsContainer.nativeElement.offsetWidth, behavior: 'smooth' });
}

scrollRight() {
    this.commentsContainer.nativeElement.scrollBy({ left: this.commentsContainer.nativeElement.offsetWidth, behavior: 'smooth' });
}
 
  @ViewChild('ContentPayment') templateRefPayment: TemplateRef<any> | undefined;

 
 
  constructor(private _Activatedroute: ActivatedRoute, private http: HttpClient, private _router: Router, public Service: ApiService,private modalService: NgbModal, private cacheService: CacheService, public meta: Meta, public title: Title) {
    this.ProductId = this._Activatedroute.snapshot.queryParamMap.get("Id");
    this.ProductName = this._Activatedroute.snapshot.queryParamMap.get("p");
    
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

  animationState = 'start';
  showFeedback = false;

 

  ngOnInit(): void {
    
    this.form = new UntypedFormGroup({
    
      quantity: new UntypedFormControl(null, [Validators.required]),
    

    });
   
  }

  
  ShowProduct(id: any) {
    console.log(this.ProductDetail);
    console.log(this.Products);
    if(this.ProductDetail.color.data.id!=id)
    {
        this.ProductDetail= this.Products.filter((p: any) => { return p.color.data.id == id;})[0];
        this.ProductDetail.cantidad=1;
        if(this.ProductDetail.imagen.data!=undefined)
        {
          this.ShowDetail(this.ProductDetail.imagen.data[0]);
        }
        console.log(this.ProductDetail);
       
    }
   
   // this.CurrentImagen = data.attributes;
  }
  GetLinks(data: any) {
    if (this.Links.length == 0) {
    this.Links = data;
    }
  }
  ShowDetail(data: any) {
    console.log(data.attributes);
    this.CurrentImagen = data.attributes;
  }

  AddtoCart(p:any,r:boolean)
  {
    this.animationState = 'end';
    setTimeout(() => {
      this.animationState = 'start';
      this.showFeedback = true;
      setTimeout(() => this.showFeedback = false, 2000);
    }, 500);

    var cachedData = this.cacheService.get('cart', 600);
    if (cachedData == null) {
      cachedData=[];
    }
    var url="";
    try{
      url= p.imagen.data[0].attributes.formats.thumbnail.url;

    }
    catch(ex)
    {}
    var filter= cachedData.filter((item: { id: number; }) => item.id == p.id);
    if(filter.length>0)
    {
      cachedData.find((item: { id: number; }) => item.id === p.id).quantity++;
    }
    else
    {
      cachedData.push({"id":p.id,"name":p.titulo,"price":p.precio,"quantity":p.cantidad,"image":this.Service.urlBase+url});
    }
    

    
    this.cacheService.set('cart', cachedData, new Date());
    if(r)
    {
      this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this._router.navigate(['/carrito']));
    }
  }

  GetProductDetail() {
    var Filter = "/productos?filters[id][$eq]=";
    var ComplementQuery = "&populate[color]=*&populate[imagen]=*&populate[productos][populate]=*";
    if (this.ProductId != '' && this.ProductId != null) {
      Filter = "/productos?filters[id][$eq]=";
    }
    else if (this.ProductName != '' && this.ProductName != null) {
      Filter = "/productos?filters[titulo][$eq]=";
      this.ProductId=this.ProductName;
    }
    else {
      this.redirectTo('./', '');
    }

    this.Service.getPosts('get', {}, Filter + this.ProductId + ComplementQuery)
      .subscribe({
        next: (data:any) => {
          console.log(data);
          this.Loading = false;
          this.ProductDetail = data;
          if(this.ProductDetail.description2!=null)
          {
            this.ProductDetail.description2=this.ProductDetail.description2.replace(/\\n/g, '<br />');
          }
          
          if(this.ProductDetail.data.length==0)
          {
            this.redirectTo('./pagina no encontrada', '');
          }
          else{
      
          this.ProductDetail.data[0].attributes.id=this.ProductDetail.data[0].id;
          this.ProductDetail = this.ProductDetail.data[0].attributes;
          this.ProductDetail.cantidad=1;
          this.Products.push(this.ProductDetail);
          if (this.ProductDetail.imagen.data.length > 0) {
            this.CurrentImagen = this.ProductDetail.imagen.data[0].attributes;
          }
          if (this.ProductDetail.color.data != null) {
            console.log('this.ProductDetail.color',this.ProductDetail.color);
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
          if(this.ProductDetail.metadata!=null)
          {
            this.ChangeMeta(this.ProductDetail.metadata);
          }
        }
        },
        error: error => {
alert('ok');
        }
      });








  }

  ChangeMeta(Data: any[]) {
    console.log(Data);
    this.meta.removeTag('description');
    this.meta.removeTag('title');
    this.meta.removeTag('description');
    this.meta.removeTag('url');
    this.meta.removeTag('type');
    try {
        this.meta.removeTag('keywords');
        this.meta.removeTag('subject');
        this.meta.removeTag('copyright');
        this.meta.removeTag('language');
        this.meta.removeTag('robots');
        this.meta.removeTag('revised');
        this.meta.removeTag('abstract');
        this.meta.removeTag('topic');
        this.meta.removeTag('summary');
        this.meta.removeTag('Classification');
        this.meta.removeTag('author');
        this.meta.removeTag('designer');
        this.meta.removeTag('reply-to');
        this.meta.removeTag('owner');
        this.meta.removeTag('url');
        this.meta.removeTag('identifier-URL');
        this.meta.removeTag('directory');
        this.meta.removeTag('pagename');
        this.meta.removeTag('category');
        this.meta.removeTag('coverage');
        this.meta.removeTag('distribution');
        this.meta.removeTag('rating');
        this.meta.removeTag('revisit-after');
        this.meta.removeTag('subtitle');
        this.meta.removeTag('target');
        this.meta.removeTag('HandheldFriendly');
        this.meta.removeTag('MobileOptimized');
        this.meta.removeTag('date');
        this.meta.removeTag('search_date');
        this.meta.removeTag('ResourceLoaderDynamicStyles');
        this.meta.removeTag('medium');
        this.meta.removeTag('syndication-source');
        this.meta.removeTag('original-source');
        this.meta.removeTag('verify-v1');
        this.meta.removeTag('y_key');
        this.meta.removeTag('pageKey');
        this.meta.removeTag('image');
        this.meta.removeTag('site_name');
        this.meta.removeTag('page_id');
        this.meta.removeTag('application-name');
        this.meta.removeTag('email');
        this.meta.removeTag('phone_number');
        this.meta.removeTag('fax_number');
        this.meta.removeTag('latitude');
        this.meta.removeTag('longitude');
        this.meta.removeTag('street-address');
        this.meta.removeTag('locality');
        this.meta.removeTag('region');
        this.meta.removeTag('postal-code');
        this.meta.removeTag('country-name');
        this.meta.removeTag('video');
        this.meta.removeTag('audio');
        this.meta.removeTag('og:description');
        this.meta.removeTag('og:title');
        this.meta.removeTag('og:description');
        this.meta.removeTag('og:url');
        this.meta.removeTag('og:type');
        this.meta.removeTag('og:image');
        this.meta.removeTag('og:image:secure_url');
    }
    catch (ex) { }
    if (Data.length > 0) {
        Data.forEach((data: any, index2: number) => {
            if (data.tipo == 'tittle') {
                this.title.setTitle(data.valor);
            }
            else if (data.tipo == 'property') {
                this.meta.updateTag({ property: data.nombre, content: data.valor });
            }
            else if (data.tipo == 'name') {
                this.meta.updateTag({ name: data.nombre, content: data.valor });
            }
        })
    }
    else {
        this.title.setTitle('');
        this.meta.updateTag({ name: 'description', content: '' });
        this.meta.updateTag({ property: 'og:locale', content: 'es_CO' });
        this.meta.updateTag({ property: 'og:url', content: this.Service.urlBase });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:title', content: '' });
        this.meta.updateTag({ property: 'og:description', content: '' });
    }
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

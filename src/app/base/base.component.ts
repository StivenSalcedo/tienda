import { Component, ElementRef, OnInit, Renderer2, Inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { orderByPipe } from '../pipes/main.pipe';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-base',
  standalone: true,
  templateUrl: './base.component.html',
  styleUrl: './base.component.sass',
  imports: [HeaderComponent, FooterComponent, orderByPipe, CommonModule]
})
export class BaseComponent implements OnInit {
  public DataResponse: any = [];
  Search: string = "";
  Spin: boolean = false;
  loading: boolean = true;
  CurrentUrl: string = '';
  Pages: any = [];
  Page: any = {};
  Host: string = "";
  InitForm: boolean = false;
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  public Links: any = [];
  Counter: Number = 0;
  constructor(private elementRef: ElementRef, private sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, config: NgbCarouselConfig, public meta: Meta, public title: Title, private Service: ApiService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {
  }
  ngOnInit(): void {

    this.Page.imagen = {};
    this.CurrentUrl = this.router.url;
    if (this.CurrentUrl == '' || this.CurrentUrl == '/') {
      this.CurrentUrl = '/home';
    }
    this.Counter = +1;
  
    // setTimeout(()=> {

    this.OnSearch(this.CurrentUrl, true);


    // }, 1000)
  }


  GetLinks(data: any) {

    if (this.Links.length == 0) {
      this.Links = data;
    }

  }


  OnSearch(value?: string, category?: boolean) {
    var SearchString = '';
    SearchString = value ? value : this.Search;
    this.Spin = true;
    this.InitForm = true;

    var localStorage = this.document.defaultView?.localStorage;
    var data = localStorage?.getItem('paginas');
    /* if (data != null) {
       this.Pages = JSON.parse(data);
       this.OnFilterPage(this.Pages, this.router.url);
     }*/
    //else {
    this.Service.getPosts('get', {}, '/paginas?populate=*')
      .subscribe({
        next: data => {
          this.Spin = false;
          this.Pages = data;
          //this.Links=this.Pages.data;
          //localStorage.setItem('paginas', JSON.stringify(data));
          this.OnFilterPage(data,decodeURI(this.router.url));
          var data1: any = [];
          // var data1={};
          data1.push({ Load: false });
          //this.SendData.emit(data1);
        },
        error: error => {
          this.Spin = false;
        }

      });
    //}

  }
  OnFilterPage(Data: any, Page: String) {
   // console.log('Page');
   // console.log(Page);
    var PageFilter = Data.data.filter((data: any) => { return '/'+data.attributes.url === Page || '/'+data.attributes.url === Page + '/' });
    if (PageFilter.length > 0) {

      this.Page = PageFilter[0].attributes;
      if (this.Page.contenido != '' && this.Page.contenido != null) {
      //  console.log(this.Page.contenido);
        this.Page.contenido = this.Page.contenido.toString().replace(/{YEAR}/g, new Date().getFullYear().toString());
        if (this.Page.imagen.data != null) {
          console.log(this.Page.imagen.data);
          this.Page.imagen.data.forEach((i: any, index2: number) => {
            this.Page.contenido = this.Page.contenido.toString().replace('{IMAGEN'+(index2+1).toString()+'}',this.Service.urlBase+ i.attributes.url);
          })

        }
        
      }

      if (this.Page.metadata != null) {
        this.ChangeMeta(this.Page.metadata);

      }

      this.loading = false;

    }
    else {

      this.OnFilterPage(Data, '/pagina-no-encontrada');
      /* this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
         this.router.navigate(['pagina-no-encontrada']));*/


    }

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



}

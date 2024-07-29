import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { orderByPipe } from '../pipes/main.pipe';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.sass',
    imports: [HeaderComponent, FooterComponent, orderByPipe, CommonModule,NgbAlertModule]
})
export class HomeComponent implements OnInit {
    Categories: any = [];
    Products: any = [];
    Pages: any = [];
    Promotion: any = [];
    Testimonials: any = [];
    Blog: any = [];
    Slider: any = [];
    Footer: any = [];
    Benefits: any = [];
    Loading: boolean = true;
    LoadingProducts: boolean = true;
    public Links: any = [];
    constructor(private Service: ApiService, private http: HttpClient, private _router: Router, @Inject(DOCUMENT) private document: Document, private sanitizer: DomSanitizer) {
    }
    ngOnInit(): void {

        this.loadCategories();
        this.loadContent();

    }
    GetLinks(data: any) {
        this.Links = data;
    }

    loadCategories() {
       
        this.Service.getPosts('get', {}, '/categorias?filters[$or][0][favoritos1][$eq]=1&filters[$or][1][favoritos2][$eq]=1&populate=*')
            .subscribe({
                next: categories => {
                    this.Categories = categories;
                    this.Categories = this.Categories.data;
                   this.Categories.forEach((category: any, index2: number) => {
                        category.products=[];
                    });
                this.loadProducts();
                },
                error: error => {

                }
            });
    }
    getProductsByCategory(id: number) {
        return this.Products.filter((p: any) => { return p.attributes.categoria.data.filter((c: any) => { return Number(c.id) == id; }).length>0 });
    }
    loadProducts() {
        this.Service.getPosts('get', {}, '/productos?filters[$or][0][categoria][favoritos1][$eq]=1&filters[$or][1][categoria][favoritos2][$eq]=1&populate=*')
            .subscribe({
                next: data => {

                    this.Products = data;
                    this.Products = this.Products.data;
                    this.Categories.forEach((category: any, index2: number) => {
                        category.products=this.getProductsByCategory(category.id);
                        console.log('category.product'+category.id);
                        console.log(category.products);
                    })
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
                    this.LoadingProducts=false;
                },
                error: error => {
                    this.LoadingProducts=false;
                }
            });
    }

    loadContent() {
        this.Service.getPosts('get', {}, '/paginas?filters[tipo][nombre][$ne]=pagina&populate=*')
            .subscribe({
                next: data => {
                    this.Pages = data;
                    this.Pages = this.Pages.data;
                    // console.log( this.Pages);
                    this.Pages.forEach((data: any, index2: number) => {
                        if (data.attributes.contenido != null) {
                           // data.attributes.contenido = this.sanitizer.bypassSecurityTrustHtml(data.attributes.contenido);
                        }

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
                    this.Promotion = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'promocion' && p.attributes.menu == 1) {
                            return p;
                        }

                    });

                    this.Testimonials = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'testimonio'  && p.attributes.menu > -1) {
                            return p;
                        }

                    });
                    this.Blog = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'blog' && p.attributes.menu > -1) {
                            return p;
                        }

                    });
                    this.Slider = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'slider' && p.attributes.menu > -1) {
                            return p;
                        }
                    });
                    this.Footer = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'footer' && p.attributes.menu > -1) {
                            return p;
                        }
                    });
                    this.Benefits = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'beneficio'  && p.attributes.menu > -1) {
                            return p;
                        }
                    });



                    this.Loading = false;
                    console.log(this.Benefits);
                },
                error: error => {

                }



            });



    }
    getOtherAttributes(attribute:string,b:any){
      return b.attributes.otros[attribute];
return '#cart-outline';
    }
}

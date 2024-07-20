import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { orderByPipe } from '../pipes/main.pipe';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.sass',
    imports: [HeaderComponent, FooterComponent, orderByPipe, CommonModule]
})
export class HomeComponent implements OnInit {

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
    constructor(private Service: ApiService, private http: HttpClient, private _router: Router, @Inject(DOCUMENT) private document: Document, private sanitizer: DomSanitizer) {
    }
    ngOnInit(): void {
        this.loadProducts(true);
        this.loadContent();

    }
    GetLinks(data: any) {
        this.Links = data;
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
        // console.log('this.Products');
        // console.log(this.Products);


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
                            data.attributes.contenido = this.sanitizer.bypassSecurityTrustHtml(data.attributes.contenido);
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
                        if (p.attributes.tipo.data.attributes.nombre == 'testimonio' && p.attributes.menu > 0) {
                            return p;
                        }

                    });
                    this.Blog = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'blog' && p.attributes.menu > 0) {
                            return p;
                        }

                    });
                    this.Slider = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'slider1' && p.attributes.menu > 0) {
                            return p;
                        }
                    });
                    this.Footer = this.Pages.filter((p: any) => {
                        if (p.attributes.tipo.data.attributes.nombre == 'footer' && p.attributes.menu > 0) {
                            return p;
                        }
                    });

                    this.Loading = false;
                    // console.log(this.Blog);
                },
                error: error => {

                }



            });



    }
}

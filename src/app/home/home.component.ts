import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { orderByPipe, ReplacePipe } from '../pipes/main.pipe';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from '../services/cache.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.sass',
    imports: [HeaderComponent, FooterComponent, orderByPipe, CommonModule, NgbAlertModule, ReplacePipe, NgbCarouselModule, LoaderComponent]
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
    paused = true;
    unpauseOnArrow = false;
    pauseOnIndicator = false;
    pauseOnHover = true;
    pauseOnFocus = true;
    public Links: any = [];
    @ViewChild('commentsContainer')
    commentsContainer!: ElementRef;
    @ViewChild('commentsContainer2')
    commentsContainer2!: ElementRef;
    constructor(private Service: ApiService, private http: HttpClient, private _router: Router, @Inject(DOCUMENT) private document: Document, private sanitizer: DomSanitizer, private cacheService: CacheService) {
    }
    ngOnInit(): void {

        this.loadCategories('/categorias?&filters[$or][1][favoritos2][$eq]=1&filters[$or][0][favoritos1][$eq]=1&populate=*');
        this.loadContent('/paginas?filters[tipo][nombre][$ne]=pagina&populate=*');

    }
    GetLinks(data: any) {
        this.Links = data;
    }

    loadCategories(url: string) {
        const cachedData = this.cacheService.get(url, 60);
        if (cachedData == null) {
            this.Service.getPosts('get', {}, url)
                .subscribe({
                    next: categories => {
                        this.Categories = categories;
                        this.Categories = this.Categories.data;
                        this.Categories.forEach((category: any, index2: number) => {
                            category.products = [];
                        });
                        try {
                            this.cacheService.set(url, this.Categories, new Date());
                        } catch (error) {
                            console.error(error);
                            // maneja el error como prefieras aquí
                        }
                        this.loadProducts(url);
                    },
                    error: error => {

                    }
                });
        }
        else {
            this.Categories = cachedData;
            this.LoadingProducts = false;
        }
    }
    getProductsByCategory(id: number) {
        return this.Products.filter((p: any) => { return p.attributes.categoria.data.filter((c: any) => { return Number(c.id) == id; }).length > 0 });
    }

    openLargeImage(product: any) {
        // Implementa la lógica para mostrar la imagen grande
        console.log('Abrir imagen grande de', product.name);
    }

    goToDetails(p: any) {
        var uri = decodeURI('tienda?p=' + p.attributes.titulo + '&Id=' + p.id);
        this._router.navigateByUrl(uri, { skipLocationChange: false });
    }

    AddtoCart(p: any) {

        var cachedData = this.cacheService.get('cart', 600);
        if (cachedData == null) {
            cachedData = [];
        }
        var url = "";
        try {
            url = p.imagen.data[0].attributes.formats.thumbnail.url;

        }
        catch (ex) { }
        var filter = cachedData.filter((item: { id: number; }) => item.id == p.id);
        if (filter.length > 0) {
            cachedData.find((item: { id: number; }) => item.id === p.id).quantity++;
        }
        else {
            cachedData.push({ "id": p.id, "name": p.titulo, "price": p.precio, "quantity": 1, "image": this.Service.urlBase + url });
        }

        this.cacheService.set('cart', cachedData, new Date());
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this._router.navigate(['/carrito']));

    }

    scrollLeft() {
        this.commentsContainer.nativeElement.scrollBy({ left: -this.commentsContainer.nativeElement.offsetWidth, behavior: 'smooth' });
    }

    scrollRight() {
        this.commentsContainer.nativeElement.scrollBy({ left: this.commentsContainer.nativeElement.offsetWidth, behavior: 'smooth' });
    }

    scrollLeft2() {
        this.commentsContainer2.nativeElement.scrollBy({ left: -this.commentsContainer2.nativeElement.offsetWidth, behavior: 'smooth' });
    }

    scrollRight2() {
        this.commentsContainer2.nativeElement.scrollBy({ left: this.commentsContainer2.nativeElement.offsetWidth, behavior: 'smooth' });
    }

    loadProducts(url: string) {
        var Query = '/productos?filters[$or][0][categoria][favoritos1][$eq]=1&filters[$or][1][categoria][favoritos2][$eq]=1&populate=*';
        this.Service.getPosts('get', {}, Query)
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
                    this.Categories.forEach((category: any, index2: number) => {
                        category.products = this.getProductsByCategory(category.id);
                    });
                    this.Categories=this.Categories.filter((cat:any)=>{return cat.products.length>0;});
                    try {
                        this.cacheService.set(url, this.Categories, new Date());
                    } catch (error) {
                        console.error(error);
                        // maneja el error como prefieras aquí
                    }

                    this.LoadingProducts = false;
                },
                error: error => {
                    this.LoadingProducts = false;
                }
            });

    }

    loadContent(url: string) {
        const cachedData = this.cacheService.get(url, 60);
        if (cachedData == null) {
            this.Service.getPosts('get', {}, url)
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
                        });

                        try {
                            this.cacheService.set(url, this.Pages, new Date());
                        } catch (error) {
                            console.error(error);
                            // maneja el error como prefieras aquí
                        }
                        this.filterItems();

                    },
                    error: error => {

                    }



                });
        }
        else {
            this.Pages = cachedData;
            this.filterItems();
        }




    }

    filterItems() {
        this.Promotion = this.Pages.filter((p: any) => {
            if (p.attributes.tipo.data.attributes.nombre == 'promocion' && p.attributes.menu == 1) {
                return p;
            }
        });

        this.Testimonials = this.Pages.filter((p: any) => {
            if (p.attributes.tipo.data.attributes.nombre == 'testimonio' && p.attributes.menu > -1) {
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
            if (p.attributes.tipo.data.attributes.nombre == 'beneficio' && p.attributes.menu > -1) {
                return p;
            }
        });
        this.Loading = false;
    }
    getOtherAttributes(attribute: string, b: any) {
        return b.attributes.otros[attribute];
        return '#cart-outline';
    }
}

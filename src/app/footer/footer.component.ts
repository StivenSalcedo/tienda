import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { orderByPipe } from "../pipes/main.pipe";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass',
  imports: [CommonModule, orderByPipe]
})
export class FooterComponent implements OnInit {
  Menu: any = [];
  Footer: any = [];
  @Input() Links: any = [];
  constructor(private Service: ApiService, private http: HttpClient, private _router: Router, private sanitizer: DomSanitizer) {


  }
  ngOnInit(): void {
    if (this.Links.data != undefined) {
      this.Links.data.forEach((data: any, index2: number) => {
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


      this.Menu = this.Links.data.filter((p: any) => {
        if (p.attributes.tipo.data.attributes.nombre == 'pagina' && p.attributes.menu > 0) {
          return p;
        }
      });
      this.Footer = this.Links.data.filter((p: any) => {
        if (p.attributes.tipo.data.attributes.nombre == 'footer' && p.attributes.menu > 0) {
          return p;
        }
      });
    }
  }


}

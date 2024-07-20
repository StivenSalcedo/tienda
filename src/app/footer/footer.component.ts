import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { orderByPipe } from "../pipes/main.pipe";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass',
  imports: [CommonModule,HttpClientModule, orderByPipe]
})
export class FooterComponent implements OnInit {
  Menu: any = [];
  Footer: any = [];
  Links: any = [];
  StringHtml:SafeHtml="";
  constructor(private Service: ApiService, private http: HttpClient, private _router: Router, private sanitizer: DomSanitizer) {


  }
  ngOnInit(): void {
   this.loadFooter(true);
    
  }

  GetStringHtml(id:any):SafeHtml{
    console.log(this.Links.data.filter((p: any) => {
      if (p.id == id) {
        return p;
      }
    })[0].attributes.contenido.changingThisBreaksApplicationSecurity.changingThisBreaksApplicationSecurity);
   return this.Links.data.filter((p: any) => {
      if (p.id == id) {
        return p;
      }
    })[0].attributes.contenido.changingThisBreaksApplicationSecurity.changingThisBreaksApplicationSecurity;
  }

  loadFooter(reload:boolean){
 
        this.Service.getPosts('get', {}, '/paginas?filters[$or][0][tipo][nombre][$eq]=pagina&filters[$or][1][tipo][nombre][$eq]=footer&populate=*')
        .subscribe({
          next: data => {
            this.Menu= data;
            this.Menu= this.Menu.data.filter((data: any) => {
              return data.attributes.menu>0 && data.attributes.tipo.data.attributes.nombre=='pagina';
            });
            this.Menu.forEach((data: any, index2: number) => {
              data.menu=data.attributes.menu;
            })
            
              this.Links=data;
              if (this.Links.data != undefined) {
                this.Links.data.forEach((data: any, index2: number) => {
                  if (data.attributes.contenido != null) {
                    if(data.attributes.contenido.changingThisBreaksApplicationSecurity!=null)
                    {
                     // data.attributes.contenido=this.sanitizer.bypassSecurityTrustHtml(data.attributes.contenido.changingThisBreaksApplicationSecurity);
                    }
                    
        
                    //data.attributes.contenido = this.sanitizer.bypassSecurityTrustHtml(data.attributes.contenido);
                  
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
          
                this.Footer = this.Links.data.filter((p: any) => {
                  if (p.attributes.tipo.data.attributes.nombre == 'footer' && p.attributes.menu > 0) {
                    return p;
                  }
                });
                console.log('this.Footer');
                console.log(this.Footer);
              }

          },
          error: error => {
          
          }
         

          
        });
       
     
      
     
      
  }


}

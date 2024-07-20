import { Component, EventEmitter, Inject, NgModule, OnInit, Output } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MainPipe, orderByPipe } from '../pipes/main.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
  standalone: true,
  imports: [CommonModule,HttpClientModule,orderByPipe],

})


export class HeaderComponent implements OnInit {
  Menu:any=[];

  constructor(private Service: ApiService, private http: HttpClient, private _router: Router,@Inject(DOCUMENT) private document: Document) {
   
     
  }
  
  ngOnInit(): void {
    this.loadMenu(true);
  }

  loadMenu(reload:boolean){
    var localStorage = this.document.defaultView?.localStorage;
    var localdata =reload?null: localStorage?.getItem('paginas');
    var CurrentDate=new Date();
       if (localdata == null) {
        //'/paginas?filters[$or][0][tipo][nombre][$eq]=pagina&filters[$or][1][tipo][nombre][$eq]=footer&populate=*'
        this.Service.getPosts('get', {}, '/paginas?filters[tipo][nombre][$eq]=pagina&populate=*')
        .subscribe({
          next: data => {
            this.Menu= data;
            this.Menu= this.Menu.data.filter((data: any) => {
              return data.attributes.menu>0 && data.attributes.tipo.data.attributes.nombre=='pagina';
            });
            this.Menu.forEach((data: any, index2: number) => {
              data.localcreated=CurrentDate;
              data.menu=data.attributes.menu;
            })
          },
          error: error => {
          
          }
         

          
        });
       
     
       }
      else {
        this.Menu=JSON.parse(localdata);
        this.Menu=this.Menu.data;
        var CurrentDate1=CurrentDate.getDate()-1;
        this.Menu =this.Menu.filter((data: any) => {
          var current=new Date(data.localcreated);
          return current.getDate()>CurrentDate1 && data.attributes.menu>0;
        });
        this.Menu.forEach((data: any, index2: number) => {
          data.menu=data.attributes.menu;
        })
        if(this.Menu.length==0)
        {
          this.loadMenu(true);
        }
      
      }
     
      
  }

}

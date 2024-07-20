import { Component, Input, OnInit, afterRender } from '@angular/core';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.sass'
})
export class PaymentComponent implements OnInit {
  @Input() Data:any={};
 
  
  constructor( private sanitizer: DomSanitizer) {
    afterRender(() => {
      console.log(this.Data);
      //this.Data.Url=this.sanitizer.bypassSecurityTrustResourceUrl(this.Data.Url);
     
    })

  }


  getUrl(){
    return   this.sanitizer.bypassSecurityTrustResourceUrl(this.Data.Url);
  }
  ngOnInit(): void {
   
     
     
      console.log(this.Data);
      
    
      /*
        this.DataPayment=data;

       
        this.DataPayment.Modal = this.modalService.open(this.templateRefPayment, { fullscreen: false,size:'lg' });

        
      }*/
    //)
  }
  
}

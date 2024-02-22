import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
    selector: 'app-base',
    standalone: true,
    templateUrl: './base.component.html',
    styleUrl: './base.component.sass'
})
export class BaseComponent implements OnInit {
  ngOnInit(): void {
   //alert('Method not implemented.');
  }

}

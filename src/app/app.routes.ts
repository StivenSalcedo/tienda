
import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'tienda', component: ProductDetailComponent},
    { path: 'tienda/categoria', component: CategoryDetailComponent}
    /*{ path: ':category', component: BaseComponent,children: [{
      path: ':slug',component: BaseComponent}]
    }/*
    ,{ path: '**', component: BaseComponent }*/
    
];

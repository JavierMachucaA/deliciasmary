import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { LocationComponent } from './components/location/location.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
    { path: '', redirectTo: 'home' , pathMatch:'full'},
    { path: 'home',  component: HomeComponent},
    { path: 'products', component: ProductsComponent },
    { path: 'location', component: LocationComponent },
    { path: 'contact', component: ContactComponent },
  ];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
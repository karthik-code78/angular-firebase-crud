import {Routes} from '@angular/router';

// Component imports
import {AddProductComponent} from "./products/add-product/add-product.component";
import {HomeComponent} from "./home/home.component";
import {ProductsListComponent} from "./products/products-list/products-list.component";
import {ProductsComponent} from "./products/products.component";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomeComponent
  },
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {path: "list", component: ProductsListComponent},
      {path: "add" || "new", component: AddProductComponent},
      {path: "update/:id", component: AddProductComponent}
    ]
  }
];

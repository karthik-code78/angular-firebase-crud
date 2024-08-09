import {Component, inject, OnInit} from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import {ProductService} from "../services/product.service";
import {Product} from "../models/product.model";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MaterialModule} from "../../material/material.module";
import {DeleteProductDialogComponent} from "../dialogs/delete-product-dialog/delete-product-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

export interface DeleteDialogData {
  id: string;
  shouldDelete: boolean;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [MatButtonModule, NgOptimizedImage, RouterLink, MaterialModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  protected products: Product[] = [];

  readonly dialog = inject(MatDialog);
  protected dialogRef?: MatDialogRef<DeleteProductDialogComponent, DeleteDialogData>

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log("products-list component initialized");
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      console.log(products);
      this.products = products
    })
  }

  openDialog(productId: string): void {
    this.dialogRef = this.dialog.open(DeleteProductDialogComponent, {data: {id: productId, shouldDelete: false}});

    this.dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result?.shouldDelete) {
        this.deleteProduct(productId);
      }
    })
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId);
  }
}

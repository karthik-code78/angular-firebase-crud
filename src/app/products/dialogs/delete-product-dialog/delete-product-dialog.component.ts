import {Component, inject} from '@angular/core';
import {MaterialModule} from "../../../material/material.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DeleteDialogData, ProductsListComponent} from "../../products-list/products-list.component";

@Component({
  selector: 'app-delete-product-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-product-dialog.component.html',
  styleUrl: './delete-product-dialog.component.scss'
})
export class DeleteProductDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ProductsListComponent>);
  readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);

  onCancelOrConfirm(result: boolean): void {
    const data: DeleteDialogData = {...this.data, shouldDelete: result};
    this.dialogRef.close(data);
  }
}

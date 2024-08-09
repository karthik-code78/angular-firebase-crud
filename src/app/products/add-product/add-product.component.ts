import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../material/material.module";
import {Product} from "../models/product.model";
import {ProductService} from "../services/product.service";

// firebase specific imports
import {getDownloadURL, UploadTask} from "@angular/fire/storage";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})

export class AddProductComponent implements OnInit {

  product: Product | null = null;
  oldProduct: Product | null = null;

  image: File | null = null;
  imageSrc: string | ArrayBuffer | null = "";
  id: string | null = null;

  isEdit: boolean = false;
  isImageChanged: boolean = false;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((param) => {
      console.log(param)
      this.id = param["id"];
    })
  }

  ngOnInit(): void {
    if (this.id != null) {
      console.log(this.id)
      this.productService.getProduct(this.id).subscribe((product) => {
        console.log(product)
        this.product = product[0]
        this.oldProduct = product[0]
        this.setProductWhenEdit(this.product)
        this.isEdit = true
      })
    }
  }

  setProductWhenEdit(product: Product) {
    if (product != null) {
      this.formGroup.setValue({
        name: product.name,
        description: product.description,
        price: product.price
      })
      this.imageSrc = product.imageLink
    }
  }

  formGroup: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
    }
  )

  protected clear(): void {
    this.image = null
    this.isImageChanged = false
    this.formGroup.reset()
    if (this.isEdit) {
      this.setProductWhenEdit(this.oldProduct!)
    }
  }

  protected setImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.image = files[0]
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result;
      // if (this.isEdit) {
      this.isImageChanged = true
      // }
    };

    reader.readAsDataURL(this.image);
  }

  protected clearImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.value = '';
  }

  protected addOrUpdateProductUsingService(imageUrl: string): void {
    this.product = {
      name: this.formGroup.get("name")!.value!,
      description: this.formGroup.get('description')!.value!,
      price: Number.parseInt(this.formGroup.get('price')!.value!),
      imageLink: imageUrl
    }
    if (this.isEdit) {
      this.productService.updateProduct(this.id!, this.product).then((result) => {
        console.log(`product with id ${this.id} has been successfully updated`)
        console.log(result)
      })
    } else {
      this.productService.addProduct(this.product).then((result) => {
        console.log(`product has been successfully added`)
        console.log(result)
      })
    }
  }

  protected uploadTheImageAndAddOrEditProduct(): void {
    if (this.isImageChanged) {
      let uploadTask: UploadTask
      uploadTask = this.productService.uploadFileToStorage(this.image)
      uploadTask.then((completed) => {
          console.log(completed)
          getDownloadURL(completed.ref).then(
            (url) => {
              console.log(url)
              this.addOrUpdateProductUsingService(url)
            }
          )
        },
        (error) => {
          console.log("upload incomplete")
          console.error(error)
        })
    } else {
      this.addOrUpdateProductUsingService(this.product?.imageLink!)
    }
  }

  protected submit(): void {
    if (this.formGroup.valid) {
      // alert('Submitted')
      if (this.image != null || this.image != undefined || (this.imageSrc != null && this.imageSrc != "" && this.imageSrc != undefined)) {
        this.uploadTheImageAndAddOrEditProduct()
      } else {
        this.addOrUpdateProductUsingService("")
      }
      this.router.navigate(["/products/list"])
    } else {
      this.formGroup.markAllAsTouched()
      alert('Invalid form')
    }
  }
}

import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  documentId,
  Firestore,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import {getStorage, ref, uploadBytesResumable, UploadTask} from '@angular/fire/storage';
import {Product} from "../models/product.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dbPath = '/products'


  products: Observable<Product[]>
  productsCollection: CollectionReference

  storage = getStorage();

  // fileUploadProgressBehaviourSubject: BehaviorSubject<number> = new BehaviorSubject(0);

  // fileUploadProgressObservable = this.fileUploadProgressBehaviourSubject.asObservable();

  constructor(private db: Firestore) {
    this.productsCollection = collection(this.db, this.dbPath);
    this.products = collectionData<Product>(this.productsCollection, {idField: 'documentID'});
  }

  getProducts(): Observable<Product[]> {
    // console.log(this.products)
    return this.products;
  }

  getProduct(productId: string): Observable<Product[]> {
    const q = query(this.productsCollection, where(documentId(), '==', productId));
    const singleProduct: Observable<Product> = collectionData<Product>(q, {idField: 'documentID'}) as Observable<Product>
    singleProduct.subscribe((p) => {
      console.log(p)
    })
    return collectionData<Product>(q, {idField: 'documentID'})
  }

  addProduct(product: Product): Promise<any> {
    return addDoc(this.productsCollection, {...product});
  }

  updateProduct(productId: string, data: any): Promise<any> {
    doc(this.productsCollection, productId);
    return setDoc(doc(this.productsCollection, productId), data);
  }

  deleteProduct(productId: string): any {
    return deleteDoc(doc(this.productsCollection, productId));
  }

  uploadFileToStorage(file: any): UploadTask {
    let storageRef = ref(this.storage, 'images/' + file.name + '-' + new Date());
    return uploadBytesResumable(storageRef, file)
  }
}

import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonBackButton, IonSpinner, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonButton 
} from '@ionic/angular';
import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, // <-- Aquí está RouterLink
    IonButtons, IonBackButton, IonSpinner, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonButton
  ]
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  products: Product[] = [];
  total = 0;
  loading = false;
  error = '';

  limit = 10;
  skip = 0;
  currentPage = 1;

  ngOnInit(): void {
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.productService.getProducts(this.limit, this.skip).subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.products;
        this.total = response.total;
        //console.log('Datos de la API:', response);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se han podido cargar los productos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nextPage(): void {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.skip > 0) {
      this.skip -= this.limit;
      this.currentPage--;
      this.loadProducts();
    }
  }

  calcularValorStock(producto: Product): number {
    const precioConDescuento = producto.price * (1 - (producto.discountPercentage / 100));
    return producto.stock * precioConDescuento;
  }
}
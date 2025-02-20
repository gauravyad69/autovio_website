import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cart';
import { WishItem } from '../../models/wishlist';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from "ngx-toastr";
import { ProductComponent } from "../product/product.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { FilterPipe } from "../pipe/filter.pipe";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { FormsModule } from "@angular/forms";
import { ProductModel } from '../../models/product.model';
import { NprCurrencyPipe } from '../pipe/npr-currency.pipe';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent,
    NgxSkeletonLoaderModule,
    FilterPipe,
    InfiniteScrollModule,
    FormsModule,
    NprCurrencyPipe
  ],
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  products: ProductModel[] = [];
  filterValue: string = 'Default';
  page: number = 1;
  pageSize: number = 20;
  isLoading: boolean = false;
  hasMoreData: boolean = true;

  // Infinite scroll config
  throttle: number = 300;
  scrollDistance: number = 1;
  scrollUpDistance: number = 2;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadInitialProducts();
  }

  loadInitialProducts(): void {
    this.isLoading = true;
    this.productService.getProduct(1, this.pageSize).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading products');
        this.isLoading = false;
      }
    });
  }

  onScroll(): void {
    if (this.isLoading || !this.hasMoreData) return;

    this.isLoading = true;
    this.page++;

    this.productService.getProduct(this.page, this.pageSize).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.hasMoreData = false;
        } else {
          this.products = [...this.products, ...data];
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading more products');
        this.isLoading = false;
      }
    });
  }

  addProductToCart(item: ProductModel): void {
    if (!item) return;

    const cartItem: CartItem = {
      product: item,
      quantity: 1
    };

    try {
      this.cartService.setCartItem(cartItem);
      this.toastr.success('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.toastr.error('Failed to add product to cart');
    }
  }

  addProductToWishList(item: ProductModel, event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const wishItem: WishItem = {
      product: item
    };

    if (target.classList.contains("is-favourite")) {
      target.classList.remove("is-favourite");
      this.wishlistService.deleteWishItem(wishItem.product?.basic?.productId!);
      this.toastr.error('Product removed from wishlist');
    } else {
      target.classList.add("is-favourite");
      this.wishlistService.setWishItem(wishItem);
      this.toastr.success('Product added to wishlist successfully');
    }
  }
}

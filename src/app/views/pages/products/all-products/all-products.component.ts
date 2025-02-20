import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
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
import {Carrousel, CategoryModel, ProductModel} from '../../models/product.model';
import { NprCurrencyPipe } from '../pipe/npr-currency.pipe';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';


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
    NprCurrencyPipe,
    CarouselModule,
    NgOptimizedImage,
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

  carrousels: Carrousel[] = [];
  categories: CategoryModel[] = [];

  // Add carousel options
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
        nav: false
      },
      768: {
        items: 1,
        nav: true
      }
    },
    nav: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true
  };

  // Add categories options
  categoryOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 3,
        nav: false
      },
      576: {
        items: 4,
        nav: true
      },
      768: {
        items: 6,
        nav: true
      },
      992: {
        items: 8,
        nav: true
      }
    },
    nav: true
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadInitialProducts();
    this.loadCarrousels();
    this.loadCategories();
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

  loadCarrousels(): void {
    this.productService.getCarrousels(1, 5).subscribe({
      next: (data) => {
        console.log('Carousel data:', data);
        this.carrousels = data;
      },
      error: (error) => {
        console.error('Carousel error:', error);
        this.toastr.error('Error loading carousel');
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories(1, 10).subscribe({
      next: (data) => {
        console.log('Categories data:', data);
        this.categories = data;
      },
      error: (error) => {
        console.error('Categories error:', error);
        this.toastr.error('Error loading categories');
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

  // Add method to handle category click
  onCategoryClick(categoryId: string): void {
    this.isLoading = true;
    this.products = []; // Clear existing products
    this.page = 1; // Reset page number
    
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        this.hasMoreData = data.length === this.pageSize;
      },
      error: (error) => {
        console.error('Error loading category products:', error);
        this.toastr.error('Error loading category products');
        this.isLoading = false;
      }
    });
  }
}

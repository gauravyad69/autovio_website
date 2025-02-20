import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart';
import { WishItem } from '../../models/wishlist';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../services/product.service';
import {ToastrService} from "ngx-toastr";
import {ProductComponent} from "../product/product.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {FilterPipe} from "../pipe/filter.pipe";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  standalone: true,
  imports: [
    ProductComponent,
    NgxSkeletonLoaderModule,
    FilterPipe,
    InfiniteScrollDirective,
    FormsModule
  ],
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  products: any[] = [];
  fliterValue: string = 'Default';
  limit: number = 10;
  scrollDistance: number = 2;
  scrollUpDistance: number = 1.5;
  throttle: number = 300;
  Loading: boolean = false;

  constructor(
    private _product: ProductService,
    private _cartService: CartService,
    private _wishlistService: WishlistService,
    private _toast: ToastrService
  ) { }


  getAllProducts(offset: number, limit: number) {
    this.Loading = true;
    this._product.getProduct(offset, limit).subscribe((data) => {

      setTimeout(() => {
        this.products = [...this.products, ...data]
        this.Loading = false;
      }, 4000);
    })

    // if (number == 1) {
    //   this._product.getProduct(0).subscribe((data) => {
    //     this.products = data
    //   })
    // } else {
    //   this._product.getProduct(number * 20).subscribe((data) => {
    //     this.products = data
    //   })
    // }
    // window.scroll(0, 500);
    // this.PageNumber = number;
  }

  // nextPage() {
  //   if (this.PageNumber == 9) {
  //     this.PageNumber = 1;
  //   } else {
  //     this.PageNumber++;
  //   }
  //   this.getAllProducts(this.PageNumber);

  // }


  // provPage() {
  //   if (this.PageNumber == 1) {
  //     this.PageNumber = 9;
  //   } else {
  //     this.PageNumber--;
  //   }
  //   this.getAllProducts(this.PageNumber);

  // }


  addProductToCart(item: any) {
    const cartItem: CartItem = {
      product: item,
      quantity: 1
    };
    this._cartService.setCartItem(cartItem);
    this._toast.success('Product added to cart successfully');

  }

  addProductToWishList(item: any, event: any) {
    const WishItem: WishItem = {
      product: item
    };
    if (event.currentTarget.classList.contains("is-favourite")) {
      event.currentTarget.classList.remove("is-favourite")
      this._wishlistService.deleteWishItem(WishItem.product?.basic?.productId!);
      this._toast.error('Product removed from wishlist');
    }
    else {
      event.currentTarget.classList.add("is-favourite")
      this._wishlistService.setWishItem(WishItem);
      this._toast.success('Product added to wishlist successfully');
    }

  }

loadProducts(): void {
  this._product.getProduct(1,20).subscribe((data: any[]) => {
    this.products = data;
    console.log(this.products); // Debugging statement
  });
}

  onScroll() {
    const offset = this.limit;
    this.limit = (this.limit + 20) == 178 || (this.limit + 20) > 178 ? 178 : this.limit + 20;
    if(this.limit !== 178 ) this.getAllProducts(Math.floor(offset), Math.floor(this.limit));
  }

  ngOnInit(): void {
    this.loadProducts();
    this.getAllProducts(0, this.limit);
  }


}

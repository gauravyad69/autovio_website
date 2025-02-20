import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../services/product.service';
import { CartItem } from '../../models/cart';
import { WishItem } from '../../models/wishlist';
import {ToastrService} from "ngx-toastr";
import {ProductModel} from "../../models/product.model";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  standalone: true,
  imports: [
    RouterLink
  ],
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: ProductModel | undefined;
  WishItems!: WishItem[];
  constructor(
    private _product: ProductService,
    private _cartService: CartService,
    private _wishlistService: WishlistService,
    private _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.getWishList();
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

  addProductToCart(item: any) {
    const cartItem: CartItem = {
      product: item,
      quantity: 1
    };
    this._cartService.setCartItem(cartItem);
    this._toast.success('Product added to cart successfully');

  }

  productInWishList(itm: any) {
    const cartItemExist = this.WishItems.find((item) => item.product?.basic.productId === itm.id);
    return cartItemExist;
  }
  getWishList() {
    this._wishlistService.wishList$.subscribe((cart) => {
      this.WishItems = cart.items!;
    });
  }

}

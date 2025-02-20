import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { Cart, CartItem, CartItemDetailed } from '../models/cart';
import { WishList } from '../models/wishlist';

export const WISHLIST_KEY = 'wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: WishList = { items: [] };  // Initialize as empty object

  private wishlistSubject: BehaviorSubject<WishList> = new BehaviorSubject<WishList>(this.wishlist);

  wishList$: Observable<WishList> = this.wishlistSubject.asObservable();

  constructor() {
    // Load wishlist from localStorage if exists
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
    }
  }

  initWishlistLocalStorage() {
    const Wishlist: WishList = this.getWishlist();
    if (!Wishlist) {
      const wishListCart = {
        items: []
      };
      const wishListCartJson = JSON.stringify(wishListCart);
      localStorage.setItem(WISHLIST_KEY, wishListCartJson);
    }
  }

  emptyCart() {
    const wishListCart = {
      items: []
    };
    const wishListCartJson = JSON.stringify(wishListCart);
    localStorage.setItem(WISHLIST_KEY, wishListCartJson);
    this.wishlist = wishListCart;
  }

  getWishlist(): WishList {
    return this.wishlist;
  }

  setWishItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const WishList = this.getWishlist();
    const cartItemExist = WishList.items?.find((item) => item.product?.basic?.productId === cartItem.product?.basic?.productId);
    if (cartItemExist) {
      WishList.items?.map((item) => {
        if (item.product?.basic?.productId === cartItem.product?.basic?.productId) {
          // if (updateCartItem) {
          //   item.quantity = cartItem.quantity;
          // } else {
          //   item.quantity = item.quantity! + cartItem.quantity!;
          // }

          // return item;
        }
      });
    } else {
      WishList.items?.push(cartItem);
    }

    const cartJson = JSON.stringify(WishList);
    localStorage.setItem(WISHLIST_KEY, cartJson);
    this.wishlist = WishList;
    return WishList;
  }

  deleteWishItem(productId: number) {
    const WishList = this.getWishlist();
    const newWishList = WishList.items?.filter((item) => item.product?.basic?.productId !== productId);

    WishList.items = newWishList;

    const wishListJsonString = JSON.stringify(WishList);
    localStorage.setItem(WISHLIST_KEY, wishListJsonString);

    this.wishlist = WishList;
  }
}

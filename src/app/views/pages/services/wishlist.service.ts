import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WishList, WishItem } from '../models/wishlist';

const WISHLIST_KEY = 'wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: WishList = { items: [] };
  private wishlistSubject = new BehaviorSubject<WishList>(this.wishlist);
  wishList$ = this.wishlistSubject.asObservable();

  constructor() {
    this.loadWishlist();
  }

  private loadWishlist() {
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
      this.wishlistSubject.next(this.wishlist);
    }
  }

  getWishlist(): WishList {
    return this.wishlist;
  }

  setWishItem(wishItem: WishItem): void {
    const exists = this.wishlist.items?.some(
      item => item.product?.basic?.productId === wishItem.product?.basic?.productId
    );

    if (!exists) {
      this.wishlist.items?.push(wishItem);
      this.updateWishlist();
    }
  }

  deleteWishItem(productId: number): void {
    if (this.wishlist.items) {
      this.wishlist.items = this.wishlist.items.filter(
        item => item.product?.basic?.productId !== productId
      );
      this.updateWishlist();
    }
  }

  private updateWishlist(): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist));
    this.wishlistSubject.next(this.wishlist);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Initialize with empty cart structure
  private cart: Cart = {
    items: []
  };
  
  private cartSubject = new BehaviorSubject<Cart>(this.cart);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    } else {
      // Initialize empty cart if nothing in localStorage
      this.cart = {
        items: []
      };
    }
    this.cartSubject.next(this.cart);
  }

  getCart(): Cart {
    return this.cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem: boolean = false): Cart {
    if (!this.cart.items) {
      this.cart.items = [];
    }

    const cartItemExist = this.cart.items.find(
      item => item.product?.basic?.productId === cartItem.product?.basic?.productId
    );

    if (cartItemExist) {
      this.cart.items = this.cart.items.map(item => {
        if (item.product?.basic?.productId === cartItem.product?.basic?.productId) {
          return {
            ...item,
            quantity: updateCartItem ? cartItem.quantity : (item.quantity || 0) + (cartItem.quantity || 1)
          };
        }
        return item;
      });
    } else {
      this.cart.items.push({
        ...cartItem,
        quantity: cartItem.quantity || 1
      });
    }

    this.updateCart();
    return this.cart;
  }

  deleteCartItem(productId: number): void {
    if (this.cart.items) {
      this.cart.items = this.cart.items.filter(
        item => item.product?.basic?.productId !== productId
      );
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cart = {
      items: []
    };
    this.updateCart();
  }

  private updateCart(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  getTotalPrice(): number {
    return this.cart.items?.reduce((total, item) => {
      const price = item.product?.basic?.pricing?.regularPrice?.amount || 0;
      return total + (price * (item.quantity || 1));
    }, 0) || 0;
  }
}

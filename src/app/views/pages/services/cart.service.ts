import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem, CartItemDetailed } from '../models/cart';

export const CART_KEY = 'cart';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: CartItem[] = [];  // Initialize as empty array
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() {
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const intialCart = {
        items: []
      };
      const intialCartJson = JSON.stringify(intialCart);
      localStorage.setItem(CART_KEY, intialCartJson);
    }
  }

  emptyCart() {
    const intialCart = {
      items: []
    };
    const intialCartJson = JSON.stringify(intialCart);
    localStorage.setItem(CART_KEY, intialCartJson);
    this.cart$.next(intialCart);
  }

  getCart(): Cart {
    const cartJsonString = localStorage.getItem(CART_KEY);
    const cart: Cart = JSON.parse(cartJsonString!);
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();
    const cartItemExist = cart.items?.find((item) => item.product?.basic?.productId === cartItem.product?.basic?.productId);
    if (cartItemExist) {
      cart.items?.map((item) => {
        if (item.product?.basic?.productId === cartItem.product?.basic!!.productId) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            item.quantity = item.quantity! + cartItem.quantity!;
          }

          // return item;
        }
      });
    } else {
      cart.items?.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: number) {
    const cart = this.getCart();
    const newCart = cart.items?.filter((item) => item.product?.basic?.productId !== productId);

    cart.items = newCart;

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cart$.next(cart);
  }
}

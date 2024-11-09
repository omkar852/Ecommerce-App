import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){

    // check if already present in cart
    let existingCartItem = undefined;

    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    // if present
    if (existingCartItem!=undefined){
      existingCartItem.quantity++;

    }
    // else push it in array
    else{
      this.cartItems.push(theCartItem);
    }

    // compute total price and quantity
    this.computeCartTotals();
    
  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let tempCartItem of this.cartItems){
      totalPriceValue += tempCartItem.quantity * tempCartItem.unitPrice;
      totalQuantityValue += tempCartItem.quantity;
    }

    // publish the updated values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){
    console.log("cart items: ");
    for (let tempCartItem of this.cartItems){
      const subTotal = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name : ${tempCartItem.name}, price : ${tempCartItem.unitPrice} ,quantity : ${tempCartItem.quantity}, sub-total : ${subTotal}`);
    }

    console.log(`totalPrice : ${totalPriceValue.toFixed(2)}, totalQuantity : ${totalQuantityValue}`);
  }


  decrementQuantity(theCartItem: CartItem){
    theCartItem.quantity--;

    if (theCartItem.quantity==0){
      this.remove(theCartItem)
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem){
    // get index of the item
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if (itemIndex>-1){
      this.cartItems.splice(itemIndex, 1);
    }

    this.computeCartTotals();
  }

}

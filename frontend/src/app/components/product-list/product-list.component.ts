import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  products: Product[] = [];
  currentCategoryId : number = 1;
  previousCategoryId : number = 1;
  currentCategoryName : string = 'Books';
  searchMode : boolean = false;
  searchKeyword : string = '';

  // pagination properties
  thePageNumber : number = 1;
  thePageSize : number = 5;
  theTotalElements : number = 0;


  constructor(private productService: ProductService, 
    private route: ActivatedRoute, 
    private cartService : CartService
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
      this.searchKeyword = '';
    }
  }
  

  handleListProducts(){
    // check id parameter is present
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }

    // get the products for curr cat id


    if(this.previousCategoryId!= this.currentCategoryId){
      this.thePageNumber = 1
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
  }

  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    // if the current keyword if different than previous one, set pageNum to 1
    if(this.searchKeyword!= theKeyword){
      this.thePageNumber = 1;
    }

    this.searchKeyword = theKeyword;


    this.productService.searchProductsPaginate(this.thePageNumber-1, this.thePageSize, theKeyword).subscribe(this.processResult());
    
  }

  processResult(){
    return (data : any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(tempProduct: Product) {
    // console.log(`Adding to Cart : ${tempProduct.name} : ${tempProduct.unitPrice}`);

    const theCartItem = new CartItem(tempProduct);
    this.cartService.addToCart(theCartItem);
  }

}

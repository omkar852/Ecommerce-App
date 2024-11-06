import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];
  currentCateogryId : number = 4;
  searchMode : boolean = false;

  constructor(private productService: ProductService, 
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();

    }
  }
  

  handleListProducts(){
    // check id parameter is present
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      this.currentCateogryId = +this.route.snapshot.paramMap.get('id')!;
    }

    // get the products for curr cat id


    this.productService.getProductList(this.currentCateogryId).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword');

    this.productService.modifiedSearchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
    
  }

}

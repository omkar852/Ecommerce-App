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
  currentCategoryId : number = 1;
  previousCategoryId : number = 1;
  currentCategoryName : string = 'Books';
  searchMode : boolean = false;
  searchKeyword : string = '';

  // pagination properties
  thePageNumber : number = 1;
  thePageSize : number = 10;
  theTotalElements : number = 0;


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

    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

  handleSearchProducts() {
    this.searchKeyword = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.modifiedSearchProducts(this.searchKeyword).subscribe(
      data => {
        this.products = data;
      }
    )
    
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    
  private baseUrl = 'http://localhost:8080/api/products';

  private productCategoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product []>{
    // url need to be added with categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number, thePageSize : number ,theCategoryId: number): Observable<GetResponseProducts>{
    // url need to be added with categoryId, page number and pageSize
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(theProductId: number) : Observable<Product>{
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }


  getProductCategories() : Observable<ProductCategory []> {
    
    return this.httpClient.get<GetResponseProductCategory>(this.productCategoryUrl).pipe(
      map( response => response._embedded.productCategory)
    );

  }

  searchProducts(theKeyword: string | null) {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`

    return this.getProducts(searchUrl);
  }

  modifiedSearchProducts(theKeyword: string | null) {
    const searchUrl = `${this.baseUrl}/search/findByKeywordInNameOrDescription?keyword=${theKeyword}`

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize : number , theKeyword: string | null) {
    const searchUrl = `${this.baseUrl}/search/findByKeywordInNameOrDescription?keyword=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts{
  _embedded: {
    products: Product[]
  },
  page: {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[]
  }
}

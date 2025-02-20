import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../models/api-response';
import {Carrousel, CategoryModel, ProductModel} from "../../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _HttpClient: HttpClient) { }
  getProduct(page: number, pageSize: number): Observable<ProductModel[]> {
    return this._HttpClient
      .get<ApiResponse<ProductModel[]>>(`${environment.api}/products?page=${page}&pageSize=${pageSize}`)
      .pipe(
        map((response: ApiResponse<ProductModel[]>) => {
          if (!response.data) {
            throw new Error('Invalid API response format');
          }
          return response.data;
        })
      );
  }

  getSingleProduct(id: number): Observable<ProductModel> {
    return this._HttpClient
      .get<ApiResponse<ProductModel>>(`${environment.api}/products/${id}`)
      .pipe(
        map((response: ApiResponse<ProductModel>) => {
          if (!response.data) {
            throw new Error('Invalid API response format');
          }
          return response.data;
        })
      );
  }

  getProductsByCategory(categoryId: string): Observable<ProductModel[]> {
    return this._HttpClient
      .get<ApiResponse<ProductModel[]>>(`${environment.api}/products/category/${categoryId}?page=0&pageSize=10`)
      .pipe(
        map((response: ApiResponse<ProductModel[]>) => {
          if (!response.data) {
            throw new Error('Invalid API response format');
          }
          return response.data;
        })
      );
  }

  getCarrousels(page: number, pageSize: number): Observable<Carrousel[]> {
    return this._HttpClient
      .get<Carrousel[]>(`${environment.api}/carrousel`)
      .pipe(
        map((response: Carrousel[]) => {
          console.log('Raw carousel response:', response);
          if (!response) {
            throw new Error('Invalid API response format');
          }
          return response;
        })
      );
  }

  getCategories(page: number, pageSize: number): Observable<CategoryModel[]> {
    return this._HttpClient
      .get<CategoryModel[]>(`${environment.api}/category`)
      .pipe(
        map((response: CategoryModel[]) => {
          console.log('Raw categories response:', response);
          if (!response) {
            throw new Error('Invalid API response format');
          }
          return response;
        })
      );
  }
}

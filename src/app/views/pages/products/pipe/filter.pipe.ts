import { Pipe, PipeTransform } from '@angular/core';
import { ProductModel } from '../../models/product.model';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: ProductModel[], filterValue: string, defaultValue: string): ProductModel[] {
    if (!items || filterValue === defaultValue) {
      return items;
    }

    switch (filterValue) {
      case 'Low to High':
        return [...items].sort((a, b) => 
          (a.basic?.pricing?.regularPrice?.amount || 0) - (b.basic?.pricing?.regularPrice?.amount || 0)
        );
      case 'High to Low':
        return [...items].sort((a, b) => 
          (b.basic?.pricing?.regularPrice?.amount || 0) - (a.basic?.pricing?.regularPrice?.amount || 0)
        );
      case 'A to Z':
        return [...items].sort((a, b) => 
          (a.basic?.productName || '').localeCompare(b.basic?.productName || '')
        );
      case 'Z to A':
        return [...items].sort((a, b) => 
          (b.basic?.productName || '').localeCompare(a.basic?.productName || '')
        );
      default:
        return items;
    }
  }
}

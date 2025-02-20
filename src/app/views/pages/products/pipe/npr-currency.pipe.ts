import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nprCurrency',
  standalone: true
})
export class NprCurrencyPipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value === undefined || value === null) {
      return 'NPR 0.00';
    }

    // Convert to number if it's a string
    const amount = Number(value);
    
    // Divide by 100 and format with 2 decimal places
    const formattedAmount = (amount / 100).toFixed(2);
    
    // Add thousand separators
    const withCommas = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return `NPR ${withCommas}`;
  }
} 
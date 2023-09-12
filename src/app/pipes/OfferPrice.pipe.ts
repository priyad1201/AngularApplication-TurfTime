import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'OfferPrice'
})
export class OfferPricePipe implements PipeTransform {

  discountprice:any;
  offerPrice:any;
  transform(value: any , args?: any): any {
    this.discountprice = (args/100) * value;
    const offerPrice =value - this.discountprice;
    return offerPrice;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordLimit',
})
export class WordLimitPipe implements PipeTransform {
  transform(
    value: string,
    wordLimit: number = 6,
    returnPosition: boolean = false
  ): any {
    if (!value) return returnPosition ? 0 : '';

    const words = value.split(' ');

    if (words.length <= wordLimit) {
      return returnPosition ? value.length : value;
    }

    // Get the position after the 6th word
    const limitedText = words.slice(0, wordLimit).join(' ');
    return returnPosition ? limitedText.length : limitedText;
  }
}

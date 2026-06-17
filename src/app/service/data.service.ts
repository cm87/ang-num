import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  numberList: Array<Array<number>> = [];

  constructor() { }

  generate(): Array<Array<number>> {
    this.numberList = [];
    this.numberList.push(this.generateNumbers([]));
    this.numberList.push(this.generateNumbers(this.numberList[0]));
    return this.numberList;
  }

  generateNumbers(numberList: Array<number>): number[] {
    let numbers: number[] = [];
    let result: number[] = [];

    while (numbers.length < 6) {
      let randomNumber = this.calcNumberFromOneToNinethy();

      if (!numbers.includes(randomNumber) && !numberList.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }
    const superstar = this.calcNumberFromOneToNinethy();

    result = numbers.sort((n1, n2) => n1 - n2);
    result.push(superstar);
    return result;
  }

  calcNumberFromOneToNinethy(): number {
    return Math.floor(Math.random() * 90) + 1;
  }

  clear(): Array<Array<number>> {
    this.numberList.splice(0, this.numberList.length);
    return this.numberList;
  }
}

import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  numberList: Array<Array<number>> = [];

  constructor() {
  }

  generate() {
    this.numberList = [];
    this.numberList.push(this.generateNumbers());
    this.numberList.push(this.generateNumbers());
  }

  generateNumbers(): number[] {
    let numbers: number[] = [];
    let result: number[] = [];

    while (numbers.length < 6) {
      let randomNumber = this.calcNumberFromOneToNinethy();

      if (!numbers.includes(randomNumber)) {
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

}

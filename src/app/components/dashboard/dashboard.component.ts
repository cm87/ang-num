import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  numberList: Array<Array<number>> = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.generate();
  }

  generate() {
    this.numberList = this.dataService.generate();
  }

  clear() {
   this.numberList = this.dataService.clear();
  }

}

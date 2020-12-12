import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor() { }
  SearchDate: moment.Moment = moment();
	ElapsTime: number = 1;
  ngOnInit(): void {
  }

}

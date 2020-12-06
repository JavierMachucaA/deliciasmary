import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public title = 'landingpage';
  public isCollapsed = true;

  constructor() { }
  ngOnInit(): void {
  }
  public scrollToDownload(target?: any): void {

  }

  public collapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  

  

}

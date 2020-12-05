import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'landingpage';
  public isCollapsed = true;

  public scrollToDownload(target?: any): void {

  }

  public collapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}

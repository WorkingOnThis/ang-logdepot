import { Component, OnInit } from '@angular/core';

declare function init_plugins();

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styles: []
})
export class NotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    init_plugins();
  }

}

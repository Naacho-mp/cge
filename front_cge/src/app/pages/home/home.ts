import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private router: Router) {
  }


}

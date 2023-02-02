import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anti-virus',
  templateUrl: './anti-virus.component.html',
  styleUrls: ['./anti-virus.component.css'],
})
export class AntiVirusComponent implements OnInit {
  usr: any;
  user: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    }

    this.usr = localStorage.getItem('user');
    this.user = JSON.parse(this.usr);
  }
}

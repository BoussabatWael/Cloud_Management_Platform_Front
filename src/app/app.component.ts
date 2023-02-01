import { Component } from '@angular/core';
import {
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'serverMonitoring';

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        document.getElementsByClassName('load')[0]?.classList.remove('d-none');
      }

      if (event instanceof NavigationEnd) {
        setInterval(function () {
          document.getElementsByClassName('load')[0]?.classList.add('d-none');
        }, 3500);
      }

      if (event instanceof NavigationError) {
      }
    });
  }
}

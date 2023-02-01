import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApplicationService } from 'src/app/Services/application.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';

@Component({
  selector: 'app-serverapplication',
  templateUrl: './serverapplication.component.html',
  styleUrls: ['./serverapplication.component.css'],
})
export class ServerapplicationComponent implements OnInit {
  id: any;
  response: any;
  instances: any;
  activeUser: any;
  application: any;
  forminstance!: FormGroup;
  formupdateinstance!: FormGroup;
  submitted: boolean = false;
  hasChange: boolean = false;
  myDate = new Date();
  usr: any;
  user: any;
  account: any;
  inst: any = {
    id: 1,
    status: 1,
  };
  searchText: any;
  p: number = 1;
  // userLogs:Userlogs = new Userlogs()
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private applicationservice: ApplicationService,
    private router: Router,
    private usersLogsService: UserslogsService
  ) {}

  displayStyle = 'none';
  displayStyle1 = 'none';
  openPopup() {
    this.displayStyle = 'block';
  }
  openPopup1() {
    this.displayStyle1 = 'block';
  }

  closePopup() {
    this.displayStyle = 'none';
    this.forminstance.reset();
  }
  closePopup1() {
    this.displayStyle1 = 'none';
  }
  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    }

    this.usr = localStorage.getItem('user');
    this.user = JSON.parse(this.usr);

    this.account = this.user['account'];

    this.id = this.route.snapshot.paramMap.get('id');
  }
}

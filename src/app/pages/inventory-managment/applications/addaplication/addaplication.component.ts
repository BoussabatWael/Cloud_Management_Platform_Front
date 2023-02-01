import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/Services/application.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';
declare function setP(): any;

@Component({
  selector: 'app-addaplication',
  templateUrl: './addaplication.component.html',
  styleUrls: ['./addaplication.component.css'],
})
export class AddaplicationComponent implements OnInit {
  affiche: any;
  formapplication!: FormGroup;
  application: any;
  response: any;
  version!: any;
  source: any;
  fd!: any;
  value: any;
  submitted: boolean = false;
  activeUser: any;
  file: any;
  urlImg: any;
  usr: any;
  user: any;
  account: any;

  constructor(
    private fb: FormBuilder,
    private applicationservice: ApplicationService,
    private router: Router,
    private usersLogsService: UserslogsService
  ) {}
  options = [
    { name: 'Innactive', value: 1 },
    { name: 'Active', value: 2 },
    { name: 'in progress', value: 3 },
  ];

  classe = [
    { name: 'website', value: 1 },
    { name: 'platform', value: 2 },
    { name: 'Sass', value: 3 },
  ];
  sourceclasse = [
    { name: 'git', value: 1 },
    { name: 'file', value: 2 },
  ];
  sourcetype = [
    { name: 'database', value: 1 },
    { name: 'code source', value: 2 },
  ];

  Environment = [
    { name: 'test1', value: 1 },
    { name: 'test2', value: 2 },
    { name: 'test3', value: 3 },
  ];

  get name() {
    return this.formapplication.get('data.name');
  }
  get status() {
    return this.formapplication.get('data.satus');
  }

  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    }

    this.usr = localStorage.getItem('user');
    this.user = JSON.parse(this.usr);

    this.account = this.user['account'];

    this.affiche = 0;
  }
  selectFile(event: any) {
    this.file = event!.target!.files[0];
    let fr = new FileReader();
    fr.readAsDataURL(this.file);
    fr.onload = (event) => (this.urlImg = fr.result);
  }
  cpuChange(value: any) {
    this.value = value;
  }

  ngAfterViewInit() {
    setP();
  }
}

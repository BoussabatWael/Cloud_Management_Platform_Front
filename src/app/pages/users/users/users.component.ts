import { UsersTokensService } from './../../../Services/users-tokens.service';
import { UsersPermissionsService } from './../../../Services/users-permissions.service';
import { core_users_security } from './../../../models/core_users_security';
import { core_users_tokens } from './../../../models/core_users_tokens';
import { core_users_permissions } from 'src/app/models/core_users_permissions';
import { UsersSecurityService } from 'src/app/Services/users-security.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { logs } from 'src/app/models/core_logs';
import { core_users } from 'src/app/models/core_users';

import { UserService } from 'src/app/Services/user.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import Swal from 'sweetalert2';

declare function setDT(users: any): any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;

  users: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  userLogs: logs = new logs();
  user: any;
  usr: any;
  response: any;
  newuser: any;
  response2: any;
  response3: any;
  usersList: any;
  usersList1: any;
  userForm!: FormGroup;
  submitted: boolean = false;
  searchText: any;
  p: number = 1;
  ipAddress: any;
  browserName: any;
  userPermission: any;
  usrPer: any;
  userPermissions: core_users_permissions = new core_users_permissions();
  usersTokens: core_users_tokens = new core_users_tokens();
  usersSecurity: core_users_security = new core_users_security();
  // userLogs:Userlogs = new Userlogs()
  options = [
    { name: 'Active', value: 1 },
    { name: 'InProgress', value: 2 },
    { name: 'Inactive', value: 3 },
  ];

  adminop = [
    { name: 'Admin', value: 2 },
    { name: 'Agent', value: 3 },
    { name: 'Supervisor', value: 4 },
  ];
  constructor(
    private fb: FormBuilder,
    private usersService: UserService,
    private router: Router,
    private userslogsService: UserslogsService,
    private http: HttpClient,
    private usersSercurityService: UsersSecurityService,
    private UsersPermissionsService: UsersPermissionsService,
    private UsersTokensService: UsersTokensService
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    }

    this.usr = localStorage.getItem('user');
    this.user = JSON.parse(this.usr);

    this.userPermission = localStorage.getItem('permissions');
    this.usrPer = JSON.parse(this.userPermission);

    this.dtOptions = {
      lengthMenu: [5, 10, 20, 50, 100],
      pageLength: 10,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };
    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElementt = event?.target?.closest('.btnDel');
      if (clickedElementt) {
        _this.deleteUser(clickedElementt.dataset.id);
      }
    });
    this.getAllUsers();
    this.getIPAddress();
    this.browserName = this.detectBrowserName();
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
  get userform() {
    return this.userForm.controls;
  }
  displayStyle = 'none';

  closePopup() {
    this.displayStyle = 'none';
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  CreateLogs(
    action: String,
    log_date: any,
    element: number,
    element_id: number,
    user: core_users,
    source: number
  ) {
    this.userLogs.action = action;
    this.userLogs.log_date = log_date;
    this.userLogs.element = element;
    this.userLogs.element_id = element_id;
    this.userLogs.user = user;
    this.userLogs.source = source;

    this.userslogsService.saveUserLogs(this.userLogs).subscribe(
      (result) => {},
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  getIPAddress() {
    this.http
      .get('https://api.ipify.org/?format=json')
      .subscribe((res: any) => {
        this.ipAddress = res.ip;
      });
  }

  getDiff() {
    let new_object: any = '';
    this.usersService.getAllUsers().subscribe(
      (result) => {
        this.response3 = result;
        this.usersList1 = this.response3.data.filter(
          (u: { id: any }) => u.id !== this.user.id
        );
        for (let key in this.usersList1) {
          if (
            JSON.stringify(this.usersList1[key]) ===
            JSON.stringify(this.usersList[key])
          ) {
            continue;
          } else {
            new_object = this.usersList1[key];
          }
        }
        if (new_object?.role === 2) {
          new_object.role = 'Admin';
        } else if (new_object?.role === 3) {
          new_object.role = 'Agent';
        } else {
          new_object.role = 'Supervisor';
        }

        if (new_object?.status === 1) {
          new_object.status =
            '<span class="badge rounded-pill badge-soft-success font-size-12">Active</span>';
        } else if (new_object?.status === 2) {
          new_object.status =
            '<span class="badge rounded-pill badge-soft-danger font-size-12">Inactive</span>';
        } else {
          new_object.status =
            '<span class="badge rounded-pill badge-soft-warning font-size-12">In Progress</span>';
        }

        if (
          this.usrPer.users.includes('update') == true &&
          this.usrPer.users.includes('delete') == true
        ) {
          new_object.actions =
            ` <div class="d-flex gap-2 justify-content-center">
                                        <a class="btn btn-sm btn-soft-secondary "   placement="top" ngbTooltip="Email">
                                          <i class="mdi mdi-email-plus font-size-16"></i></a>
                                          <a class="btn btn-sm btn-soft-primary  "  href="#/contacts-profile/` +
            new_object?.id +
            `" placement="top" ngbTooltip="View">
                                            <i class="mdi mdi-pencil font-size-16"></i></a>

                                          <a class="btn btn-sm btn-soft-danger btnDel" data-id="${new_object?.id}" type="button" (click)="deleteUser(new_object?.id)"  placement="top" ngbTooltip="Delete">
                                              <i class="mdi mdi-delete font-size-16"></i></a>
                                      </div>`;
        } else if (
          this.usrPer.users.includes('update') == false &&
          this.usrPer.users.includes('delete') == true
        ) {
          new_object.actions = ` <div class="d-flex gap-2 justify-content-center">
                                        <a class="btn btn-sm btn-soft-secondary "   placement="top" ngbTooltip="Email">
                                          <i class="mdi mdi-email-plus font-size-16"></i></a>

                                          <a class="btn btn-sm btn-soft-danger btnDel" data-id="${new_object?.id}" type="button" (click)="deleteUser(new_object?.id)"  placement="top" ngbTooltip="Delete">
                                              <i class="mdi mdi-delete font-size-16"></i></a>
                                      </div>`;
        } else if (
          this.usrPer.users.includes('update') == true &&
          this.usrPer.users.includes('delete') == false
        ) {
          new_object.actions =
            ` <div class="d-flex gap-2 justify-content-center">
                                        <a class="btn btn-sm btn-soft-secondary "   placement="top" ngbTooltip="Email">
                                          <i class="mdi mdi-email-plus font-size-16"></i></a>
                                          <a class="btn btn-sm btn-soft-primary  "  href="#/contacts-profile/` +
            new_object?.id +
            `" placement="top" ngbTooltip="View">
                                            <i class="mdi mdi-pencil font-size-16"></i></a>
                                      </div>`;
        } else {
          new_object.actions = ` <div class="d-flex gap-2 justify-content-center">
                                        <a class="btn btn-sm btn-soft-secondary "   placement="top" ngbTooltip="Email">
                                          <i class="mdi mdi-email-plus font-size-16"></i></a>
                                      </div>`;
        }

        $('#table_user')
          .DataTable()
          .row.add([
            new_object?.id,
            new_object?.firstname,
            new_object?.lastname,
            new_object?.email,
            new_object?.role,
            new_object?.status,
            new_object?.actions,
          ])
          .draw();
        //@ts-ignore
        $('#table_user').DataTable().row(':last').node().id =
          'user-' + new_object.id;
        return new_object;
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }

  addUser() {
    let data = this.userForm.value;
    if (this.userForm.invalid || this.userForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    if (!this.ValidateEmail(data.email)) {
      return;
    }
    this.usersSercurityService.login(data.firstname).subscribe(
      (result) => {
        if (result.status == 200 && result.data !== null) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Choose another firstname please!',
            confirmButtonColor: '#2f49c7',
          });
        } else {
          document.querySelector('.adduser')?.classList.remove('d-none');
          data.account = this.user.account;
          data.ip_address = this.ipAddress;
          data.browser = this.browserName;
          data.has_token = 1;
          data.status = 1;

          const formatedTimestamp = () => {
            const d = new Date();
            const date = d.toISOString().split('T')[0];
            const time = d.toTimeString().split(' ')[0];
            return `${date} ${time}`;
          };

          data.last_auth = formatedTimestamp();
          this.usersService.addUser(data).subscribe(
            (result) => {
              if (result.status == 200 && result.data !== null) {
                let new_user = result.data;

                this.CreateLogs(
                  'Create',
                  formatedTimestamp(),
                  1,
                  new_user?.id,
                  this.user,
                  2
                );

                this.userPermissions.status = 1;
                this.userPermissions.dependency = 1;
                this.userPermissions.user = new_user;

                if (this.userPermissions.user.role == 2) {
                  this.userPermissions.code = JSON.stringify({
                    users: ['view', 'update', 'delete', 'create'],
                    servers: ['create', 'update', 'view', 'delete'],
                    domains: ['create', 'update', 'view', 'delete'],
                    applications: ['create', 'update', 'view', 'delete'],
                    backups: ['create', 'update', 'view', 'delete'],
                    providers: ['create', 'update', 'view', 'delete'],
                    deployments: ['create', 'update', 'view', 'delete'],
                    access_credentials: ['create', 'update', 'view', 'delete'],
                    hosts: ['create', 'update', 'view', 'delete'],
                    ssl: ['create', 'update', 'view', 'delete'],
                  });
                } else if (this.userPermissions.user.role == 3) {
                  this.userPermissions.code = JSON.stringify({
                    users: ['view', 'create'],
                    servers: ['create', 'view'],
                    domains: ['create', 'view'],
                    applications: ['create', 'view'],
                    backups: ['create', 'view'],
                    providers: ['create', 'view'],
                    deployments: ['create', 'view'],
                    access_credentials: ['create', 'view'],
                    hosts: ['create', 'view'],
                    ssl: ['create', 'view'],
                  });
                } else if (this.userPermissions.user.role == 4) {
                  this.userPermissions.code = JSON.stringify({
                    users: ['view'],
                    servers: ['view'],
                    domains: ['view'],
                    applications: ['view'],
                    backups: ['view'],
                    providers: ['view'],
                    deployments: ['view'],
                    access_credentials: ['view'],
                    hosts: ['view'],
                    ssl: ['view'],
                  });
                }

                this.UsersPermissionsService.addUserPermissions(
                  this.userPermissions
                ).subscribe(
                  (result1) => {
                    if (result1.status == 200 && result1.data !== null) {
                      let user_per = result1.data;

                      this.CreateLogs(
                        'Create',
                        formatedTimestamp(),
                        18,
                        user_per?.id,
                        this.user,
                        2
                      );

                      this.usersSecurity.login = data.firstname;
                      this.usersSecurity.password = data.lastname;
                      this.usersSecurity.user = new_user;
                      this.usersSecurity.status = 1;

                      this.usersSercurityService
                        .addUserSecurity(this.usersSecurity)
                        .subscribe(
                          (result2) => {
                            if (
                              result2.status == 200 &&
                              result2.data !== null
                            ) {
                              let user_sec = result2.data;

                              this.CreateLogs(
                                'Create',
                                formatedTimestamp(),
                                2,
                                user_sec?.id,
                                this.user,
                                2
                              );

                              this.usersTokens.status = 1;
                              this.usersTokens.user = new_user;

                              this.UsersTokensService.addUserToken(
                                this.usersTokens
                              ).subscribe(
                                (result3) => {
                                  if (
                                    result3.status == 200 &&
                                    result3.data !== null
                                  ) {
                                    let user_tok = result3.data;

                                    this.CreateLogs(
                                      'Create',
                                      formatedTimestamp(),
                                      21,
                                      user_tok?.id,
                                      this.user,
                                      2
                                    );

                                    const Toast = Swal.mixin({
                                      toast: true,
                                      position: 'top-right',
                                      showConfirmButton: false,
                                      timer: 2500,
                                      timerProgressBar: true,
                                      didOpen: (toast) => {
                                        toast.addEventListener(
                                          'mouseenter',
                                          Swal.stopTimer
                                        );
                                        toast.addEventListener(
                                          'mouseleave',
                                          Swal.resumeTimer
                                        );
                                      },
                                    });
                                    document
                                      .querySelector('.adduser')
                                      ?.classList.add('d-none');
                                    Toast.fire({
                                      icon: 'success',
                                      title: 'User Added',
                                    });
                                    this.close();
                                    this.closebutton.nativeElement.click();
                                    this.getDiff();
                                  } else {
                                    document
                                      .querySelector('.adduser')
                                      ?.classList.add('d-none');

                                    Swal.fire({
                                      title: 'Error!',
                                      text: 'Something went wrong!',
                                      icon: 'error',
                                      confirmButtonColor: '#2f49c7',
                                    });
                                  }
                                },
                                (error) => {
                                  document
                                    .querySelector('.adduser')
                                    ?.classList.add('d-none');

                                  Swal.fire({
                                    title: 'Error!',
                                    text: 'Something went wrong!',
                                    icon: 'error',
                                    confirmButtonColor: '#2f49c7',
                                  });
                                }
                              );
                            } else {
                              document
                                .querySelector('.adduser')
                                ?.classList.add('d-none');

                              Swal.fire({
                                title: 'Error!',
                                text: 'Something went wrong!',
                                icon: 'error',
                                confirmButtonColor: '#2f49c7',
                              });
                            }
                          },
                          (error) => {
                            document
                              .querySelector('.adduser')
                              ?.classList.add('d-none');

                            Swal.fire({
                              title: 'Error!',
                              text: 'Something went wrong!',
                              icon: 'error',
                              confirmButtonColor: '#2f49c7',
                            });
                          }
                        );
                    } else {
                      document
                        .querySelector('.adduser')
                        ?.classList.add('d-none');

                      Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong!',
                        icon: 'error',
                        confirmButtonColor: '#2f49c7',
                      });
                    }
                  },
                  (error) => {
                    document.querySelector('.adduser')?.classList.add('d-none');

                    Swal.fire({
                      title: 'Error!',
                      text: 'Something went wrong!',
                      icon: 'error',
                      confirmButtonColor: '#2f49c7',
                    });
                  }
                );
              } else {
                document.querySelector('.adduser')?.classList.add('d-none');

                Swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong!',
                  icon: 'error',
                  confirmButtonColor: '#2f49c7',
                });
              }
            },
            (error) => {
              document.querySelector('.adduser')?.classList.add('d-none');

              Swal.fire({
                title: 'Error!',
                text: 'Something went wrong!',
                icon: 'error',
                confirmButtonColor: '#2f49c7',
              });
            }
          );
        }
      },
      (error) => {
        document.querySelector('.adduser')?.classList.add('d-none');

        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  close() {
    this.userForm.reset();
    document.querySelector('.adduser')?.classList.add('d-none');
  }
  deleteUser(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't delete this user !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.UserLoad')?.classList.remove('d-none');
        this.usersService.getUserById(id).subscribe(
          (result) => {
            let user = result.data;
            user.status = 4;
            this.usersService.updateUser(user, id).subscribe(
              (result) => {
                if (result.status == 200) {
                  const formatedTimestamp = () => {
                    const d = new Date();
                    const date = d.toISOString().split('T')[0];
                    const time = d.toTimeString().split(' ')[0];
                    return `${date} ${time}`;
                  };

                  this.CreateLogs(
                    'Delete',
                    formatedTimestamp(),
                    1,
                    id,
                    this.user,
                    2
                  );

                  let row = document.getElementById('user-' + id);
                  console.log(row);
                  if (row != null) {
                    $('#table_user').DataTable().row(row).remove();
                    $('#table_user').DataTable().draw();
                    this.usersList = this.usersList.filter(
                      (u: { id: any }) => u.id !== id
                    );
                    document
                      .querySelector('.UserLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'User has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                  }
                } else {
                  document.querySelector('.UserLoad')?.classList.add('d-none');
                  Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonColor: '#2f49c7',
                  });
                }
              },
              (error) => {
                document.querySelector('.UserLoad')?.classList.add('d-none');
                Swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong!',
                  icon: 'error',
                  confirmButtonColor: '#2f49c7',
                });
              }
            );
          },
          (error) => {
            document.querySelector('.UserLoad')?.classList.add('d-none');
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong!',
              icon: 'error',
              confirmButtonColor: '#2f49c7',
            });
          }
        );
      }
    });
  }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe(
      (result) => {
        this.response = result;
        if (this.response.status == 200) {
          this.usersList = this.response.data.filter(
            (u: { id: any; role: any }) => u.id !== this.user.id && u.role !== 1
          );
          this.dtTrigger.next();
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }

  ValidateEmail(email: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You have entered an invalid Email!',
      confirmButtonColor: '#2f49c7',
    });
    return false;
  }
}

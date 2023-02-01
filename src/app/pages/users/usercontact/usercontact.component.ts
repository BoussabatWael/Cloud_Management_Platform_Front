import { ApplicationService } from 'src/app/Services/application.service';
import { core_users } from './../../../models/core_users';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { core_users_permissions } from 'src/app/models/core_users_permissions';
import { CoreModulesService } from 'src/app/Services/core-modules.service';
import { InstanceService } from 'src/app/Services/instance.service';
import { UserModulesService } from 'src/app/Services/user-modules.service';
import { UserService } from 'src/app/Services/user.service';
import { UsersInstancesService } from 'src/app/Services/users-instances.service';
import { UsersPermissionsService } from 'src/app/Services/users-permissions.service';
import { UsersSecurityService } from 'src/app/Services/users-security.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import Swal from 'sweetalert2';
import { logs } from 'src/app/models/core_logs';
import { ServerService } from 'src/app/Services/server.service';
import { DomaineNameService } from 'src/app/Services/domaine-name.service';

declare function setP3(): any;
declare function setP2(): any;
@Component({
  selector: 'app-usercontact',

  templateUrl: './usercontact.component.html',
  styleUrls: ['./usercontact.component.css'],
})
export class UsercontactComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  value: any;
  users: any;
  user: any;
  userSecurity: any;
  core_users_modules: any[] = [];
  public userForm!: FormGroup;
  public userSecurityForm!: FormGroup;
  public instanceForm!: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  PermissionsList: { [key: string]: any[] } = {};
  PermissionsList1: { [key: string]: any[] } = {};
  userPermissions: core_users_permissions = new core_users_permissions();
  status1: any;
  modulesList: any[] = [];
  submitted: boolean = false;
  submitted1: boolean = false;
  hasChange: boolean = false;
  hasChange1: boolean = false;
  securities: any = {};
  myDate = new Date();
  UserSecurity: any;
  response: any;
  response1: any;
  response2: any;
  response3: any;
  response4: any;
  response5: any;
  response6: any;
  response7: any;
  response8: any;
  response9: any;
  serversList: any;
  applicationsList: any;
  domainNamesList: any;
  userInstances: any;
  userInstances1: any;
  changed: boolean = false;
  data: any;
  data1: any;
  oldpassword: any;
  id!: any;
  idmodule!: number;
  permission: any[] = [];
  addpermission: any[] = [];
  deletepermission: any[] = [];
  instances: any[] = [];
  searchText: any;
  searchText1: any;
  searchText2: any;
  userLogsList: any;
  userLogsList1: any;
  statuss: any;
  p: number = 1;
  p1: number = 1;
  p2: number = 1;
  browserName = '';
  usrr: any;
  account: any;
  usr: any;
  userPermission: any;
  usrPer: any;
  userLogs: logs = new logs();
  elementType: { [key: string]: any } = {
    1: 'User',
    2: 'User security',
    3: 'Inventory instance',
    4: 'Application version',
    5: 'Backup execution',
    6: 'Access credentials',
    7: 'Provider',
    8: 'Domain name',
    9: 'Network host',
    10: 'Subdomain',
    11: 'SSL certificate',
    12: 'Application',
    13: 'Application dependencies',
    14: 'Application instance',
    15: 'Application source',
    16: 'Backup operation',
    17: 'Backup instance',
    18: 'User permissions',
    19: 'User instance',
    20: 'Server',
    21: 'User token',
    22: 'Module',
    23: 'User module',
  };
  sourceType: { [key: string]: any } = {
    1: 'Profile',
    2: 'Users',
    3: 'User details',
    4: 'Providers',
    5: 'Provider details',
    6: 'Deployments',
    7: 'Servers',
    8: 'Server details',
    9: 'Domain names',
    10: 'Domain name details',
    11: 'Applications',
    12: 'Application details',
    13: 'Backup operations',
    14: 'Backup operation details',
    15: 'Backup images',
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userservice: UserService,
    private router: Router,
    private userslogsService: UserslogsService,
    private usersLogsService: UserslogsService,
    private coreModuleService: CoreModulesService,
    private instanceService: InstanceService,
    private userPermisssionService: UsersPermissionsService,
    private coreUsersModuleService: UserModulesService,
    private userSecurityService: UsersSecurityService,
    private usersInstancesService: UsersInstancesService,
    private ServersSercie: ServerService,
    private domainNamesService: DomaineNameService,
    private applicationsService: ApplicationService,
    private moduleService: CoreModulesService
  ) {
    this.userForm = this.fb.group({
      id: [''],
      browser: [''],
      firstname: [''],
      email: [''],
      has_token: [''],
      ip_address: [''],
      language: [''],
      last_auth: [''],
      lastname: [''],
      photo: [''],
      role: [''],
      status: [''],
      timezone: [''],
      account: this.fb.group({
        id: [''],
      }),
    });

    this.userSecurityForm = this.fb.group({
      id: [''],
      login: ['',Validators.required],
      password: ['',Validators.required],
      start_date: [''],
      end_date: [''],
      status: [''],
      user: this.fb.group({
        id: [''],
      }),
    });

    this.instanceForm = this.fb.group({
      element: ['', Validators.required],
      element_id: ['', Validators.required],
      status: [''],
      user: this.fb.group({
        id: [''],
      }),
    });
  }

  status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 2 },
    { name: 'In Progress', value: 3 },
  ];
  role = [
    { name: 'Admin', value: 2 },
    { name: 'Agent', value: 3 },
    { name: 'Supervisor', value: 4 },
  ];
  module = [
    { name: 'active', value: 1 },
    { name: 'in progress', value: 2 },
    { name: 'innactive', value: 3 },
  ];

  adminop = [
    { name: 'Admin', value: 2 },
    { name: 'Agent', value: 3 },
    { name: 'Supervisor', value: 4 },
  ];

  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    }

    this.usr = localStorage.getItem('user');
    this.usrr = JSON.parse(this.usr);

    this.account = this.usrr['account'];

    this.userPermission = localStorage.getItem('permissions');
    this.usrPer = JSON.parse(this.userPermission);

    this.dtOptions = {
      lengthMenu: [5, 10, 20, 50, 100],
      pageLength: 5,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    this.id = this.route.snapshot.paramMap.get('id');

    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElement = event?.target?.closest('.btnDelInstance');
      // @ts-ignore
      let clickedElement1 = event?.target?.closest('.btnDelDomain');
      // @ts-ignore
      let clickedElement2 = event?.target?.closest('.btnDelApp');
      if (clickedElement) {
        _this.deleteUserInstance(clickedElement.dataset.id);
      }
      if (clickedElement1) {
        _this.deleteUserInstance(clickedElement1.dataset.id);
      }
      if (clickedElement2) {
        _this.deleteUserInstance(clickedElement2.dataset.id);
      }
    });

    this.getUserByID();
    this.getUserPermission();
    this.getUserLogs();
    this.getUserModulesList();
    this.getUserSecurity();
    this.getUserInstances();

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
  get usersecurityform() {
    return this.userSecurityForm.controls;
  }

  changeStatus(status: any) {
    this.status1 = status;
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

  get instanceform() {
    return this.instanceForm.controls;
  }
  close() {
    this.instanceForm.reset();
    document.querySelector('.adduserinstance')?.classList.add('d-none');
  }

  getDiffInstance() {
    let new_object: any;
    this.usersInstancesService.getUserInstancesByUserId(this.id).subscribe(
      (result) => {
        this.response8 = result;
        this.userInstances1 = this.response8.data;
        for (let key in this.userInstances1) {
          if (
            JSON.stringify(this.userInstances1[key]) ===
            JSON.stringify(this.userInstances[key])
          ) {
            continue;
          } else {
            new_object = this.userInstances1[key];
          }
        }

        if (new_object.status === 1) {
          new_object.status =
            '<span class="badge rounded-pill badge-soft-success font-size-12">Active</span>';
        } else if (new_object.status === 2) {
          new_object.status =
            '<span class="badge rounded-pill badge-soft-danger font-size-12">Inactive</span>';
        } else {
          new_object.status =
            '<span class="badge rounded-pill badge-soft-warning font-size-12">In Progress</span>';
        }

        if (new_object.element === 1) {
          new_object.element = 'Server';

          if (
            this.usrPer.servers.includes('update') == true &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelInstance" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteUserInstance(instance?.id)" >
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.servers.includes('update') == false &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelInstance" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteUserInstance(instance?.id)" >
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.servers.includes('update') == true &&
            this.usrPer.servers.includes('delete') == false
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">---
                            </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">---</div>`;
          }
        } else if (new_object.element === 2) {
          new_object.element = 'Domain name';

          if (
            this.usrPer.domains.includes('update') == true &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelDomain" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteUserInstance(instance?.id)" >
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.domains.includes('update') == false &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelDomain" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteUserInstance(instance?.id)" >
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.domains.includes('update') == true &&
            this.usrPer.servers.includes('delete') == false
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">---
                            </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">---</div>`;
          }
        } else {
          new_object.element = 'Application';
          if (
            this.usrPer.applications.includes('update') == true &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelApp" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteUserInstance(instance?.id)" >
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.applications.includes('update') == false &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelApp" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteUserInstance(instance?.id)" >
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.applications.includes('update') == true &&
            this.usrPer.servers.includes('delete') == false
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">---
                            </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">---</div>`;
          }
        }

        $('#table_ui')
          .DataTable()
          .row.add([
            new_object.id,
            new_object.element,
            new_object.element_id,
            new_object.status,
            new_object.actions,
          ])
          .draw();
        //@ts-ignore
        $('#table_ui').DataTable().row(':last').node().id =
          'ui-' + new_object.id;
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
  addInstance() {
    let data = this.instanceForm.value;
    data.user = this.user;
    data.status = 1;
    if (data.element === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Choose an option please!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    const formatedTimestamp = () => {
      const d = new Date();
      const date = d.toISOString().split('T')[0];
      const time = d.toTimeString().split(' ')[0];
      return `${date} ${time}`;
    };

    if (this.instanceForm.invalid || this.instanceForm.value.length == 0) {
      this.submitted1 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.adduserinstance')?.classList.remove('d-none');
    this.usersInstancesService.saveUserInstance(data).subscribe(
      (result) => {
        let new_ins = result.data;
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          19,
          new_ins.id,
          this.usrr,
          3
        );

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        document.querySelector('.adduserinstance')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Instance Added',
        });

        this.close();
        this.closebutton.nativeElement.click();
        this.getDiffLogs();
        this.getDiffInstance();
      },
      (error) => {
        document.querySelector('.adduserinstance')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }

  onchange(event: Event, action: any) {
    let target = <HTMLInputElement>event.target;
    let permission = target.closest('tr')?.dataset['permission'];
    if (
      target.closest('tr') != null &&
      permission != undefined &&
      permission != null
    ) {
      if (target.checked) {
        this.PermissionsList[permission].push(action);
      } else {
        const index = this.PermissionsList[permission].indexOf(action);
        if (index > -1) {
          this.PermissionsList[permission].splice(index, 1);
        }
      }
    }
  }

  getDiff() {
    let test: { [key: string]: any[] } = {};
    for (let key in this.PermissionsList) {
      if (
        JSON.stringify(this.PermissionsList[key]) ===
        JSON.stringify(this.PermissionsList1[key])
      ) {
        continue;
      } else {
        test[key] = this.PermissionsList[key];
      }
    }
    return test;
  }

  save() {
    document.querySelector('.updateUserLoad')?.classList.remove('d-none');
    this.userPermisssionService.getUserPermissionsByUserId(this.id).subscribe(
      (result) => {
        let r = result.data;
        let permissions = JSON.parse(r.code);
        this.PermissionsList1 = permissions;
        this.hasChange =
          JSON.stringify(this.PermissionsList) !=
          JSON.stringify(this.PermissionsList1);
        if (this.hasChange == true) {
          this.userPermissions.code = JSON.stringify(this.PermissionsList);
          this.userPermisssionService
            .updateUserPermissions(
              this.userPermissions,
              this.userPermissions.id
            )
            .subscribe(
              (result) => {
                const formatedTimestamp = () => {
                  const d = new Date();
                  const date = d.toISOString().split('T')[0];
                  const time = d.toTimeString().split(' ')[0];
                  return `${date} ${time}`;
                };

                this.CreateLogs(
                  'Edit',
                  formatedTimestamp(),
                  18,
                  this.userPermissions.id,
                  this.usrr,
                  3
                );
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-right',
                  showConfirmButton: false,
                  timer: 2500,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                  },
                });
                document
                  .querySelector('.updateUserLoad')
                  ?.classList.add('d-none');
                Toast.fire({
                  icon: 'success',
                  title: 'User updated',
                });
                this.getDiffLogs();
              },
              (error) => {
                document
                  .querySelector('.updateUserLoad')
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
          document.querySelector('.updateUserLoad')?.classList.add('d-none');
          const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'info',
            title: 'Nothing was changed',
          });
        }
      },
      (error) => {
        document.querySelector('.updateUserLoad')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }

  displayStyle = 'none';
  cpuChange(value: any) {
    this.value = value;
  }

  file: any;
  imgUrl: any;
  selectImge(event: any) {
    this.file = event.target.files[0];
    let fr = new FileReader();
    fr.readAsDataURL(this.file);
    fr.onload = (event) => (this.imgUrl = fr.result);
  }

  updateUser(id: any) {
    let data = this.userForm.value;
    let fd = new FormData();

    data.browser = this.browserName;
    data.ip_address = this.user.ip_address;
    data.last_auth = this.user.last_auth;
    //data.photo = this.user.photo
    data.has_token = this.user.has_token;

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

    document.querySelector('.updateUserLoad')?.classList.remove('d-none');
    if (this.file) {
      data.account = this.usrr.account;
      data.id = this.id;
      fd.append('users', JSON.stringify(data));
      fd.append('file', this.file);

      this.userservice.editUser(fd, id).subscribe(
        (result) => {
          if (
            result.status == 200 &&
            result.message == 'Nothing was changed!'
          ) {
            document.querySelector('.updateUserLoad')?.classList.add('d-none');
            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: 'info',
              title: 'Nothing was changed',
            });
          } else if (
            result.status == 200 &&
            result.message !== 'Nothing was changed!'
          ) {
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            this.CreateLogs('Edit', formatedTimestamp(), 1, id, this.usrr, 3);
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            document.querySelector('.updateUserLoad')?.classList.add('d-none');
            Toast.fire({
              icon: 'success',
              title: 'User updated',
            });
            this.getDiffLogs();
            this.user.browser = data.browser;
            this.user.firstname = data.firstname;
            this.user.lastname = data.lastname;
            this.user.status = data.status;
            this.user.role = data.role;
            this.user.ip_address = data.ip_address;
            this.user.timezone = data.timezone;
            this.user.photo = result.data.photo;
            this.user.language = data.language;
            this.user.email = data.email;
          } else {
            document.querySelector('.updateUserLoad')?.classList.add('d-none');
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong!',
              icon: 'error',
              confirmButtonColor: '#2f49c7',
            });
          }
        },
        (error) => {
          document.querySelector('.updateUserLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else {
      data.photo = this.user.photo;

      this.userservice.updateUser(data, id).subscribe(
        (result) => {
          if (
            result.status == 200 &&
            result.message == 'Nothing was changed!'
          ) {
            document.querySelector('.updateUserLoad')?.classList.add('d-none');
            const Toast = Swal.mixin({
              toast: true,
              position: 'center',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: 'info',
              title: 'Nothing was changed',
            });
          } else if (
            result.status == 200 &&
            result.message !== 'Nothing was changed!'
          ) {
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            this.CreateLogs('Edit', formatedTimestamp(), 1, id, this.usrr, 3);

            const Toast = Swal.mixin({
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            document.querySelector('.updateUserLoad')?.classList.add('d-none');
            Toast.fire({
              icon: 'success',
              title: 'User updated',
            });
            this.getDiffLogs();
            this.user.browser = data.browser;
            this.user.firstname = data.firstname;
            this.user.lastname = data.lastname;
            this.user.status = data.status;
            this.user.role = data.role;
            this.user.ip_address = data.ip_address;
            this.user.timezone = data.timezone;
            this.user.photo = data.photo;
            this.user.language = data.language;
            this.user.email = data.email;
          } else {
            document.querySelector('.updateUserLoad')?.classList.add('d-none');
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong!',
              icon: 'error',
              confirmButtonColor: '#2f49c7',
            });
          }
        },
        (error) => {
          document.querySelector('.updateUserLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    }
  }

  updateUserSecurity(id: any) {
    if (this.userSecurityForm.invalid || this.userSecurityForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.updateUserLoad')?.classList.remove('d-none');
    this.userSecurityService.getUserSecurityByUserId(id).subscribe(
      (result) => {
        let user_security = result.data;

        if (user_security.login !== this.userSecurityForm.getRawValue().login) {
          this.userSecurityService
            .login(this.userSecurityForm.getRawValue().login)
            .subscribe(
              (result) => {
                if (result.status == 200 && result.data !== null) {
                  document
                    .querySelector('.updateUserLoad')
                    ?.classList.add('d-none');
                  Swal.fire({
                    title: 'Error!',
                    text: 'Choose another login please!',
                    icon: 'error',
                    confirmButtonColor: '#2f49c7',
                  });
                } else {
                  user_security.login =
                    this.userSecurityForm.getRawValue().login;
                  user_security.password =
                    this.userSecurityForm.getRawValue().password;

                  this.userSecurityService
                    .updateUserSecurity(user_security, user_security.id)
                    .subscribe(
                      (result) => {
                        if (
                          result.status == 200 &&
                          result.message == 'Nothing was changed!'
                        ) {
                          document
                            .querySelector('.updateUserLoad')
                            ?.classList.add('d-none');
                          const Toast = Swal.mixin({
                            toast: true,
                            position: 'center',
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
                          Toast.fire({
                            icon: 'info',
                            title: 'Nothing was changed',
                          });
                        } else if (
                          result.status == 200 &&
                          result.message !== 'Nothing was changed!'
                        ) {
                          const formatedTimestamp = () => {
                            const d = new Date();
                            const date = d.toISOString().split('T')[0];
                            const time = d.toTimeString().split(' ')[0];
                            return `${date} ${time}`;
                          };
                          this.CreateLogs(
                            'Edit',
                            formatedTimestamp(),
                            2,
                            user_security.id,
                            this.usrr,
                            3
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
                            .querySelector('.updateUserLoad')
                            ?.classList.add('d-none');
                          Toast.fire({
                            icon: 'success',
                            title: 'User updated',
                          });
                          this.getDiffLogs();

                          this.userSecurity.password = user_security.password;
                          this.userSecurity.login = user_security.login;
                        } else {
                          document
                            .querySelector('.updateUserLoad')
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
                          .querySelector('.updateUserLoad')
                          ?.classList.add('d-none');
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
                document
                  .querySelector('.updateUserLoad')
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
          user_security.login = this.userSecurityForm.getRawValue().login;
          user_security.password = this.userSecurityForm.getRawValue().password;

          this.userSecurityService
            .updateUserSecurity(user_security, user_security.id)
            .subscribe(
              (result) => {
                if (
                  result.status == 200 &&
                  result.message == 'Nothing was changed!'
                ) {
                  document
                    .querySelector('.updateUserLoad')
                    ?.classList.add('d-none');
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer);
                      toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                  });
                  Toast.fire({
                    icon: 'info',
                    title: 'Nothing was changed',
                  });
                } else if (
                  result.status == 200 &&
                  result.message !== 'Nothing was changed!'
                ) {
                  const formatedTimestamp = () => {
                    const d = new Date();
                    const date = d.toISOString().split('T')[0];
                    const time = d.toTimeString().split(' ')[0];
                    return `${date} ${time}`;
                  };
                  this.CreateLogs(
                    'Edit',
                    formatedTimestamp(),
                    2,
                    user_security.id,
                    this.usrr,
                    3
                  );

                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-right',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer);
                      toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                  });
                  document
                    .querySelector('.updateUserLoad')
                    ?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'User updated',
                  });
                  this.getDiffLogs();

                  this.userSecurity.password = user_security.password;
                  this.userSecurity.login = user_security.login;
                } else {
                  document
                    .querySelector('.updateUserLoad')
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
                  .querySelector('.updateUserLoad')
                  ?.classList.add('d-none');
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
        document.querySelector('.updateUserLoad')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  deleteUserInstance(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this instance ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateUserLoad')?.classList.remove('d-none');
        this.usersInstancesService.getUserInstancesById(id).subscribe(
          (result) => {
            let user_ins = result.data;
            user_ins.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            user_ins.end_date = formatedTimestamp();
            this.usersInstancesService
              .updateUserInstance(user_ins, id)
              .subscribe(
                (result) => {
                  if (result.status == 200) {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      19,
                      id,
                      this.usrr,
                      3
                    );

                    let row = document.getElementById('ui-' + id);
                    if (row != null) {
                      $('#table_ui').DataTable().row(row).remove();
                      $('#table_ui').DataTable().draw();
                      this.userInstances = this.userInstances.filter(
                        (UI: { id: any }) => UI.id !== id
                      );
                      document
                        .querySelector('.updateUserLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Instance has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                      this.getDiffLogs();
                    }
                  } else {
                    document
                      .querySelector('.updateUserLoad')
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
                    .querySelector('.updateUserLoad')
                    ?.classList.add('d-none');
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
            document.querySelector('.updateUserLoad')?.classList.add('d-none');
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

  getUserByID() {
    this.userservice.getUserById(this.id).subscribe(
      (result) => {
        this.response = result;
        this.user = this.response.data;
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

  getUserPermission() {
    this.userPermisssionService.getUserPermissionsByUserId(this.id).subscribe(
      (result) => {
        let r = result.data;
        let permissions = JSON.parse(r.code);
        this.userPermissions.code = permissions;
        this.userPermissions.id = r.id;
        this.userPermissions.user = r.users;
        this.userPermissions.status = r.status;
        this.PermissionsList = permissions;
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

  getUserSecurity() {
    this.userSecurityService.getUserSecurityByUserId(this.id).subscribe(
      (result) => {
        this.response1 = result;
        this.userSecurity = this.response1.data;
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
  getDiffLogs() {
    let new_object: any = '';
    this.userslogsService.getUserLogsList(this.id).subscribe(
      (result) => {
        this.response2 = result;
        this.userLogsList1 = this.response2.data.map((elem: any) => {
          elem.element = this.elementType[elem.element];
          elem.source = this.sourceType[elem.source];
          return elem;
        });
        for (let key in this.userLogsList1) {
          if (
            JSON.stringify(this.userLogsList1[key]) ===
            JSON.stringify(this.userLogsList[key])
          ) {
            continue;
          } else {
            new_object = this.userLogsList1[key];
          }
        }
        $('#table_user_contact_logs')
          .DataTable()
          .row.add([
            new_object.id,
            new_object.action,
            new_object.element,
            new_object.element_id,
            new_object.log_date,
          ])
          .draw();
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
  getUserLogs() {
    this.userslogsService.getUserLogsList(this.id).subscribe(
      (result) => {
        this.response3 = result;
        this.userLogsList = this.response3.data.map((elem: any) => {
          elem.element = this.elementType[elem.element];
          elem.source = this.sourceType[elem.source];
          return elem;
        });
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

  getUserInstances() {
    this.usersInstancesService.getUserInstancesByUserId(this.id).subscribe(
      (result) => {
        this.response2 = result;
        this.userInstances = this.response2.data;
        this.dtTrigger.next();
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

  getAllServers() {
    this.usersInstancesService.getUserInstancesByUserId(this.id).subscribe(
      (result) => {
        let res: any;
        res = result;
        let userInstanceList = res.data;
        this.ServersSercie.getAllServers().subscribe(
          (result) => {
            let res1: any;
            res1 = result;
            if (res1.status == 200) {
              if (userInstanceList.length !== 0) {
                for (let i = 0; i < userInstanceList.length; i++) {
                  if (userInstanceList[i].element == 1) {
                    res1.data = res1.data.filter(
                      (s: { id: any }) =>
                        s?.id !== userInstanceList[i].element_id
                    );
                    this.serversList = res1.data;
                  } else {
                    this.serversList = res1.data;
                  }
                }
              } else {
                this.serversList = res1.data;
              }
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

  getAllDomainNames() {
    this.usersInstancesService.getUserInstancesByUserId(this.id).subscribe(
      (result) => {
        let res: any;
        res = result;
        let userInstanceList = res.data;
        this.domainNamesService.getAllDomainNames().subscribe(
          (result) => {
            let res1: any;
            res1 = result;
            if (res1.status == 200) {
              if (userInstanceList.length !== 0) {
                for (let i = 0; i < userInstanceList.length; i++) {
                  if (userInstanceList[i].element == 2) {
                    res1.data = res1.data.filter(
                      (s: { id: any }) =>
                        s?.id !== userInstanceList[i].element_id
                    );
                    this.domainNamesList = res1.data;
                  } else {
                    this.domainNamesList = res1.data;
                  }
                }
              } else {
                this.domainNamesList = res1.data;
              }
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

  getAllApplications() {
    this.usersInstancesService.getUserInstancesByUserId(this.id).subscribe(
      (result) => {
        let res: any;
        res = result;
        let userInstanceList = res.data;
        this.applicationsService.getApplicationList().subscribe(
          (result) => {
            let res1: any;
            res1 = result;
            if (res1.status == 200) {
              if (userInstanceList.length !== 0) {
                for (let i = 0; i < userInstanceList.length; i++) {
                  if (userInstanceList[i].element == 3) {
                    res1.data = res1.data.filter(
                      (s: { id: any }) =>
                        s?.id !== userInstanceList[i].element_id
                    );
                    this.applicationsList = res1.data;
                  } else {
                    this.applicationsList = res1.data;
                  }
                }
              } else {
                this.applicationsList = res1.data;
              }
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

  getUserModulesList() {
    this.coreUsersModuleService.getUserModulesList(this.id).subscribe(
      (result) => {
        this.response9 = result;
        for (let i = 0; i < this.response9.data.length; i++) {
          this.modulesList = this.response9.data.filter(
            (m: { module: any }) => m?.module.status == 1
          );
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

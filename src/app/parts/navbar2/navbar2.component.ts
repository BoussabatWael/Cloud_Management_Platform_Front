import { inventory_applications } from './../../models/inventory_applications';
import { ApplicationService } from 'src/app/Services/application.service';
import { ServerService } from './../../Services/server.service';
import { InstanceService } from 'src/app/Services/instance.service';
import { InventoryTemplatesService } from './../../Services/inventory-templates.service';
import { UserslogsService } from './../../Services/userslogs.service';
import { UsersPermissionsService } from 'src/app/Services/users-permissions.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { logs } from 'src/app/models/core_logs';
import { core_users_permissions } from 'src/app/models/core_users_permissions';
import { UserService } from 'src/app/Services/user.service';
import { UsersSecurityService } from 'src/app/Services/users-security.service';
import { core_users_tokens } from 'src/app/models/core_users_tokens';
import { core_users_security } from 'src/app/models/core_users_security';
import { UsersTokensService } from 'src/app/Services/users-tokens.service';
import { CloudProvidersAccountsService } from 'src/app/Services/cloud-providers-accounts.service';
import { AccessCredentialsService } from 'src/app/Services/access-credentials.service';
import { ApplicationSourcesService } from 'src/app/Services/application-sources.service';
import { ApplicationVersionsService } from 'src/app/Services/application-versions.service';
import Swal from 'sweetalert2';
import { core_users } from 'src/app/models/core_users';

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css'],
})
export class Navbar2Component implements OnInit {
  @ViewChild('closebuttonusr') closebuttonusr: any;
  @ViewChild('closebuttonsrv') closebuttonsrv: any;
  @ViewChild('closebuttonapk') closebuttonapk: any;
  usr: any;
  user: any;
  value: any;
  userPermission: any;
  templatesList: any;
  usersList: any;
  usersList1: any;
  serversList1: any;
  serversList: any;
  applicationList1: any;
  applicationList: any;
  cloudProvidersAccountsList: any;
  response: any;
  response1: any;
  response2: any;
  response3: any;
  response4: any;
  response5: any;
  response6: any;
  response7: any;
  usrPer: any;
  ipAddress: any;
  browserName: any;
  userLogs: logs = new logs();
  userPermissions: core_users_permissions = new core_users_permissions();
  usersTokens: core_users_tokens = new core_users_tokens();
  usersSecurity: core_users_security = new core_users_security();
  userAddForm!: FormGroup;
  serverAddForm!: FormGroup;
  applicationAddForm!: FormGroup;
  submitted10: boolean = false;
  submitted20: boolean = false;
  submitted30: boolean = false;
  selectedOption1: any = '';
  pageUrl: any;
  application: inventory_applications = new inventory_applications();
  adminop = [
    { name: 'Admin', value: 2 },
    { name: 'Agent', value: 3 },
    { name: 'Supervisor', value: 4 },
  ];
  classe = [
    { name: 'Website', value: 1 },
    { name: 'Platform', value: 2 },
    { name: 'Tool', value: 3 },
    { name: 'SaaS', value: 4 },
  ];
  location = [
    { name: 'France', value: 1 },
    { name: 'Brazil', value: 2 },
    { name: 'Germany', value: 3 },
  ];
  cpu = [
    { name: 'Xeon E3-1275 V6', value: 1 },
    { name: 'Core i7-7700T', value: 2 },
    { name: 'Core i7-7700T', value: 2 },
  ];
  disk_space = [
    { name: '512Go', value: 1 },
    { name: '1024Go', value: 2 },
    { name: '2048Go', value: 2 },
  ];
  memory = [
    { name: '16Gb', value: 1 },
    { name: '32Gb', value: 2 },
    { name: '64Gb', value: 2 },
  ];
  categories = [
    { value: 1, name: 'cat1' },
    { value: 2, name: 'cat2' },
    { value: 3, name: 'cat3' },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private usersService: UserService,
    private userslogsService: UserslogsService,
    private usersSercurityService: UsersSecurityService,
    private UsersPermissionsService: UsersPermissionsService,
    private UsersTokensService: UsersTokensService,
    private InventoryTemplatesService: InventoryTemplatesService,
    private CloudProvidersAccountsService: CloudProvidersAccountsService,
    private instanceService: InstanceService,
    private ServersSercie: ServerService,
    private AccessCredentialsService: AccessCredentialsService,
    private applicationsService: ApplicationService,
    private ApplicationSourcesService: ApplicationSourcesService,
    private ApplicationVersionsService: ApplicationVersionsService
  ) {
    this.userAddForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.serverAddForm = this.fb.group({
      creation_type: [''],
      cloud_provider_account: this.fb.group({
        id: [''],
      }),
      location: [''],
      template: this.fb.group({
        id: [''],
      }),
      cpu: [''],
      disk_space: [''],
      memory: [''],
      ip_address: [''],
      hostname: [''],
      name: [''],
      ssh: [''],
      category: this.fb.group({
        id: [''],
      }),
      login: [''],
      password: ['', Validators.required],
      port: [''],
    });

    this.applicationAddForm = this.fb.group({
      name: ['', Validators.required],
      version: ['', Validators.required],
      classe: ['', Validators.required],
      logo: [''],
      source_type: ['', Validators.required],
      source_build: [''],
      source_account: [''],
      source_url: [''],
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
    this.pageUrl = this.router.url;

    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElement = event?.target?.closest('.btnDelUser');
      // @ts-ignore
      let clickedElement1 = event?.target?.closest('.btnDelServer');
      // @ts-ignore
      let clickedElement2 = event?.target?.closest('.btnDeleteAppp');

      if (clickedElement) {
        _this.deleteUser(clickedElement.dataset.id);
      }
      if (clickedElement1) {
        _this.deleteServer(clickedElement1.dataset.id);
      }
      if (clickedElement2) {
        _this.deleteApplication(clickedElement2.dataset.id);
      }
    });

    this.getIPAddress();
    this.browserName = this.detectBrowserName();
    this.getTemplatesList();
    this.getCloudProvidersAccounts();
    this.getAllUsers();
    this.getAllServers();
    this.getApplicationList();

    setTimeout(() => {
      (<any>$('#formapplicationapp')).steps({
        headerTag: 'h3',
        bodyTag: 'section',
        transitionEffect: 'slide',
        onFinished: function (event: any, currentIndex: any) {
          $('.sub-btn').trigger('click');
        },
      });
    }, 20);

    setTimeout(() => {
      (<any>$('#formapplicationserver')).steps({
        headerTag: 'h3',
        bodyTag: 'section',
        transitionEffect: 'slide',
        onFinished: function (event: any, currentIndex: any) {
          $('.sub-btn').trigger('click');
        },
      });
    }, 20);
  }

  get useraddform() {
    return this.userAddForm.controls;
  }
  get serveraddform() {
    return this.serverAddForm.controls;
  }
  get appaddform() {
    return this.applicationAddForm.controls;
  }
  changecheck(event: Event) {
    this.selectedOption1 = (event.target as HTMLTextAreaElement).value;
  }
  cpuChange(value: any) {
    this.value = value;
  }
  close() {
    this.userAddForm.reset();
    this.serverAddForm.reset();
    this.applicationAddForm.reset();
    document.querySelector('.addusern')?.classList.add('d-none');
    document.querySelector('.addservern')?.classList.add('d-none');
    document.querySelector('.addappn')?.classList.add('d-none');
  }

  getIPAddress() {
    this.http
      .get('https://api.ipify.org/?format=json')
      .subscribe((res: any) => {
        this.ipAddress = res.ip;
      });
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

  saveUser() {
    let data = this.userAddForm.value;
    if (this.userAddForm.invalid || this.userAddForm.value.length == 0) {
      this.submitted10 = true;
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
          document.querySelector('.addusern')?.classList.remove('d-none');
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
                                      .querySelector('.addusern')
                                      ?.classList.add('d-none');
                                    Toast.fire({
                                      icon: 'success',
                                      title: 'User Added successfully',
                                    });
                                    this.close();
                                    this.closebuttonusr.nativeElement.click();
                                    if (this.pageUrl == '/users') {
                                      this.getDiffUser();
                                    }
                                  } else {
                                    document
                                      .querySelector('.addusern')
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
                                    .querySelector('.addusern')
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
                                .querySelector('.addusern')
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
                              .querySelector('.addusern')
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
                        .querySelector('.addusern')
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
                      .querySelector('.addusern')
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
                document.querySelector('.addusern')?.classList.add('d-none');
                Swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong!',
                  icon: 'error',
                  confirmButtonColor: '#2f49c7',
                });
              }
            },
            (error) => {
              document.querySelector('.addusern')?.classList.add('d-none');
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
        document.querySelector('.addusern')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  getAllUsers() {
    this.usersService.getAllUsers().subscribe(
      (result) => {
        this.response3 = result;
        if (this.response3.status == 200) {
          this.usersList = this.response3.data.filter(
            (u: { id: any }) => u.id !== this.user.id
          );
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

  getDiffUser() {
    let new_object: any = '';
    this.usersService.getAllUsers().subscribe(
      (result) => {
        this.response2 = result;
        this.usersList1 = this.response2.data.filter(
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

                                          <a class="btn btn-sm btn-soft-danger btnDelUser" data-id="${new_object?.id}" type="button" (onClick)="deleteUser(new_object?.id)"  placement="top" ngbTooltip="Delete">
                                              <i class="mdi mdi-delete font-size-16"></i></a>
                                      </div>`;
        } else if (
          this.usrPer.users.includes('update') == false &&
          this.usrPer.users.includes('delete') == true
        ) {
          new_object.actions = ` <div class="d-flex gap-2 justify-content-center">
                                        <a class="btn btn-sm btn-soft-secondary " placement="top" ngbTooltip="Email">
                                          <i class="mdi mdi-email-plus font-size-16"></i></a>

                                          <a class="btn btn-sm btn-soft-danger btnDelUser" data-id="${new_object?.id}" type="button" (onClick)="deleteUser(new_object?.id)"  placement="top" ngbTooltip="Delete">
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
          'user-' + new_object?.id;
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

  saveServerr() {
    this.serverAddForm.patchValue({ creation_type: 1 });
    let data = this.serverAddForm.value;
    data.status = 1;
    data.favorite = 1;
    data.classe = 1;
    data.environment = 1;
    data.operating_system = 1;
    data.os_version = 'Windows 10';
    data.environment = 1;
    data.account = this.user.account;

    const formatedTimestamp = () => {
      const d = new Date();
      const date = d.toISOString().split('T')[0];
      const time = d.toTimeString().split(' ')[0];
      return `${date} ${time}`;
    };

    if (this.serverAddForm.invalid || this.serverAddForm.value.length == 0) {
      this.submitted20 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    if (!this.checkIfValidPortnumber(data.port)) {
      return;
    }

    document.querySelector('.addservern')?.classList.remove('d-none');
    this.instanceService.saveInstance(data).subscribe(
      (result) => {
        let instance = result.data;

        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          3,
          instance.id,
          this.user,
          7
        );

        let server = data;
        server.instance = instance;
        this.ServersSercie.saveServer(server).subscribe(
          (result) => {
            let new_server = result.data;
            this.CreateLogs(
              'Create',
              formatedTimestamp(),
              20,
              new_server.id,
              this.user,
              7
            );

            if (this.selectedOption1 == 'yes') {
              let access_cred = data;
              access_cred.element = 1;
              access_cred.element_id = new_server.id;
              this.AccessCredentialsService.addServerAccessCredentials(
                access_cred
              ).subscribe(
                (result) => {
                  let new_acc = result.data;
                  this.CreateLogs(
                    'Create',
                    formatedTimestamp(),
                    6,
                    new_acc.id,
                    this.user,
                    7
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
                    .querySelector('.addservern')
                    ?.classList.add('d-none');

                  Toast.fire({
                    icon: 'success',
                    title: 'Server Added successfully',
                  });
                  this.close();
                  this.closebuttonsrv.nativeElement.click();
                  if (this.pageUrl == '/servers') {
                    this.getDiffServer();
                  }
                },
                (error) => {
                  document
                    .querySelector('.addservern')
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

              document.querySelector('.addservern')?.classList.add('d-none');

              Toast.fire({
                icon: 'success',
                title: 'Server Added successfully',
              });
              this.close();
              this.closebuttonsrv.nativeElement.click();
              if (this.pageUrl == '/servers') {
                this.getDiffServer();
              }
            }
          },
          (error) => {
            document.querySelector('.addservern')?.classList.add('d-none');
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
        document.querySelector('.addservern')?.classList.add('d-none');
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
    this.ServersSercie.getAllServers().subscribe(
      (result) => {
        this.response5 = result;
        if (this.response5.status == 200) {
          this.serversList = this.response5.data;
          //this.dtTrigger.next();
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

  getDiffServer() {
    let new_object: any = '';
    this.ServersSercie.getAllServers().subscribe(
      (result) => {
        this.response4 = result;
        this.serversList1 = this.response4.data;
        for (let key in this.serversList1) {
          if (
            JSON.stringify(this.serversList1[key]) ===
            JSON.stringify(this.serversList[key])
          ) {
            continue;
          } else {
            new_object = this.serversList1[key];
          }

          if (new_object?.instance?.status === 1) {
            new_object.instance.status =
              '<span class="badge rounded-pill badge-soft-success font-size-12">Active</span>';
          } else if (new_object?.instance?.status === 2) {
            new_object.instance.status =
              '<span class="badge rounded-pill badge-soft-danger font-size-12">Inactive</span>';
          } else {
            new_object.instance.status =
              '<span class="badge rounded-pill badge-soft-warning font-size-12">In Progress</span>';
          }

          if (new_object?.cpu === 1) {
            new_object.cpu = `Xeon E3-1275 V6`;
          } else if (new_object?.cpu === 2) {
            new_object.cpu = `Core i7-7700T`;
          } else if (new_object?.cpu === 3) {
            new_object.cpu = `Core i7-7100T`;
          } else {
            new_object.cpu = `Core i7-7000T`;
          }

          if (new_object?.disk_space === 1) {
            new_object.disk_space = '512Go';
          } else if (new_object?.disk_space === 2) {
            new_object.disk_space = '1024Go';
          } else if (new_object?.disk_space === 3) {
            new_object.disk_space = '2048Go';
          } else {
            new_object.disk_space = '5000Go';
          }

          new_object.instance.cloud_provider_account.provider.name =
            `<a href="#/providers/providers-details/` +
            new_object?.instance?.cloud_provider_account?.provider?.id +
            `"> ` +
            new_object?.instance?.cloud_provider_account?.provider?.name +
            `</a>`;

          if (
            this.usrPer.servers.includes('update') == true &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions =
              `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-primary"  href="#/servers/server-details/` +
              new_object?.id +
              `" placement="top"
                          ngbTooltip="View">
                          <i class="mdi mdi-pencil font-size-16"></i>
                        </a>

                        <a class="btn btn-sm btn-soft-danger btnDelServer" data-id="${new_object?.id}" (click)="deleteServer(server?.id)" type="button" placement="top"
                          ngbTooltip="Delete">
                          <i class="mdi mdi-delete font-size-16"></i>
                        </a>
                        <div class="btn-group">
                          <a type="button" data-bs-toggle="dropdown" placement="top" ngbtooltip="Other"
                            aria-expanded="false" class="btn btn-sm btn-soft-secondary dropdown-toggle"
                            aria-describedby="ngb-tooltip-16"><i class="mdi mdi-chevron-down font-size-16"></i></a>

                          <div class="dropdown-menu">
                            <a href="#" class="dropdown-item">View Console</a>
                            <a href="#" class="dropdown-item">Restart</a>
                            <a href="#" class="dropdown-item">Stop</a>
                            <a href="#" class="dropdown-item">Signin to</a>
                            <a href="#" class="dropdown-item">Clear disk space</a>
                            <a href="#" class="dropdown-item">Check port availability</a>
                            <a href="#" class="dropdown-item">Update system</a>

                            <a href="#" class="dropdown-item">IP blocker</a><a href="#" class="dropdown-item">Install
                              app</a>
                            <a href="#" class="dropdown-item">Destroy</a>
                          </div>
                        </div>
                      </div>`;
          } else if (
            this.usrPer.servers.includes('update') == false &&
            this.usrPer.servers.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-danger btnDelServer" data-id="${new_object?.id}" (click)="deleteServer(server?.id)" type="button" placement="top"
                          ngbTooltip="Delete">
                          <i class="mdi mdi-delete font-size-16"></i>
                        </a>
                        <div class="btn-group">
                          <a type="button" data-bs-toggle="dropdown" placement="top" ngbtooltip="Other"
                            aria-expanded="false" class="btn btn-sm btn-soft-secondary dropdown-toggle"
                            aria-describedby="ngb-tooltip-16"><i class="mdi mdi-chevron-down font-size-16"></i></a>

                          <div class="dropdown-menu">
                            <a href="#" class="dropdown-item">View Console</a>
                            <a href="#" class="dropdown-item">Restart</a>
                            <a href="#" class="dropdown-item">Stop</a>
                            <a href="#" class="dropdown-item">Signin to</a>
                            <a href="#" class="dropdown-item">Clear disk space</a>
                            <a href="#" class="dropdown-item">Check port availability</a>
                            <a href="#" class="dropdown-item">Update system</a>

                            <a href="#" class="dropdown-item">IP blocker</a><a href="#" class="dropdown-item">Install
                              app</a>
                            <a href="#" class="dropdown-item">Destroy</a>
                          </div>
                        </div>
                      </div>`;
          } else if (
            this.usrPer.servers.includes('update') == true &&
            this.usrPer.servers.includes('delete') == false
          ) {
            new_object.actions =
              `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-primary"  href="#/servers/server-details/` +
              new_object?.id +
              `" placement="top"
                          ngbTooltip="View">
                          <i class="mdi mdi-pencil font-size-16"></i>
                        </a>
                        <div class="btn-group">
                          <a type="button" data-bs-toggle="dropdown" placement="top" ngbtooltip="Other"
                            aria-expanded="false" class="btn btn-sm btn-soft-secondary dropdown-toggle"
                            aria-describedby="ngb-tooltip-16"><i class="mdi mdi-chevron-down font-size-16"></i></a>

                          <div class="dropdown-menu">
                            <a href="#" class="dropdown-item">View Console</a>
                            <a href="#" class="dropdown-item">Restart</a>
                            <a href="#" class="dropdown-item">Stop</a>
                            <a href="#" class="dropdown-item">Signin to</a>
                            <a href="#" class="dropdown-item">Clear disk space</a>
                            <a href="#" class="dropdown-item">Check port availability</a>
                            <a href="#" class="dropdown-item">Update system</a>

                            <a href="#" class="dropdown-item">IP blocker</a><a href="#" class="dropdown-item">Install
                              app</a>
                            <a href="#" class="dropdown-item">Destroy</a>
                          </div>
                        </div>
                      </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                        <div class="btn-group">
                          <a type="button" data-bs-toggle="dropdown" placement="top" ngbtooltip="Other"
                            aria-expanded="false" class="btn btn-sm btn-soft-secondary dropdown-toggle"
                            aria-describedby="ngb-tooltip-16"><i class="mdi mdi-chevron-down font-size-16"></i></a>

                          <div class="dropdown-menu">
                            <a href="#" class="dropdown-item">View Console</a>
                            <a href="#" class="dropdown-item">Restart</a>
                            <a href="#" class="dropdown-item">Stop</a>
                            <a href="#" class="dropdown-item">Signin to</a>
                            <a href="#" class="dropdown-item">Clear disk space</a>
                            <a href="#" class="dropdown-item">Check port availability</a>
                            <a href="#" class="dropdown-item">Update system</a>

                            <a href="#" class="dropdown-item">IP blocker</a><a href="#" class="dropdown-item">Install
                              app</a>
                            <a href="#" class="dropdown-item">Destroy</a>
                          </div>
                        </div>
                      </div>`;
          }

          $('#table_server')
            .DataTable()
            .row.add([
              new_object?.id,
              new_object?.instance?.name,
              new_object?.ip_address,
              new_object?.instance.cloud_provider_account?.provider?.name,
              new_object?.cpu,
              new_object?.disk_space,
              new_object?.instance?.status,
              new_object?.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_server').DataTable().row(':last').node().id =
            'server-' + new_object?.id;
          return new_object;
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

  file: any;
  imgUrl: any;
  selectImge(event: any) {
    this.file = event.target.files[0];
    let fr = new FileReader();
    fr.readAsDataURL(this.file);
    fr.onload = (event) => (this.imgUrl = fr.result);
  }

  saveApplication() {
    let data = this.applicationAddForm.value;
    data.account = this.user.account;
    data.status = 1;
    data.environment = 1;
    const formatedTimestamp = () => {
      const d = new Date();
      const date = d.toISOString().split('T')[0];
      const time = d.toTimeString().split(' ')[0];
      return `${date} ${time}`;
    };

    if (
      this.applicationAddForm.invalid ||
      this.applicationAddForm.value.length == 0
    ) {
      this.submitted30 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addappn')?.classList.remove('d-none');

    this.application.name = data.name;
    this.application.logo = data.logo;
    this.application.status = data.status;
    this.application.environment = data.environment;
    this.application.classe = data.classe;
    this.application.start_date = formatedTimestamp();
    this.application.account = data.account;

    let fd = new FormData();
    fd.append('application', JSON.stringify(this.application));
    fd.append('file', this.file);
    if (this.file) {
      this.applicationsService.saveApplication(fd).subscribe(
        (result) => {
          let new_app = result.data;
          this.CreateLogs(
            'Create',
            formatedTimestamp(),
            12,
            new_app.id,
            this.user,
            11
          );

          let app_src = data;
          app_src.application = new_app;
          this.ApplicationSourcesService.addApplicationSources(
            app_src
          ).subscribe(
            (result) => {
              let new_app_src = result.data;
              this.CreateLogs(
                'Create',
                formatedTimestamp(),
                15,
                new_app_src.id,
                this.user,
                11
              );

              let app_ver = data;
              app_ver.application = new_app;
              this.ApplicationVersionsService.addApplicationVersion(
                app_ver
              ).subscribe(
                (result) => {
                  let new_app_ver = result.data;
                  this.CreateLogs(
                    'Create',
                    formatedTimestamp(),
                    4,
                    new_app_ver.id,
                    this.user,
                    11
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
                  document.querySelector('.addappn')?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'Application Added successfully',
                  });
                  this.close();
                  this.closebuttonapk.nativeElement.click();
                  if (this.pageUrl == '/applications') {
                    this.getDiffApp();
                  }
                },
                (error) => {
                  document.querySelector('.addappn')?.classList.add('d-none');
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
              document.querySelector('.addappn')?.classList.add('d-none');
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
          document.querySelector('.addappn')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else {
      this.applicationsService.addApplication(data).subscribe(
        (result) => {
          let new_app = result.data;
          this.CreateLogs(
            'Create',
            formatedTimestamp(),
            12,
            new_app.id,
            this.user,
            11
          );

          let app_src = data;
          app_src.application = new_app;
          this.ApplicationSourcesService.addApplicationSources(
            app_src
          ).subscribe(
            (result) => {
              let new_app_src = result.data;
              this.CreateLogs(
                'Create',
                formatedTimestamp(),
                15,
                new_app_src.id,
                this.user,
                11
              );

              let app_ver = data;
              app_ver.application = new_app;
              this.ApplicationVersionsService.addApplicationVersion(
                app_ver
              ).subscribe(
                (result) => {
                  let new_app_ver = result.data;
                  this.CreateLogs(
                    'Create',
                    formatedTimestamp(),
                    4,
                    new_app_ver.id,
                    this.user,
                    11
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
                  document.querySelector('.addappn')?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'Application Added successfully',
                  });
                  this.close();
                  this.closebuttonapk.nativeElement.click();
                  if (this.pageUrl == '/applications') {
                    this.getDiffApp();
                  }
                },
                (error) => {
                  document.querySelector('.addappn')?.classList.add('d-none');
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
              document.querySelector('.addappn')?.classList.add('d-none');
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
          document.querySelector('.addappn')?.classList.add('d-none');
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

  getApplicationList() {
    this.applicationsService.getApplicationList().subscribe(
      (result) => {
        this.response7 = result;
        this.applicationList = this.response7.data;
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

  getDiffApp() {
    let new_object: any;
    this.applicationsService.getApplicationList().subscribe(
      (result) => {
        this.response6 = result;
        this.applicationList1 = this.response6.data;
        for (let key in this.applicationList1) {
          if (
            JSON.stringify(this.applicationList1[key]) ===
            JSON.stringify(this.applicationList[key])
          ) {
            continue;
          } else {
            new_object = this.applicationList1[key];
          }

          if (new_object?.status === 1) {
            new_object.status =
              '<span class="badge rounded-pill badge-soft-success font-size-12">Active</span>';
          } else if (new_object?.status === 2) {
            new_object.instance.status =
              '<span class="badge rounded-pill badge-soft-danger font-size-12">Inactive</span>';
          } else {
            new_object.status =
              '<span class="badge rounded-pill badge-soft-warning font-size-12">In Progress</span>';
          }

          if (new_object?.classe === 1) {
            new_object.classe = `Website`;
          } else if (new_object?.classe === 2) {
            new_object.classe = `Platform`;
          } else if (new_object?.classe === 3) {
            new_object.classe = `Tool`;
          } else {
            new_object.classe = `SaaS`;
          }

          if (new_object?.environment === 1) {
            new_object.environment = 'Env1';
          } else if (new_object?.environment === 2) {
            new_object.environment = 'Env2';
          } else if (new_object?.environment === 3) {
            new_object.environment = 'Env3';
          } else {
            new_object.environment = 'Env4';
          }

          if (
            this.usrPer.applications.includes('update') == true &&
            this.usrPer.applications.includes('delete') == true
          ) {
            new_object.actions =
              `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-primary" href="#/application-details/` +
              new_object?.id +
              `" placement="top"
                          ngbTooltip="View">
                          <i class="mdi mdi-pencil font-size-16"></i>
                        </a>
                        <a class="btn btn-sm btn-soft-danger btnDeleteAppp" data-id="${new_object?.id}" (click)="deleteApplication(app?.id)" type="button" placement="top"
                          ngbTooltip="Delete">
                          <i class="mdi mdi-delete font-size-16"></i>
                        </a>
                      </div>`;
          } else if (
            this.usrPer.applications.includes('update') == false &&
            this.usrPer.applications.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-danger btnDeleteAppp" data-id="${new_object?.id}" (click)="deleteApplication(app?.id)" type="button" placement="top"
                          ngbTooltip="Delete">
                          <i class="mdi mdi-delete font-size-16"></i>
                        </a>
                      </div>`;
          } else if (
            this.usrPer.applications.includes('update') == true &&
            this.usrPer.applications.includes('delete') == false
          ) {
            new_object.actions =
              `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-primary" href="#/application-details/` +
              new_object?.id +
              `" placement="top"
                          ngbTooltip="View">
                          <i class="mdi mdi-pencil font-size-16"></i>
                        </a>
                      </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">---</div>`;
          }

          $('#table_app')
            .DataTable()
            .row.add([
              new_object?.id,
              new_object?.classe,
              new_object?.name,
              new_object?.environment,
              new_object?.status,
              new_object?.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_app').DataTable().row(':last').node().id =
            'app-' + new_object?.id;
          return new_object;
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
  deleteUser(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't delete this user !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
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
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'User has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
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
    });
  }

  deleteServer(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this server ?!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ServersSercie.getserverById(id).subscribe(
          (result) => {
            let server = result.data;
            server.instance.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            server.instance.end_date = formatedTimestamp();
            this.instanceService
              .updateInventoryInstance(server.instance, server.instance.id)
              .subscribe(
                (result) => {
                  if (result.status == 200) {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      3,
                      server.instance.id,
                      this.user,
                      7
                    );

                    let row = document.getElementById('server-' + id);
                    if (row != null) {
                      $('#table_server').DataTable().row(row).remove();
                      $('#table_server').DataTable().draw();
                      this.serversList = this.serversList.filter(
                        (s: { id: any }) => s.id !== id
                      );
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Server has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
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
    });
  }

  deleteApplication(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this application ?!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.applicationsService.getApplicationByID(id).subscribe(
          (result) => {
            let app = result.data;
            app.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            app.end_date = formatedTimestamp();
            this.applicationsService.updateApplication(app, id).subscribe(
              (result) => {
                if (result.status == 200) {
                  this.CreateLogs(
                    'Delete',
                    formatedTimestamp(),
                    12,
                    id,
                    this.user,
                    11
                  );

                  let row = document.getElementById('app-' + id);
                  if (row != null) {
                    $('#table_app').DataTable().row(row).remove();
                    $('#table_app').DataTable().draw();
                    this.applicationList = this.applicationList.filter(
                      (a: { id: any }) => a.id !== id
                    );
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Application has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
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
    });
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

  checkIfValidPortnumber(port: any) {
    // Regular expression to check if number is a valid port number
    if (
      /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi.test(
        port
      )
    ) {
      return true;
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You have entered an invalid Port number!',
      confirmButtonColor: '#2f49c7',
    });
    return false;
  }

  getTemplatesList() {
    this.InventoryTemplatesService.getTemplatesList().subscribe(
      (result) => {
        this.response = result;
        if (this.response.status == 200) {
          this.templatesList = this.response.data;
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

  getCloudProvidersAccounts() {
    this.CloudProvidersAccountsService.getCloudProvidersAccountsList().subscribe(
      (result) => {
        this.response1 = result;
        if (this.response1.status == 200) {
          this.cloudProvidersAccountsList = this.response1.data;
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
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('apikey');
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    localStorage.clear();
    this.router.navigateByUrl('');
  }
}

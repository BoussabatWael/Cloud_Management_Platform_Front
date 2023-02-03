import { AccessCredentialsService } from 'src/app/Services/access-credentials.service';
import { InventoryTemplatesService } from './../../../Services/inventory-templates.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ServerService } from 'src/app/Services/server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { UserslogsService } from 'src/app/Services/userslogs.service';
import { Subject } from 'rxjs';
import { InstanceService } from 'src/app/Services/instance.service';
import { logs } from 'src/app/models/core_logs';
import { core_users } from 'src/app/models/core_users';
import { CloudProvidersAccountsService } from 'src/app/Services/cloud-providers-accounts.service';

declare function setP(): any;
@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css'],
})
export class ServersComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  value: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  serversList: any;
  serversList1: any;
  response: any;
  responsee: any;
  response1: any;
  response2: any;
  cloudProvidersAccountsList: any;
  templatesList: any;
  number: any;
  usr: any;
  user: any;
  creation_type: any;
  userLogs: logs = new logs();
  serverForm!: FormGroup;
  submittedd: boolean = false;
  selectedOption: any = '';
  userPermission: any;
  usrPer: any;

  constructor(
    private fb: FormBuilder,
    private ServersSercie: ServerService,
    private instanceService: InstanceService,
    private router: Router,
    private userslogsService: UserslogsService,
    private CloudProvidersAccountsService: CloudProvidersAccountsService,
    private InventoryTemplatesService: InventoryTemplatesService,
    private AccessCredentialsService: AccessCredentialsService
  ) {
    this.serverForm = this.fb.group({
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
      password: [''],
      port: [''],
    });
  }
  status = [
    { name: 'active', value: 1 },
    { name: 'in progress', value: 2 },
    { name: 'innactive', value: 3 },
  ];
  operqtingsystem = [
    { name: 'windows', value: 1 },
    { name: 'mac Os', value: 2 },
    { name: 'fire Os', value: 2 },
  ];
  os_version = [
    { name: 'windows7', value: 1 },
    { name: 'mac Os2', value: 2 },
    { name: 'fire Os1', value: 2 },
  ];
  environment = [
    { name: 'Dos', value: 1 },
    { name: 'Unix', value: 2 },
  ];
  classe = [
    { name: 'windows', value: 1 },
    { name: 'mac Os', value: 2 },
    { name: 'fire Os', value: 2 },
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

  ngAfterViewInit() {
    setP();
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
      let clickedElementS = event?.target?.closest('.btnDelSrv');
      if (clickedElementS) {
        _this.deleteServer(clickedElementS.dataset.id);
      }
    });

    this.getTemplatesList();
    this.getCloudProvidersAccounts();
    this.getAllServers();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get form() {
    return this.serverForm.controls;
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

  cpuChangee(value: any) {
    this.value = value;
  }
  changecheckk(event: Event) {
    this.selectedOption = (event.target as HTMLTextAreaElement).value;
  }
  close() {
    this.serverForm.reset();
    document.querySelector('.addserver')?.classList.add('d-none');
  }
  getDiff() {
    let new_object: any = '';
    this.ServersSercie.getAllServers().subscribe(
      (result) => {
        this.responsee = result;
        this.serversList1 = this.responsee.data;
        for (let key in this.serversList1) {
          if (
            JSON.stringify(this.serversList1[key]) ===
            JSON.stringify(this.serversList[key])
          ) {
            continue;
          } else {
            new_object = this.serversList1[key];
          }

          if (new_object.instance?.status === 1) {
            new_object.instance.status =
              '<span class="badge rounded-pill badge-soft-success font-size-12">Active</span>';
          } else if (new_object.instance?.status === 2) {
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

                        <a class="btn btn-sm btn-soft-danger btnDelSrv" data-id="${new_object?.id}" (click)="deleteServer(server?.id)" type="button" placement="top"
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
                        <a class="btn btn-sm btn-soft-danger btnDelSrv" data-id="${new_object?.id}" (click)="deleteServer(server?.id)" type="button" placement="top"
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
              new_object?.instance?.cloud_provider_account?.provider?.name,
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
  addServer() {
    this.serverForm.patchValue({ creation_type: 1 });
    let dataa = this.serverForm.value;
    dataa.status = 1;
    dataa.favorite = 1;
    dataa.classe = 1;
    dataa.environment = 1;
    dataa.operating_system = 1;
    dataa.os_version = 'Windows 10';
    dataa.environment = 1;
    dataa.account = this.user.account;

    const formatedTimestamp = () => {
      const d = new Date();
      const date = d.toISOString().split('T')[0];
      const time = d.toTimeString().split(' ')[0];
      return `${date} ${time}`;
    };
    if (this.serverForm.invalid || this.serverForm.value.length == 0) {
      this.submittedd = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    if (!this.checkIfValidPortnumber(dataa.port)) {
      return;
    }

    document.querySelector('.addserver')?.classList.remove('d-none');

    if (this.selectedOption == 'yes') {
      this.instanceService.saveInstance(dataa).subscribe(
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

          let server = dataa;
          server.instance = instance;
          this.ServersSercie.saveServer(server).subscribe(
            (result1) => {
              let new_server = result1.data;
              this.CreateLogs(
                'Create',
                formatedTimestamp(),
                20,
                new_server.id,
                this.user,
                7
              );
              let access_cred = dataa;
              access_cred.element = 1;
              access_cred.element_id = new_server.id;
              this.AccessCredentialsService.addServerAccessCredentials(
                access_cred
              ).subscribe(
                (result2) => {
                  let new_acc = result2.data;
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
                  document.querySelector('.addserver')?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'Server Added',
                  });
                  this.close();
                  this.closebutton.nativeElement.click();
                  this.getDiff();
                },
                (error) => {
                  document.querySelector('.addserver')?.classList.add('d-none');
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
              document.querySelector('.addserver')?.classList.add('d-none');
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
          document.querySelector('.addserver')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else if (this.selectedOption == 'no') {
      this.instanceService.saveInstance(dataa).subscribe(
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

          let server = dataa;
          server.instance = instance;
          this.ServersSercie.saveServer(server).subscribe(
            (result1) => {
              let new_server = result1.data;
              this.CreateLogs(
                'Create',
                formatedTimestamp(),
                20,
                new_server.id,
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
              document.querySelector('.addserver')?.classList.add('d-none');
              Toast.fire({
                icon: 'success',
                title: 'Server Added',
              });
              this.close();
              this.closebutton.nativeElement.click();
              this.getDiff();
            },
            (error) => {
              document.querySelector('.addserver')?.classList.add('d-none');
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
          document.querySelector('.addserver')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else {
      document.querySelector('.addserver')?.classList.add('d-none');
      Swal.fire({
        title: 'SSH credentials!',
        text: 'Please select an option!',
        icon: 'error',
        confirmButtonColor: '#2f49c7',
      });
    }
  }
  deleteServer(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this server ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.ServerLoad')?.classList.remove('d-none');
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
                      document
                        .querySelector('.ServerLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Server has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                    }
                  } else {
                    document
                      .querySelector('.ServerLoad')
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
                    .querySelector('.ServerLoad')
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
            document.querySelector('.ServerLoad')?.classList.add('d-none');
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

  getAllServers() {
    this.ServersSercie.getAllServers().subscribe(
      (result) => {
        this.response = result;
        if (this.response.status == 200) {
          this.serversList = this.response.data;
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

  getTemplatesList() {
    this.InventoryTemplatesService.getTemplatesList().subscribe(
      (result) => {
        this.response2 = result;
        if (this.response2.status == 200) {
          this.templatesList = this.response2.data;
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
}

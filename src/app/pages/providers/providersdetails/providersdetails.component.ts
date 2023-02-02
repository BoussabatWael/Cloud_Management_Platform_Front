import { InventoryTemplatesService } from './../../../Services/inventory-templates.service';
import { AccessCredentialsService } from 'src/app/Services/access-credentials.service';
import { ApplicationService } from './../../../Services/application.service';
import { DomaineNameService } from './../../../Services/domaine-name.service';
import { ServerService } from 'src/app/Services/server.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { InstanceService } from 'src/app/Services/instance.service';
import { ProvidersService } from 'src/app/Services/providers.service';
import Swal from 'sweetalert2';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import { CloudProvidersAccountsService } from 'src/app/Services/cloud-providers-accounts.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-providersdetails',
  templateUrl: './providersdetails.component.html',
  styleUrls: ['./providersdetails.component.css'],
})
export class ProvidersdetailsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  valuee: any;
  value1: any;
  selectedOptionn: any = '';
  id: any;
  domain: any;
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
  templatesList: any;
  userLogsList: any;
  userLogsList1: any;
  instancesNumber: any;
  instancesList: any;
  instancesList1: any;
  serversList: any;
  domainNamesList: any;
  applicationsList: any;
  cloudProvidersAccountsList: any;
  provider: any;
  submitted: boolean = false;
  submitted1: boolean = false;
  submitted2: boolean = false;
  usr: any;
  user: any;
  userPermission: any;
  usrPer: any;
  userLogs: logs = new logs();
  public providerForm!: FormGroup;
  public instanceForm!: FormGroup;
  public domainForm!: FormGroup;
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
    private providersService: ProvidersService,
    private inventoryInstancesService: InstanceService,
    private route: ActivatedRoute,
    private router: Router,
    private userslogsService: UserslogsService,
    private ServersSercie: ServerService,
    private domainNamesService: DomaineNameService,
    private applicationsService: ApplicationService,
    private CloudProvidersAccountsService: CloudProvidersAccountsService,
    private AccessCredentialsService: AccessCredentialsService,
    private InventoryTemplatesService: InventoryTemplatesService,
    public datepipe: DatePipe
  ) {
    this.providerForm = this.fb.group({
      name: ['', Validators.required],
      logo: [''],
      status: [''],
      website: ['', Validators.required],
    });

    this.instanceForm = this.fb.group({
      creation_type: [''],
      ssh: [''],
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
      category: this.fb.group({
        id: [''],
      }),
      login: [''],
      password: ['', Validators.required],
      port: [''],
    });

    this.domainForm = this.fb.group({
      name: ['', Validators.required],
      cloud_provider_account: this.fb.group({
        id: ['', Validators.required],
      }),
      renew_date: [''],
      creation_type: [''],
    });
  }
  status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 2 },
    { name: 'In Progress', value: 3 },
  ];
  module = [
    { name: 'active', value: 1 },
    { name: 'in progress', value: 2 },
    { name: 'innactive', value: 3 },
  ];
  categories = [
    { value: 1, name: 'cat1' },
    { value: 2, name: 'cat2' },
    { value: 3, name: 'cat3' },
  ];
  location = [
    { name: 'France', value: 1 },
    { name: 'Brazil', value: 2 },
    { name: 'Germany', value: 3 },
  ];

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
      pageLength: 5,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    this.id = this.route.snapshot.paramMap.get('id');

    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElement = event?.target?.closest('.btnDelInsProv');
      if (clickedElement) {
        _this.deleteInstance(clickedElement.dataset.id);
      }
    });

    this.getAllApplications();
    this.getCloudProvidersAccounts();
    this.getTemplatesList();
    this.getAllDomainNames();
    this.getAllServers();
    this.getUserLogs();
    this.getProviderByID();
    this.getInstancesNumber();
  }
  get providerform() {
    return this.providerForm.controls;
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

  get form() {
    return this.instanceForm.controls;
  }
  get domainform() {
    return this.domainForm.controls;
  }
  close() {
    this.instanceForm.reset();
    this.domainForm.reset();
    document.querySelector('.addser')?.classList.add('d-none');
    document.querySelector('.adddom')?.classList.add('d-none');
  }

  addDomain() {
    this.domain = this.domainForm.value;
    this.domain.account = this.user.account;
    this.domain.status = 1;
    this.domain.favorite = 1;
    this.domain.creation_type = 2;
    this.domain.renew_date = this.datepipe.transform(
      this.domainForm.value.renew_date,
      'yyyy-MM-dd HH:mm:ss'
    );

    const formatedTimestamp = () => {
      const d = new Date();
      const date = d.toISOString().split('T')[0];
      const time = d.toTimeString().split(' ')[0];
      return `${date} ${time}`;
    };

    if (this.domainForm.invalid || this.domainForm.value.length == 0) {
      this.submitted2 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.adddom')?.classList.remove('d-none');
    this.inventoryInstancesService.saveInstance(this.domain).subscribe(
      (result) => {
        let instance = result.data;

        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          3,
          instance.id,
          this.user,
          5
        );

        this.domainNamesService.saveDomainNames(this.domain).subscribe(
          (result) => {
            let new_domain = result.data;

            this.CreateLogs(
              'Create',
              formatedTimestamp(),
              8,
              new_domain?.id,
              this.user,
              5
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
            document.querySelector('.adddom')?.classList.add('d-none');

            Toast.fire({
              icon: 'success',
              title: 'Instance Added',
            });
            this.instancesNumber = this.instancesNumber + 1;
            this.close();
            this.closebutton.nativeElement.click();
            this.getDiff();
            this.getDiffInstance();
          },
          (error) => {
            document.querySelector('.adddom')?.classList.add('d-none');
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
        document.querySelector('.adddom')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  getDiffInstance() {
    let new_object: any = '';
    this.inventoryInstancesService
      .getInventoryInstancesNumber(this.id)
      .subscribe(
        (result) => {
          this.response9 = result;
          this.instancesList1 = this.response9.data;
          for (let key in this.instancesList1) {
            if (
              JSON.stringify(this.instancesList1[key]) ===
              JSON.stringify(this.instancesList[key])
            ) {
              continue;
            } else {
              new_object = this.instancesList1[key];
            }
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

          if (new_object?.creation_type === 1) {
            new_object.creation_type = 'Server';
          } else if (new_object?.creation_type === 2) {
            new_object.creation_type = 'Domain name';
          } else {
            new_object.creation_type = 'Application';
          }
          if(this.usrPer.servers.includes('delete') == true && this.usrPer.domains.includes('delete') == true){
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelInsProv" data-id="${new_object?.id}"  type="button" placement="top" ngbTooltip="Delete" (click)="deleteInstance(ins?.id)">
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          }else{
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              ---
                            </div>`;
          }


          $('#table_p_ins')
            .DataTable()
            .row.add([
              new_object?.id,
              new_object?.name,
              new_object?.creation_type,
              new_object?.status,
              new_object?.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_p_ins').DataTable().row(':last').node().id =
            'p-ins-' + new_object.id;
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
    this.instanceForm.patchValue({ creation_type: 1 });
    let data = this.instanceForm.value;
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
    if (!this.checkIfValidPortnumber(data.port)) {
      return;
    }
    document.querySelector('.addser')?.classList.remove('d-none');
    this.inventoryInstancesService.saveInstance(data).subscribe(
      (result) => {
        let instance = result.data;

        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          3,
          instance.id,
          this.user,
          5
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
              5
            );

            if (this.selectedOptionn == 'yes') {
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
                    5
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
                  document.querySelector('.addser')?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'Instance Added',
                  });
                  this.instancesNumber = this.instancesNumber + 1;
                  this.close();
                  this.closebutton.nativeElement.click();
                  this.getDiff();
                  this.getDiffInstance();
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
              document.querySelector('.addser')?.classList.add('d-none');

              Toast.fire({
                icon: 'success',
                title: 'Instance Added',
              });
              this.instancesNumber = this.instancesNumber + 1;
              this.close();
              this.closebutton.nativeElement.click();
              this.getDiff();
              this.getDiffInstance();
            }
          },
          (error) => {
            document.querySelector('.addser')?.classList.add('d-none');
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
        document.querySelector('.addins')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  updateProvider(id: any) {
    let data = this.providerForm.value;
    if (this.providerForm.invalid || this.providerForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.updateProviderLoad')?.classList.remove('d-none');
    this.providersService.updateProvider(data, id).subscribe(
      (result) => {
        if (result.status == 200 && result.message == 'Nothing was changed!') {
          document
            .querySelector('.updateProviderLoad')
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

          this.CreateLogs('Edit', formatedTimestamp(), 7, id, this.user, 5);
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
            .querySelector('.updateProviderLoad')
            ?.classList.add('d-none');
          Toast.fire({
            icon: 'success',
            title: 'Provider updated',
          });
          this.getDiff();
          this.provider.name = data.name;
          this.provider.website = data.website;
          this.provider.status = data.status;
          this.provider.logo = data.logo;
        } else {
          document
            .querySelector('.updateProviderLoad')
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
        document.querySelector('.updateProviderLoad')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  deleteInstance(id: any) {
    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't to delete this instance ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document
          .querySelector('.updateProviderLoad')
          ?.classList.remove('d-none');
        this.inventoryInstancesService.getInventoryInstancesByID(id).subscribe(
          (result) => {
            let p_ins = result.data;
            p_ins.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            p_ins.end_date = formatedTimestamp();
            this.inventoryInstancesService
              .updateInventoryInstance(p_ins, id)
              .subscribe(
                (result) => {
                  if (result.status == 200) {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      3,
                      id,
                      this.user,
                      5
                    );
                    let row = document.getElementById('p-ins-' + id);
                    if (row != null) {
                      $('#table_p_ins').DataTable().row(row).remove();
                      $('#table_p_ins').DataTable().draw();
                      this.instancesList = this.instancesList.filter(
                        (pi: { id: any }) => pi.id !== id
                      );
                      this.instancesNumber = this.instancesNumber - 1;
                      document
                        .querySelector('.updateProviderLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Instance has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                      this.getDiff();
                    }
                  } else {
                    document
                      .querySelector('.updateProviderLoad')
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
                    .querySelector('.updateProviderLoad')
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
            document
              .querySelector('.updateProviderLoad')
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
    });
  }
  changecheck(event: Event) {
    this.selectedOptionn = (event.target as HTMLTextAreaElement).value;
  }
  Change(valuee: any) {
    this.valuee = valuee;
  }
  Change1(value1: any) {
    if (value1 !== this.value1) {
      this.value1 = value1;
      setTimeout(() => {
        (<any>$('#formapplicationinstance')).steps({
          headerTag: 'h3',
          bodyTag: 'section',
          transitionEffect: 'slide',
          onFinished: function (event: any, currentIndex: any) {
            $('.sub-btn').trigger('click');
          },
        });
      }, 20);
    }
  }

  getProviderByID() {
    this.providersService.getProviderbyID(this.id).subscribe(
      (result) => {
        this.response = result;
        this.provider = this.response.data;
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
  getDiff() {
    let new_object: any = '';
    this.userslogsService.getProviderLogsList(this.id).subscribe(
      (result) => {
        this.response3 = result;
        this.userLogsList1 = this.response3.data.map((elem: any) => {
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
        $('#table_provider_logs')
          .DataTable()
          .row.add([
            new_object?.id,
            new_object?.action,
            new_object?.element,
            new_object?.element_id,
            new_object?.log_date,
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
    this.userslogsService.getProviderLogsList(this.id).subscribe(
      (result) => {
        this.response2 = result;
        this.userLogsList = this.response2.data.map((elem: any) => {
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

  getInstancesNumber() {
    this.inventoryInstancesService
      .getInventoryInstancesNumber(this.id)
      .subscribe(
        (result) => {
          this.response1 = result;
          this.instancesList = this.response1.data;
          this.instancesNumber = this.response1.total;
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
    this.ServersSercie.getAllServers().subscribe(
      (result) => {
        this.response4 = result;
        if (this.response4.status == 200) {
          this.serversList = this.response4.data;
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

  getAllDomainNames() {
    this.domainNamesService.getAllDomainNames().subscribe(
      (result) => {
        this.response5 = result;
        if (this.response5.status == 200) {
          this.domainNamesList = this.response5.data;
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

  getAllApplications() {
    this.applicationsService.getApplicationList().subscribe(
      (result) => {
        this.response6 = result;
        this.applicationsList = this.response6.data;
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
    this.CloudProvidersAccountsService.getCloudProvidersAccountsByProviderID(
      this.id
    ).subscribe(
      (result) => {
        this.response7 = result;
        if (this.response7.status == 200) {
          this.cloudProvidersAccountsList = this.response7.data;
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
        this.response8 = result;
        if (this.response8.status == 200) {
          this.templatesList = this.response8.data;
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

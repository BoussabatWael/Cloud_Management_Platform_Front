import { CloudProvidersAccountsService } from './../../../Services/cloud-providers-accounts.service';
import { InventoryHostsService } from './../../../Services/inventory-hosts.service';
import { ServerService } from './../../../Services/server.service';
import { NetworkSslCertificatesService } from './../../../Services/network-ssl-certificates.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomaineNameService } from './../../../Services/domaine-name.service';
import { Component, OnInit, ViewChild } from '@angular/core';
declare function setP(): any;
import Swal from 'sweetalert2';
import { NetworkHostsService } from 'src/app/Services/network-hosts.service';
import { Subject } from 'rxjs';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
import { UserslogsService } from 'src/app/Services/userslogs.service';
@Component({
  selector: 'app-detaildomaine-names',
  templateUrl: './detaildomaine-names.component.html',
  styleUrls: ['./detaildomaine-names.component.css'],
})
export class DetaildomaineNamesComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebuttonssl') closebuttonssl: any;
  @ViewChild('closebuttonsubdomain') closebuttonsubdomain: any;
  id: any;
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
  response10: any;
  response11: any;
  response12: any;
  serversList: any;
  hostsList: any;
  cloudProvidersAccountsList: any;
  userLogsList: any;
  userLogsList1: any;
  public domainNameForm!: FormGroup;
  public hostForm!: FormGroup;
  public sslForm!: FormGroup;
  public subDomainForm!: FormGroup;
  domainName: any;
  domainName1: any;
  networkHosts: any;
  networkHosts1: any;
  networkSSLCertificates: any;
  networkSSLCertificates1: any;
  subDomainsList: any;
  subDomainsList1: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usr: any;
  user: any;
  account: any;
  userLogs: logs = new logs();
  submitted = false;
  submitted1 = false;
  submitted2 = false;
  submitted3 = false;
  userPermission: any;
  usrPer: any;
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
    private domainNamesService: DomaineNameService,
    private route: ActivatedRoute,
    private networkHostsService: NetworkHostsService,
    private networkSSLCertificatesService: NetworkSslCertificatesService,
    private router: Router,
    private userslogsService: UserslogsService,
    private ServersSercie: ServerService,
    private InventoryHostsService: InventoryHostsService,
    private CloudProvidersAccountsService: CloudProvidersAccountsService
  ) {
    this.domainNameForm = this.fb.group({
      id: [''],
      end_date: [''],
      start_date: [''],
      renew_date: [''],
      parent_id: [''],
      name: ['', Validators.required],
      status: ['', Validators.required],
      account: this.fb.group({
        id: [''],
      }),
      cloud_provider_account: this.fb.group({
        id: [''],
      }),
    });

    this.hostForm = this.fb.group({
      name: ['', Validators.required],
      parent_id: [''],
      status: [''],
      instance: this.fb.group({
        id: ['', Validators.required],
      }),
      cloud_provider_account: this.fb.group({
        id: ['', Validators.required],
      }),
      domain: this.fb.group({
        id: [''],
      }),
      hosting: this.fb.group({
        id: ['', Validators.required],
      }),
    });

    this.sslForm = this.fb.group({
      name: ['', Validators.required],
      status: [''],
      cloud_provider_id: ['',Validators.required],
      domain: this.fb.group({
        id: [''],
      }),
    });

    this.subDomainForm = this.fb.group({
      name: ['', Validators.required],
      status: [''],
      cloud_provider_account: this.fb.group({
        id: ['', Validators.required],
      }),
      domain: this.fb.group({
        id: [''],
      }),
    });
  }
  status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 2 },
    { name: 'In Progress', value: 3 },
  ];
  website = [
    { name: 'wwww.exemple.com', value: 3 },
    { name: 'wwww.exemple1.com ', value: 1 },
    { name: 'wwww.exemple2.com', value: 2 },
  ];
  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    }

    this.usr = localStorage.getItem('user');
    this.user = JSON.parse(this.usr);
    this.account = this.user['account'];

    this.userPermission = localStorage.getItem('permissions');
    this.usrPer = JSON.parse(this.userPermission);

    this.dtOptions = {
      lengthMenu: [5, 10, 20, 50, 100],
      pageLength: 5,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElement = event?.target?.closest('.btnDelHost');
      // @ts-ignore
      let clickedElement1 = event?.target?.closest('.btnDelSSL');
      // @ts-ignore
      let clickedElement2 = event?.target?.closest('.btnDelSub');

      if (clickedElement) {
        _this.deleteHost(clickedElement.dataset.id);
      }
      if (clickedElement1) {
        _this.deleteSslCertificate(clickedElement1.dataset.id);
      }
      if (clickedElement2) {
        _this.deleteSubDomain(clickedElement2.dataset.id);
      }
    });

    this.id = this.route.snapshot.paramMap.get('id');
    this.domainNamesService.getDomainNamesById(this.id).subscribe(
      (result) => {
        this.response = result;
        this.domainName = this.response.data;
        this.domainNamesService
          .getSubDomainNamesList(this.domainName.id)
          .subscribe(
            (result) => {
              this.response3 = result;
              this.subDomainsList = this.response3.data;
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

    this.getAllServers();
    this.getCloudProvidersAccounts();
    this.getUserLogs();
    this.getDomainNetworkHostsList();
    this.getNetworkSSLCertificatesList();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get form() {
    return this.domainNameForm.controls;
  }
  get hostform() {
    return this.hostForm.controls;
  }
  get sslform() {
    return this.sslForm.controls;
  }
  get subdomainform() {
    return this.subDomainForm.controls;
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

  close() {
    this.hostForm.reset();
    this.subDomainForm.reset();
    this.sslForm.reset();
    document.querySelector('.addhost')?.classList.add('d-none');
    document.querySelector('.addssl')?.classList.add('d-none');
    document.querySelector('.addsub')?.classList.add('d-none');
  }

  getDiffHost() {
    let new_object: any = '';
    this.networkHostsService.getDomainNetworksHostsList(this.id).subscribe(
      (result) => {
        this.response9 = result;
        this.networkHosts1 = this.response9.data;
        for (let key in this.networkHosts1) {
          if (
            JSON.stringify(this.networkHosts1[key]) ===
            JSON.stringify(this.networkHosts[key])
          ) {
            continue;
          } else {
            new_object = this.networkHosts1[key];
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

        if (this.usrPer.hosts.includes('delete') == true) {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a *ngIf="this.usrPer.hosts.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDelHost" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}"  (click)="deleteHost(host?.id)">
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
        } else {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            ---
                            </div>`;
        }

        $('#table_h')
          .DataTable()
          .row.add([
            new_object.id,
            new_object.hosting.name,
            new_object.cloud_provider_account.provider.name,
            new_object.instance.name,
            new_object.status,
            new_object.actions,
          ])
          .draw();
        //@ts-ignore
        $('#table_h').DataTable().row(':last').node().id = 'h-' + new_object.id;
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

  getDiffSubDomain() {
    let new_object: any = '';
    this.domainNamesService.getDomainNamesById(this.id).subscribe(
      (result) => {
        this.response11 = result;
        this.domainName1 = this.response11.data;
        this.domainNamesService.getSubDomainNamesList(this.id).subscribe(
          (result) => {
            this.response12 = result;
            this.subDomainsList1 = this.response12.data;

            for (let key in this.subDomainsList1) {
              if (
                JSON.stringify(this.subDomainsList1[key]) ===
                JSON.stringify(this.subDomainsList[key])
              ) {
                continue;
              } else {
                new_object = this.subDomainsList1[key];
              }
            }

            if (this.usrPer.domains.includes('delete') == true) {
              new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a *ngIf="this.usrPer.domains.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDelSub" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteSubDomain(subdomain?.id)">
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
            } else {
              new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            ---
                            </div>`;
            }

            $('#table_s_d')
              .DataTable()
              .row.add([
                new_object.id,
                new_object.name,
                new_object.cloud_provider_account?.provider?.name,
                new_object.actions,
              ])
              .draw();
            //@ts-ignore
            $('#table_s_d').DataTable().row(':last').node().id =
              's-d-' + new_object.id;
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

  getDiffSSL() {
    let new_object: any = '';
    this.networkSSLCertificatesService
      .getDomainSSLCertificatesList(this.id)
      .subscribe(
        (result) => {
          this.response10 = result;
          this.networkSSLCertificates1 = this.response10.data;
          for (let key in this.networkSSLCertificates1) {
            if (
              JSON.stringify(this.networkSSLCertificates1[key]) ===
              JSON.stringify(this.networkSSLCertificates[key])
            ) {
              continue;
            } else {
              new_object = this.networkSSLCertificates1[key];
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

          if (this.usrPer.ssl.includes('delete') == true) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a *ngIf="this.usrPer.ssl.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDelSSL" type="button" placement="top"
                                ngbTooltip="Delete" data-id="${new_object?.id}" (click)="deleteSslCertificate(ssl?.id)">
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                             ---
                            </div>`;
          }

          $('#table_net_ssl')
            .DataTable()
            .row.add([
              new_object.id,
              new_object.name,
              new_object.status,
              new_object.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_net_ssl').DataTable().row(':last').node().id =
            'net-ssl-' + new_object.id;
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

  addSubDomain() {
    let data = this.subDomainForm.value;
    data.status = 1;
    data.parent_id = this.id;
    data.account = this.user.account;

    if (this.subDomainForm.invalid || this.subDomainForm.value.length == 0) {
      this.submitted3 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addsub')?.classList.remove('d-none');
    this.domainNamesService.saveDomainNames(data).subscribe(
      (result) => {
        let new_sub = result.data;

        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          10,
          new_sub?.id,
          this.user,
          10
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
        document.querySelector('.addsub')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Sub-domain Added',
        });
        this.closebuttonsubdomain.nativeElement.click();
        this.close();
        this.getDiffSubDomain();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.addsub')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  addSSL() {
    let data = this.sslForm.value;
    data.status = 1;
    data.domain = this.domainName;

    if (this.sslForm.invalid || this.sslForm.value.length == 0) {
      this.submitted2 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addssl')?.classList.remove('d-none');
    this.networkSSLCertificatesService.saveSSLCertificates(data).subscribe(
      (result) => {
        let new_ssl = result.data;

        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          11,
          new_ssl?.id,
          this.user,
          10
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
        document.querySelector('.addssl')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'SSL Added',
        });
        this.close();
        this.closebuttonssl.nativeElement.click();
        this.getDiffSSL();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.addssl')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  addHost() {
    let data = this.hostForm.value;
    data.status = 1;
    data.domain = this.domainName;

    if (this.hostForm.invalid || this.hostForm.value.length == 0) {
      this.submitted1 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addhost')?.classList.remove('d-none');
    this.networkHostsService.saveNetworkHosts(data).subscribe(
      (result) => {
        let new_host = result.data;
        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          9,
          new_host?.id,
          this.user,
          10
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
        document.querySelector('.addhost')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Host Added',
        });
        this.close();
        this.closebutton.nativeElement.click();
        this.getDiffHost();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.addhost')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }

  updateDomainName(id: any) {
    let data = this.domainNameForm.value;
    data.parent_id = this.domainName.parent_id;
    if (this.domainNameForm.invalid || this.domainNameForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.updateDomainLoad')?.classList.remove('d-none');
    this.domainNamesService.updateDomainNames(data, id).subscribe(
      (result) => {
        if (result.status == 200 && result.message == 'Nothing was changed!') {
          document.querySelector('.updateDomainLoad')?.classList.add('d-none');
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
          this.CreateLogs('Edit', formatedTimestamp(), 8, id, this.user, 10);
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
          document.querySelector('.updateDomainLoad')?.classList.add('d-none');
          Toast.fire({
            icon: 'success',
            title: 'Domain updated',
          });
          this.getDiff();
          this.domainName.name = data.name;
          this.domainName.status = data.status;
        } else {
          document.querySelector('.updateDomainLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      },
      (error) => {
        document.querySelector('.updateDomainLoad')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }

  deleteHost(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this host ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateDomainLoad')?.classList.remove('d-none');
        this.networkHostsService.getNetworksHostsByID(id).subscribe(
          (result) => {
            let host = result.data;
            host.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            host.end_date = formatedTimestamp();
            this.networkHostsService.updateNetworksHosts(host, id).subscribe(
              (result) => {
                if (result.status == 200) {
                  this.CreateLogs(
                    'Delete',
                    formatedTimestamp(),
                    9,
                    id,
                    this.user,
                    10
                  );

                  let row = document.getElementById('h-' + id);
                  if (row != null) {
                    $('#table_h').DataTable().row(row).remove();
                    $('#table_h').DataTable().draw();
                    this.networkHosts = this.networkHosts.filter(
                      (h: { id: any }) => h.id !== id
                    );
                    document
                      .querySelector('.updateDomainLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Host has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                    this.getDiff();
                  }
                } else {
                  document
                    .querySelector('.updateDomainLoad')
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
                  .querySelector('.updateDomainLoad')
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
              .querySelector('.updateDomainLoad')
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

  deleteSubDomain(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this Sub Domain ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateDomainLoad')?.classList.remove('d-none');
        this.domainNamesService.getDomainNamesById(id).subscribe(
          (result) => {
            let domain = result.data;
            domain.parent_id = 0;

            this.domainNamesService.updateDomainNames(domain, id).subscribe(
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
                    10,
                    id,
                    this.user,
                    10
                  );

                  let row = document.getElementById('s-d-' + id);
                  if (row != null) {
                    $('#table_s_d').DataTable().row(row).remove();
                    $('#table_s_d').DataTable().draw();
                    this.subDomainsList = this.subDomainsList.filter(
                      (sd: { id: any }) => sd.id !== id
                    );
                    document
                      .querySelector('.updateDomainLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Sub-domain has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                    this.getDiff();
                  }
                } else {
                  document
                    .querySelector('.updateDomainLoad')
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
                  .querySelector('.updateDomainLoad')
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
              .querySelector('.updateDomainLoad')
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

  deleteSslCertificate(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this SSL Certificate ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateDomainLoad')?.classList.remove('d-none');
        this.networkSSLCertificatesService.getSSLCertificatesByID(id).subscribe(
          (result) => {
            let ssl_certif = result.data;
            ssl_certif.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            ssl_certif.end_date = formatedTimestamp();
            this.networkSSLCertificatesService
              .updateSSLCertificates(ssl_certif, id)
              .subscribe(
                (result) => {
                  if (result.status == 200) {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      11,
                      id,
                      this.user,
                      10
                    );

                    let row = document.getElementById('net-ssl-' + id);
                    if (row != null) {
                      $('#table_net_ssl').DataTable().row(row).remove();
                      $('#table_net_ssl').DataTable().draw();
                      this.networkSSLCertificates =
                        this.networkSSLCertificates.filter(
                          (ss: { id: any }) => ss.id !== id
                        );
                      document
                        .querySelector('.updateDomainLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'SSL Certificate has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                      this.getDiff();
                    }
                  } else {
                    document
                      .querySelector('.updateDomainLoad')
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
                    .querySelector('.updateDomainLoad')
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
              .querySelector('.updateDomainLoad')
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

  getDomainNetworkHostsList() {
    this.networkHostsService.getDomainNetworksHostsList(this.id).subscribe(
      (result) => {
        this.response1 = result;
        this.networkHosts = this.response1.data;
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
    this.userslogsService.getDomainLogsList(this.id).subscribe(
      (result) => {
        this.response5 = result;
        this.userLogsList1 = this.response5.data.map((elem: any) => {
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
        $('#table_domain_logs')
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
    this.userslogsService.getDomainLogsList(this.id).subscribe(
      (result) => {
        this.response4 = result;
        this.userLogsList = this.response4.data.map((elem: any) => {
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

  getNetworkSSLCertificatesList() {
    this.networkSSLCertificatesService
      .getDomainSSLCertificatesList(this.id)
      .subscribe(
        (result) => {
          this.response2 = result;
          this.networkSSLCertificates = this.response2.data;
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
        this.response6 = result;
        if (this.response6.status == 200) {
          this.serversList = this.response6.data;
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

  getAllInventoryHosts() {
    this.networkHostsService.getDomainNetworksHostsList(this.id).subscribe(
      (result) => {
        let res: any;
        res = result;
        let networkHost = res.data;
        this.InventoryHostsService.getInventoryHostsList().subscribe(
          (result) => {
            let res1: any;
            res1 = result;
            if (res1.status == 200) {
              if (networkHost.length !== 0) {
                for (let i = 0; i < networkHost.length; i++) {
                  res1.data = res1.data.filter(
                    (host: { id: any }) =>
                      host?.id !== networkHost[i].hosting.id
                  );
                  this.hostsList = res1.data;
                }
              } else {
                this.hostsList = res1.data;
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

  getCloudProvidersAccounts() {
    this.CloudProvidersAccountsService.getCloudProvidersAccountsList().subscribe(
      (result) => {
        this.response8 = result;
        if (this.response8.status == 200) {
          this.cloudProvidersAccountsList = this.response8.data;
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
}

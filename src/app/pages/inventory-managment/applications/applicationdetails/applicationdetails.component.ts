import { ApplicationInstancesService } from './../../../../Services/application-instances.service';
import { ServerService } from 'src/app/Services/server.service';
import { ApplicationSourcesService } from './../../../../Services/application-sources.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationDependenciesService } from 'src/app/Services/application-dependencies.service';
import { ApplicationVersionsService } from 'src/app/Services/application-versions.service';

import { ApplicationService } from 'src/app/Services/application.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';

@Component({
  selector: 'app-applicationdetails',
  templateUrl: './applicationdetails.component.html',
  styleUrls: ['./applicationdetails.component.css'],
})
export class ApplicationdetailsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebuttonS') closebuttonS: any;
  @ViewChild('closebuttonDep') closebuttonDep: any;
  @ViewChild('closebuttonDepl') closebuttonDepl: any;
  id: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
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
  applicationDependencies: any;
  applicationDependencies1: any;
  applicationVersions: any;
  applicationVersions1: any;
  applicationSources: any;
  applicationSources1: any;
  applicationDeployment: any;
  applicationDeployment1: any;
  applicationInstancesList: any[] = [];
  applicationInstance: any;
  application: any;
  formapplication!: FormGroup;
  versionForm!: FormGroup;
  sourceForm!: FormGroup;
  dependencyForm!: FormGroup;
  deploymentForm!: FormGroup;
  submitted: boolean = false;
  submitted1: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  submitted4: boolean = false;
  changed: boolean = false;
  activeUser: any;
  usr: any;
  user: any;
  userLogsList: any;
  userLogsList1: any;
  userLogs: logs = new logs();
  userPermission: any;
  usrPer: any;
  value: any;
  classe = [
    { name: 'Website', value: 1 },
    { name: 'Platform', value: 2 },
    { name: 'Tool', value: 3 },
    { name: 'SaaS', value: 4 },
  ];
  Environment = [
    { name: 'Env1', value: 1 },
    { name: 'Env2', value: 2 },
    { name: 'Env3', value: 3 },
  ];

  type = [
    { name: 'SaaS', value: 1 },
    { name: 'Landing page', value: 2 },
    { name: 'CMS', value: 3 },
  ];
  searchText2: any;
  p2: number = 1;
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
    private route: ActivatedRoute,
    private applicationservice: ApplicationService,
    private router: Router,
    private ServersSercie: ServerService,
    private applicationDependenciesService: ApplicationDependenciesService,
    private applicationVersionsService: ApplicationVersionsService,
    private applicationSourcesService: ApplicationSourcesService,
    private applicationInstancesService: ApplicationInstancesService,
    private userslogsService: UserslogsService
  ) {
    this.formapplication = this.fb.group({
      id: [''],
      classe: ['', Validators.required],
      end_date: [''],
      environment: [''],
      logo: [''],
      name: ['', Validators.required],
      start_date: [''],
      status: ['', Validators.required],
      account: this.fb.group({
        id: [''],
      }),
    });

    this.versionForm = this.fb.group({
      version: ['', Validators.required],
      status: [''],
      application: this.fb.group({
        id: [''],
      }),
    });

    this.sourceForm = this.fb.group({
      source_type: ['', Validators.required],
      classe: [''],
      repo: [''],
      source_build: [''],
      run_command: [''],
      source_account: [''],
      source_url: [''],
      application: this.fb.group({
        id: [''],
      }),
    });

    this.dependencyForm = this.fb.group({
      element: ['', Validators.required],
      element_value: ['', Validators.required],
      version_id: ['', Validators.required],
      application: this.fb.group({
        id: [''],
      }),
    });

    this.deploymentForm = this.fb.group({
      instance: this.fb.group({
        id: ['', Validators.required],
      }),
      application: this.fb.group({
        id: [''],
      }),
    });
  }
  status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 2 },
    { name: 'In Progress', value: 3 },
  ];
  options = [
    { name: 'Active', value: 1 },
    { name: 'InProgress', value: 2 },
    { name: 'Inactive', value: 3 },
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
      let clickedElement = event?.target?.closest('.btnDeleteDepen');
      // @ts-ignore
      let clickedElement1 = event?.target?.closest('.btnDeleteDeploy');
      // @ts-ignore
      let clickedElement2 = event?.target?.closest('.btnDeleteVer');
      // @ts-ignore
      let clickedElement3 = event?.target?.closest('.btnDeleteSrc');

      if (clickedElement) {
        _this.deleteApplicationDependencies(clickedElement.dataset.id);
      }
      if (clickedElement1) {
        _this.deleteApplicationDeployment(clickedElement1.dataset.id);
      }
      if (clickedElement2) {
        _this.deleteApplicationVersion(clickedElement2.dataset.id);
      }
      if (clickedElement3) {
        _this.deleteApplicationSource(clickedElement3.dataset.id);
      }
    });

    this.getUserLogs();
    this.getApplicationByID();
    this.getApplicationDependenciesList();
    this.getApplicationDeploymentList();
    this.getApplicationVersionsList();
    this.getApplicationSourcesList();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get form() {
    return this.formapplication.controls;
  }

  get versionform() {
    return this.versionForm.controls;
  }

  get sourceform() {
    return this.sourceForm.controls;
  }
  get depform() {
    return this.dependencyForm.controls;
  }
  get deplform() {
    return this.deploymentForm.controls;
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

  cpuChange(value: any) {
    this.value = value;
  }
  close() {
    this.versionForm.reset();
    this.sourceForm.reset();
    this.dependencyForm.reset();
    this.deploymentForm.reset();
    document.querySelector('.addappdep')?.classList.add('d-none');
    document.querySelector('.addappdepl')?.classList.add('d-none');
    document.querySelector('.addappver')?.classList.add('d-none');
    document.querySelector('.addappsrc')?.classList.add('d-none');
  }

  addDeployment() {
    let data = this.deploymentForm.value;
    data.application = this.application;
    data.status = 1;
    if (this.deploymentForm.invalid || this.deploymentForm.value.length == 0) {
      this.submitted4 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addappdepl')?.classList.remove('d-none');
    this.applicationInstancesService.saveApplicationInstance(data).subscribe(
      (result) => {
        let new_app_ins = result.data;
        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          14,
          new_app_ins?.id,
          this.user,
          12
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
        document.querySelector('.addappdepl')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Deployment Added',
        });
        this.close();
        this.closebuttonDepl.nativeElement.click();
        this.getDiffAppDeployment();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.addappdepl')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  addDependency() {
    let data = this.dependencyForm.value;
    data.application = this.application;
    data.status = 1;
    if (this.dependencyForm.invalid || this.dependencyForm.value.length == 0) {
      this.submitted3 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addappdep')?.classList.remove('d-none');

    this.applicationDependenciesService
      .addApplicationDependencies(data)
      .subscribe(
        (result) => {
          let new_app_dep = result.data;
          const formatedTimestamp = () => {
            const d = new Date();
            const date = d.toISOString().split('T')[0];
            const time = d.toTimeString().split(' ')[0];
            return `${date} ${time}`;
          };
          this.CreateLogs(
            'Create',
            formatedTimestamp(),
            13,
            new_app_dep?.id,
            this.user,
            12
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
          document.querySelector('.addappdep')?.classList.add('d-none');
          Toast.fire({
            icon: 'success',
            title: 'Dependency Added',
          });
          this.close();
          this.closebuttonDep.nativeElement.click();
          this.getDiffAppDependency();
          this.getDiff();
        },
        (error) => {
          document.querySelector('.addappdep')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
  }
  addSource() {
    let data = this.sourceForm.value;
    data.application = this.application;
    data.status = 1;
    data.classe = 1;
    if (this.sourceForm.invalid || this.sourceForm.value.length == 0) {
      this.submitted2 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addappsrc')?.classList.remove('d-none');

    this.applicationSourcesService.addApplicationSources(data).subscribe(
      (result) => {
        let new_app_src = result.data;
        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          15,
          new_app_src?.id,
          this.user,
          12
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
        document.querySelector('.addappsrc')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Source Added',
        });
        this.close();
        this.closebuttonS.nativeElement.click();
        this.getDiffAppSource();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.addappsrc')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }

  getDiffAppDeployment() {
    let new_object: any = '';
    this.applicationInstancesService
      .getApplicationInstanceByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response12 = result;
          this.applicationDeployment1 = this.response12.data;
          for (let key in this.applicationDeployment1) {
            if (
              JSON.stringify(this.applicationDeployment1[key]) ===
              JSON.stringify(this.applicationDeployment[key])
            ) {
              continue;
            } else {
              new_object = this.applicationDeployment1[key];
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

          if (this.usrPer.applications.includes('delete') == true) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            <a *ngIf="this.usrPer.applications.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDeleteDeploy" data-id="${new_object?.id}" (click)="deleteApplicationDeployment(dep?.instance?.id)"
                              type="button" placement="top" ngbTooltip="Delete">
                              <i class="mdi mdi-delete font-size-16"></i>
                            </a>
                          </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                           ---
                          </div>`;
          }

          $('#table_depl')
            .DataTable()
            .row.add([
              new_object?.id,
              new_object?.instance?.name,
              new_object?.instance?.cloud_provider_account?.provider?.name,
              new_object?.status,
              new_object?.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_depl').DataTable().row(':last').node().id =
            'depl-' + new_object?.id;
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
  getDiffAppDependency() {
    let new_object: any = '';
    this.applicationDependenciesService
      .getApplicationDependenciesByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response10 = result;
          this.applicationDependencies1 = this.response10.data;
          for (let key in this.applicationDependencies1) {
            if (
              JSON.stringify(this.applicationDependencies1[key]) ===
              JSON.stringify(this.applicationDependencies[key])
            ) {
              continue;
            } else {
              new_object = this.applicationDependencies1[key];
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

          if (new_object?.classe === 1) {
            new_object.classe = 'Website';
          } else if (new_object?.classe === 2) {
            new_object.classe = 'Platform';
          } else {
            new_object.classe = 'SaaS';
          }

          if (this.usrPer.applications.includes('delete') == true) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            <a *ngIf="this.usrPer.applications.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDeleteDepen" data-id="${new_object?.id}" (click)="deleteApplicationDependencies(appdep?.id)"
                              type="button" placement="top" ngbTooltip="Delete">
                              <i class="mdi mdi-delete font-size-16"></i>
                            </a>
                          </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                                  ---
                                </div>`;
          }

          $('#table_dependencies')
            .DataTable()
            .row.add([
              new_object?.id,
              new_object?.element,
              new_object?.element_value,
              new_object?.status,
              new_object?.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_dependencies').DataTable().row(':last').node().id =
            'dependencies-' + new_object?.id;
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
  getDiffAppSource() {
    let new_object: any = '';
    this.applicationSourcesService
      .getApplicationSourcesByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response9 = result;
          this.applicationSources1 = this.response9.data;
          for (let key in this.applicationSources1) {
            if (
              JSON.stringify(this.applicationSources1[key]) ===
              JSON.stringify(this.applicationSources[key])
            ) {
              continue;
            } else {
              new_object = this.applicationSources1[key];
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

          if (new_object?.source_type === 1) {
            new_object.source_type = 'Git';
          } else if (new_object?.source_type === 2) {
            new_object.source_type = 'Cloud';
          } else {
            new_object.source_type = 'Local';
          }

          if (new_object?.source_build === '') {
            new_object.source_build = '---';
          }
          if (this.usrPer.applications.includes('delete') == true) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            <a *ngIf="this.usrPer.applications.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDeleteSrc" data-id="${new_object?.id}" (click)="deleteApplicationSource(appsrc?.id)"
                              type="button" placement="top" ngbTooltip="Delete">
                              <i class="mdi mdi-delete font-size-16"></i>
                            </a>
                          </div>`;
          } else {
            new_object.actions = ` <div class="d-flex gap-2 justify-content-center">
                            ---
                          </div>`;
          }

          $('#table_sc')
            .DataTable()
            .row.add([
              new_object?.id,
              new_object?.source_type,
              new_object?.source_build,
              new_object?.status,
              new_object?.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_sc').DataTable().row(':last').node().id =
            'sc-' + new_object?.id;
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
  getDiffAppVersion() {
    let new_object: any = '';
    this.applicationVersionsService
      .getApplicationVersionsByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response8 = result;
          this.applicationVersions1 = this.response8.data;

          for (let key in this.applicationVersions1) {
            if (
              JSON.stringify(this.applicationVersions1[key]) ===
              JSON.stringify(this.applicationVersions[key])
            ) {
              continue;
            } else {
              new_object = this.applicationVersions1[key];
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

          if (this.usrPer.applications.includes('delete') == true) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            <a class="btn btn-sm btn-soft-danger btnDeleteVer" data-id="${new_object?.id}" (click)="deleteApplicationVersion(appver?.id)"
                              type="button" placement="top" ngbTooltip="Delete">
                              <i class="mdi mdi-delete font-size-16"></i>
                            </a>
                          </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                           ---
                          </div>`;
          }

          $('#table_vr')
            .DataTable()
            .row.add([
              new_object?.id,
              new_object?.version,
              new_object?.status,
              new_object?.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_vr').DataTable().row(':last').node().id =
            'vr-' + new_object?.id;
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

  addVersion() {
    let data = this.versionForm.value;
    data.application = this.application;
    if (data.status === '') {
      data.status = data.application.status;
    }
    if (this.versionForm.invalid || this.versionForm.value.length == 0) {
      this.submitted1 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addappver')?.classList.remove('d-none');
    this.applicationVersionsService.addApplicationVersion(data).subscribe(
      (result) => {
        let new_app_ver = result.data;
        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          4,
          new_app_ver?.id,
          this.user,
          12
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
        document.querySelector('.addappver')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Version Added',
        });
        this.close();
        this.closebutton.nativeElement.click();
        this.getDiffAppVersion();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.addappver')?.classList.add('d-none');
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

  updateApplication(id: any) {
    let data = this.formapplication.value;
    let fd = new FormData();

    if (
      this.formapplication.invalid ||
      this.formapplication.value.length == 0
    ) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.updateAppLoad')?.classList.remove('d-none');
    if (this.file) {
      data.account = this.user.account;
      data.id = this.id;
      data.start_date = this.application.start_date;
      data.environment = this.application.environment;
      fd.append('application', JSON.stringify(data));
      fd.append('file', this.file);
      this.applicationservice.editApplication(fd, id).subscribe(
        (result) => {
          if (
            result.status == 200 &&
            result.message == 'Nothing was changed!'
          ) {
            document.querySelector('.updateAppLoad')?.classList.add('d-none');
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
            this.CreateLogs('Edit', formatedTimestamp(), 12, id, this.user, 12);
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
            document.querySelector('.updateAppLoad')?.classList.add('d-none');
            Toast.fire({
              icon: 'success',
              title: 'Application updated',
            });
            this.getDiff();
            this.application.name = data.name;
            this.application.status = data.status;
            this.application.classe = data.classe;
            this.application.logo = result.data.logo;
          } else {
            document.querySelector('.updateAppLoad')?.classList.add('d-none');
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong!',
              icon: 'error',
              confirmButtonColor: '#2f49c7',
            });
          }
        },
        (error) => {
          document.querySelector('.updateAppLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else {
      this.applicationservice.updateApplication(data, id).subscribe(
        (result) => {
          if (
            result.status == 200 &&
            result.message == 'Nothing was changed!'
          ) {
            document.querySelector('.updateAppLoad')?.classList.add('d-none');
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
            this.CreateLogs('Edit', formatedTimestamp(), 12, id, this.user, 12);
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
            document.querySelector('.updateAppLoad')?.classList.add('d-none');
            Toast.fire({
              icon: 'success',
              title: 'Application updated',
            });
            this.getDiff();
            this.application.name = data.name;
            this.application.status = data.status;
            this.application.classe = data.classe;
          } else {
            document.querySelector('.updateAppLoad')?.classList.add('d-none');
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong!',
              icon: 'error',
              confirmButtonColor: '#2f49c7',
            });
          }
        },
        (error) => {
          document.querySelector('.updateAppLoad')?.classList.add('d-none');
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
  deleteApplicationDependencies(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this dependency ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateAppLoad')?.classList.remove('d-none');
        this.applicationDependenciesService
          .getApplicationDependenciesByID(id)
          .subscribe(
            (result) => {
              let app_dep = result.data;
              app_dep.status = 4;
              const formatedTimestamp = () => {
                const d = new Date();
                const date = d.toISOString().split('T')[0];
                const time = d.toTimeString().split(' ')[0];
                return `${date} ${time}`;
              };
              app_dep.end_date = formatedTimestamp();
              this.applicationDependenciesService
                .updateApplicationDependencies(app_dep, id)
                .subscribe(
                  (result) => {
                    if (result.status == 200) {
                      this.CreateLogs(
                        'Delete',
                        formatedTimestamp(),
                        13,
                        id,
                        this.user,
                        12
                      );

                      let row = document.getElementById('dependencies-' + id);
                      if (row != null) {
                        $('#table_dependencies').DataTable().row(row).remove();
                        $('#table_dependencies').DataTable().draw();
                        this.applicationDependencies =
                          this.applicationDependencies.filter(
                            (ad: { id: any }) => ad.id !== id
                          );
                        document
                          .querySelector('.updateAppLoad')
                          ?.classList.add('d-none');
                        Swal.fire({
                          title: 'Deleted!',
                          text: 'Dependency has been deleted.',
                          icon: 'success',
                          confirmButtonColor: '#2f49c7',
                        });
                        this.getDiff();
                      }
                    } else {
                      document
                        .querySelector('.updateAppLoad')
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
                      .querySelector('.updateAppLoad')
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
              document.querySelector('.updateAppLoad')?.classList.add('d-none');
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

  deleteApplicationDeployment(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this deployment ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateAppLoad')?.classList.remove('d-none');
        this.applicationInstancesService
          .getApplicationInstanceByID(id)
          .subscribe(
            (result) => {
              this.response5 = result;
              this.applicationInstance = this.response5.data;
              this.applicationInstance.status = 4;
              const formatedTimestamp = () => {
                const d = new Date();
                const date = d.toISOString().split('T')[0];
                const time = d.toTimeString().split(' ')[0];
                return `${date} ${time}`;
              };
              this.applicationInstance.end_date = formatedTimestamp();
              this.applicationInstancesService
                .updateApplicationInstance(this.applicationInstance, id)
                .subscribe(
                  (result) => {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      14,
                      id,
                      this.user,
                      12
                    );

                    let row = document.getElementById('depl-' + id);
                    if (row != null) {
                      $('#table_depl').DataTable().row(row).remove();
                      $('#table_depl').DataTable().draw();
                      this.applicationDeployment =
                        this.applicationDeployment.filter(
                          (adep: { id: any }) => adep.id !== id
                        );
                      document
                        .querySelector('.updateAppLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Deployment has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                      this.getDiff();
                    }
                  },
                  (error) => {
                    document
                      .querySelector('.updateAppLoad')
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
              document.querySelector('.updateAppLoad')?.classList.add('d-none');
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

  deleteApplicationVersion(id: any) {
    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't to delete this version ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateAppLoad')?.classList.remove('d-none');
        this.applicationVersionsService
          .getApplicationVersionsByID(id)
          .subscribe(
            (result) => {
              let appver = result.data;
              appver.status = 4;
              const formatedTimestamp = () => {
                const d = new Date();
                const date = d.toISOString().split('T')[0];
                const time = d.toTimeString().split(' ')[0];
                return `${date} ${time}`;
              };
              appver.end_date = formatedTimestamp();
              this.applicationVersionsService
                .updateApplicationVersion(appver, id)
                .subscribe(
                  (result) => {
                    if (result.status == 200) {
                      this.CreateLogs(
                        'Delete',
                        formatedTimestamp(),
                        4,
                        id,
                        this.user,
                        12
                      );

                      let row = document.getElementById('vr-' + id);
                      if (row != null) {
                        $('#table_vr').DataTable().row(row).remove();
                        $('#table_vr').DataTable().draw();
                        this.applicationVersions =
                          this.applicationVersions.filter(
                            (av: { id: any }) => av.id !== id
                          );
                        document
                          .querySelector('.updateAppLoad')
                          ?.classList.add('d-none');
                        Swal.fire({
                          title: 'Deleted!',
                          text: 'Version has been deleted.',
                          icon: 'success',
                          confirmButtonColor: '#2f49c7',
                        });
                        this.getDiff();
                      }
                    } else {
                      document
                        .querySelector('.updateAppLoad')
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
                      .querySelector('.updateAppLoad')
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
              document.querySelector('.updateAppLoad')?.classList.add('d-none');
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

  deleteApplicationSource(id: any) {
    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't to delete this source ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateAppLoad')?.classList.remove('d-none');
        this.applicationSourcesService.getApplicationSourcesByID(id).subscribe(
          (result) => {
            let appsrc = result.data;
            appsrc.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            appsrc.end_date = formatedTimestamp();
            this.applicationSourcesService
              .updateApplicationSources(appsrc, id)
              .subscribe(
                (result) => {
                  if (result.status == 200) {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      15,
                      id,
                      this.user,
                      12
                    );

                    let row = document.getElementById('sc-' + id);
                    if (row != null) {
                      $('#table_sc').DataTable().row(row).remove();
                      $('#table_sc').DataTable().draw();
                      this.applicationSources = this.applicationSources.filter(
                        (sc: { id: any }) => sc.id !== id
                      );
                      document
                        .querySelector('.updateAppLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Source has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                      this.getDiff();
                    }
                  } else {
                    document
                      .querySelector('.updateAppLoad')
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
                    .querySelector('.updateAppLoad')
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
            document.querySelector('.updateAppLoad')?.classList.add('d-none');
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

  getApplicationByID() {
    this.applicationservice.getApplicationByID(this.id).subscribe(
      (result) => {
        this.response = result.data;
        this.application = this.response;
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

  getApplicationDependenciesList() {
    this.applicationDependenciesService
      .getApplicationDependenciesByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response1 = result;
          this.applicationDependencies = this.response1.data;
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
    this.userslogsService.getApplicationLogsList(this.id).subscribe(
      (result) => {
        this.response7 = result;
        this.userLogsList1 = this.response7.data.map((elem: any) => {
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
        $('#table_aaplication_logs')
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
    this.userslogsService.getApplicationLogsList(this.id).subscribe(
      (result) => {
        this.response6 = result;
        this.userLogsList = this.response6.data.map((elem: any) => {
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

  getApplicationVersionsList() {
    this.applicationVersionsService
      .getApplicationVersionsByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response2 = result;
          this.applicationVersions = this.response2.data;
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

  getApplicationDeploymentList() {
    this.applicationInstancesService
      .getApplicationInstanceByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response4 = result;
          this.applicationDeployment = this.response4.data;
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

  getApplicationSourcesList() {
    this.applicationSourcesService
      .getApplicationSourcesByApplicationID(this.id)
      .subscribe(
        (result) => {
          this.response3 = result;
          this.applicationSources = this.response3.data;
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
    this.applicationInstancesService
      .getApplicationInstanceByApplicationID(this.id)
      .subscribe(
        (result) => {
          let res: any;
          res = result;
          let applicationsDeployment = res.data;
          this.ServersSercie.getAllServers().subscribe(
            (result1) => {
              let res1: any;
              res1 = result1;
              if (res1.status == 200) {
                if (applicationsDeployment.length !== 0) {
                  for (let i = 0; i < applicationsDeployment.length; i++) {
                    res1.data = res1.data.filter(
                      (ins: { instance: any }) =>
                        ins?.instance?.id !==
                        applicationsDeployment[i].instance.id
                    );
                    this.serversList = res1.data;
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
}

import { BackupInstancesService } from './../../../../Services/backup-instances.service';
import { ApplicationInstancesService } from './../../../../Services/application-instances.service';
import { BackupExecutionsService } from 'src/app/Services/backup-executions.service';
import { ApplicationService } from 'src/app/Services/application.service';

import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InstanceService } from 'src/app/Services/instance.service';
import { ServerService } from 'src/app/Services/server.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import Swal from 'sweetalert2';
import { AccessCredentialsService } from 'src/app/Services/access-credentials.service';
import { Subject } from 'rxjs';
import { ApplicationVersionsService } from 'src/app/Services/application-versions.service';
import { BackupOperationsService } from 'src/app/Services/backup-operations.service';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
declare function setP(): any;
@Component({
  selector: 'app-serverdetails',
  templateUrl: './serverdetails.component.html',
  styleUrls: ['./serverdetails.component.css'],
})
export class ServerdetailsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebuttonCred') closebuttonCred: any;
  @ViewChild('closebuttonB') closebuttonB: any;
  server: any;
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
  applicationList: any;
  userLogsList: any;
  userLogsList1: any;
  application: any[] = [];
  application1: any[] = [];
  backupsList: any[] = [];
  backupsList1: any[] = [];
  accessCredentials: any;
  accessCredentials1: any;
  public serverForm!: FormGroup;
  public accessForm!: FormGroup;
  public applicationForm!: FormGroup;
  public backupForm!: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  v1: any = {
    status: 1,
  };
  id!: any;
  affiche2: any;
  value: any;
  valuue: any;
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
    private route: ActivatedRoute,
    private serverService: ServerService,
    private applicationService: ApplicationService,
    private accessCredentialsService: AccessCredentialsService,
    private router: Router,
    private fb: FormBuilder,
    private applicationVersionsService: ApplicationVersionsService,
    private backupOperationsService: BackupOperationsService,
    private backupExecutionsService: BackupExecutionsService,
    private userslogsService: UserslogsService,
    private instanceService: InstanceService,
    private ApplicationInstancesService: ApplicationInstancesService,
    public datepipe: DatePipe,
    private BackupExecutionsService: BackupExecutionsService,
    private BackupInstancesService: BackupInstancesService
  ) {
    this.serverForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      classe: [''],
      external_id: [''],
      ip_address: ['', Validators.required],
      operating_system: ['', Validators.required],
      os_version: ['', Validators.required],
      location: ['', Validators.required],
      cpu: ['', Validators.required],
      disk_space: ['', Validators.required],
      memory: ['', Validators.required],
      environment: [''],
      status: ['', Validators.required],
      instance: this.fb.group({
        id: [''],
      }),
    });

    this.accessForm = this.fb.group({
      name: ['', Validators.required],
      classe: ['', Validators.required],
      element: [''],
      element_id: [''],
      status: [''],
      login: ['', Validators.required],
      password: ['', Validators.required],
      url: [''],
      port: ['', Validators.required],
      account: this.fb.group({
        id: [''],
      }),
    });

    this.applicationForm = this.fb.group({
      application: this.fb.group({
        id: [''],
      }),
    });

    this.backupForm = this.fb.group({
      name: ['',Validators.required],
      layout: ['',Validators.required],
      classe: ['',Validators.required],
      target: ['',Validators.required],
      schedule: ['',Validators.required],
    });
  }
  status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 2 },
    { name: 'In Progress', value: 3 },
  ];
  operating_system = [
    { name: 'windows', value: 1 },
    { name: 'mac Os', value: 2 },
    { name: 'fire Os', value: 3 },
  ];
  cloud_providers = [
    { name: 'prov1', value: 1 },
    { name: 'prov2', value: 2 },
    { name: 'prov3', value: 3 },
  ];
  os_version = [
    { name: 'windows7', value: 1 },
    { name: 'windows10', value: 4 },
    { name: 'mac Os2', value: 2 },
    { name: 'fire Os1', value: 3 },
  ];
  environment = [
    { name: 'Dos', value: 1, envid: 1 },
    { name: 'Unix', value: 2 },
  ];

  class = [
    { name: 'classe1', value: 1 },
    { name: 'classe2', value: 2 },
    { name: 'classe3', value: 3 },
  ];

  location = [
    { name: 'France', value: 1 },
    { name: 'Brazil', value: 2 },
    { name: 'Germany', value: 3 },
  ];
  cpu = [
    { name: 'Xeon E3-1275 V6', value: 1 },
    { name: 'Core i7-7700T', value: 2 },
    { name: 'Core i7-7100T', value: 3 },
    { name: 'Core i7-7000T', value: 4 },
  ];
  disk_space = [
    { name: '512 Go', value: 1 },
    { name: '1024 Go', value: 2 },
    { name: '2048 Go', value: 3 },
    { name: '5000 Go', value: 4 },
  ];
  memory = [
    { name: '16 Gb', value: 1 },
    { name: '32 Gb', value: 2 },
    { name: '64 Gb', value: 3 },
    { name: '128 Gb', value: 4 },
  ];
  type = [
    { name: 'Backup', value: 1 },
    { name: 'Provider', value: 2 },
    { name: 'Snapshot', value: 3 },
  ];
  layout = [
    { name: 'All', value: 1 },
    { name: 'Files', value: 2 },
    { name: 'Folders', value: 3 },
    { name: 'Databases', value: 4 },
  ];

  versionstatus = [{ name: 'Innactive', value: 1 }];
  element = [
    { name: 'sql version', value: 1 },
    { name: 'php version', value: 2 },
    { name: 'os version', value: 3 },
  ];
  elementname = [
    { name: 'sql version', value: 1 },
    { name: 'php version', value: 2 },
    { name: 'os version', value: 3 },
  ];
  ngAfterViewInit() {
    setP();
  }

  get form() {
    return this.serverForm.controls;
  }
  get accessform() {
    return this.accessForm.controls;
  }
  get backupform() {
    return this.backupForm.controls;
  }
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

    this.id = this.route.snapshot.paramMap.get('id');

    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElement = event?.target?.closest('.btnDelAppIns');
      // @ts-ignore
      let clickedElement1 = event?.target?.closest('.btnDelBackIns');
      // @ts-ignore
      let clickedElement2 = event?.target?.closest('.btnDelCred');
      if (clickedElement) {
        _this.deleteApplicationInstance(clickedElement.dataset.id);
      }
      if (clickedElement1) {
        _this.deleteBackup(clickedElement1.dataset.id);
      }
      if (clickedElement2) {
        _this.deleteCredentials(clickedElement2.dataset.id);
      }
    });

    this.getServer();
    this.getServerAccessCredentials();
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

  displayStyle = 'none';
  displayStyle1 = 'none';

  closePopup() {
    this.displayStyle = 'none';
  }
  closePopup1() {
    this.displayStyle1 = 'none';
  }
  get appform() {
    return this.applicationForm.controls;
  }

  Close() {
    this.accessForm.reset();
    this.applicationForm.reset();
    this.backupForm.reset();
    this.cpuChange(2);
    document.querySelector('.addappins')?.classList.add('d-none');
    document.querySelector('.addbackins')?.classList.add('d-none');
    document.querySelector('.addcred')?.classList.add('d-none');
  }

  addBackup() {
    let data = this.backupForm.value;
    data.account = this.user.account;
    data.instance = this.server.instance;
    data.schedule = this.datepipe.transform(
      data.schedule,
      'yyyy-MM-dd HH:mm:ss'
    );
    data.status = 1;
    data.run = 1;
    data.synchronization = 1;
    if (this.backupForm.invalid || this.backupForm.value.length == 0) {
      this.submitted3 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }

    document.querySelector('.addbackins')?.classList.remove('d-none');

    this.backupOperationsService.addBackupOperation(data).subscribe(
      (result) => {
        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        let new_backup_op = result.data;
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          16,
          new_backup_op?.id,
          this.user,
          8
        );
        let backup_exec = data;
        backup_exec.operation = new_backup_op;
        this.BackupExecutionsService.addBackupExecution(backup_exec).subscribe(
          (result) => {
            let new_backup_exec = result.data;
            this.CreateLogs(
              'Create',
              formatedTimestamp(),
              5,
              new_backup_exec?.id,
              this.user,
              8
            );

            let backup_ins = data;
            backup_ins.backup = new_backup_exec;

            this.BackupInstancesService.addBackupInstance(backup_ins).subscribe(
              (result) => {
                let new_backup_ins = result.data;
                this.CreateLogs(
                  'Create',
                  formatedTimestamp(),
                  17,
                  new_backup_ins?.id,
                  this.user,
                  8
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
                document.querySelector('.addbackins')?.classList.add('d-none');
                Toast.fire({
                  icon: 'success',
                  title: 'Backup Added',
                });
                this.Close();
                this.closebuttonB.nativeElement.click();
                this.getDiffBackup();
                this.getDiff();
              },
              (error) => {
                document.querySelector('.addbackins')?.classList.add('d-none');
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
            document.querySelector('.addbackins')?.classList.add('d-none');
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
        document.querySelector('.addbackins')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  addApplicationInstance() {
    let data = this.applicationForm.value;
    data.status = 1;
    data.instance = this.server.instance;
    if (
      this.applicationForm.invalid ||
      this.applicationForm.value.length == 0
    ) {
      this.submitted2 = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addappins')?.classList.remove('d-none');
    this.ApplicationInstancesService.saveApplicationInstance(data).subscribe(
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
          8
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
        document.querySelector('.addappins')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Application Added',
        });
        this.Close();
        this.closebutton.nativeElement.click();
        //this.getDiffApp()
        this.getDiffAppInstance();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.addappins')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  addAccessCredential() {
    let data = this.accessForm.value;
    data.account = this.user?.account;
    data.element = 1;
    data.element_id = this.id;
    data.status = 1;
    if (this.accessForm.invalid || this.accessForm.value.length == 0) {
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
    document.querySelector('.addcred')?.classList.remove('d-none');

    this.accessCredentialsService.addServerAccessCredentials(data).subscribe(
      (result) => {
        if (result.status == 200) {
          const formatedTimestamp = () => {
            const d = new Date();
            const date = d.toISOString().split('T')[0];
            const time = d.toTimeString().split(' ')[0];
            return `${date} ${time}`;
          };
          this.CreateLogs(
            'Create',
            formatedTimestamp(),
            6,
            result?.data?.id,
            this.user,
            8
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
          document.querySelector('.addcred')?.classList.add('d-none');
          Toast.fire({
            icon: 'success',
            title: 'Access added',
          });
          this.Close();
          this.closebuttonCred.nativeElement.click();
          this.getDiffAccessCred();
          this.getDiff();
        }
      },
      (error) => {
        document.querySelector('.addcred')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  updateInstance(id: any) {
    let data = this.serverForm.value;
    if (this.serverForm.invalid || this.serverForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.updateServerLoad')?.classList.remove('d-none');
    this.instanceService
      .updateInventoryInstance({ name: data.name, status: data.status }, id)
      .subscribe(
        (result) => {
          if (
            result.status == 200 &&
            result.message == 'Nothing was changed!'
          ) {
            document
              .querySelector('.updateServerLoad')
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
            this.CreateLogs('Edit', formatedTimestamp(), 3, id, this.user, 8);
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
              .querySelector('.updateServerLoad')
              ?.classList.add('d-none');
            Toast.fire({
              icon: 'success',
              title: 'Server updated',
            });
            this.getDiff();
            this.server.instance.name = data.name;
            this.server.instance.status = data.status;
          } else {
            document
              .querySelector('.updateServerLoad')
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
          document.querySelector('.updateServerLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
  }
  updateServer(id: any) {
    let data = this.serverForm.value;
    data.classe = this.server.classe;
    data.external_id = this.server.external_id;
    data.environment = this.server.environment;
    if (this.serverForm.invalid || this.serverForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    if (!this.ValidateIPaddress(data.ip_address)) {
      return;
    }
    document.querySelector('.updateServerLoad')?.classList.remove('d-none');
    this.serverService.updateServer(data, id).subscribe(
      (result) => {
        if (result.status == 200 && result.message == 'Nothing was changed!') {
          document.querySelector('.updateServerLoad')?.classList.add('d-none');
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
          this.CreateLogs('Edit', formatedTimestamp(), 20, id, this.user, 8);
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
          document.querySelector('.updateServerLoad')?.classList.add('d-none');
          Toast.fire({
            icon: 'success',
            title: 'Server updated',
          });
          this.getDiff();
          this.server.ip_address = data.ip_address;
          this.server.location = data.location;
          this.server.operating_system = data.operating_system;
          this.server.os_version = data.os_version;
          this.server.cpu = data.cpu;
          this.server.memory = data.memory;
          this.server.disk_space = data.disk_space;
        } else {
          document.querySelector('.updateServerLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      },
      (error) => {
        document.querySelector('.updateServerLoad')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
  }
  deleteApplicationInstance(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this application ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateServerLoad')?.classList.remove('d-none');
        this.ApplicationInstancesService.getApplicationInstanceByID(
          id
        ).subscribe(
          (result) => {
            this.response6 = result;
            let app_instance = this.response6.data;
            app_instance.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            app_instance.end_date = formatedTimestamp();
            this.ApplicationInstancesService.updateApplicationInstance(
              app_instance,
              id
            ).subscribe(
              (result) => {
                if (result.status == 200) {
                  this.CreateLogs(
                    'Delete',
                    formatedTimestamp(),
                    14,
                    id,
                    this.user,
                    8
                  );
                  let row = document.getElementById('app-ver-' + id);
                  if (row != null) {
                    $('#table_app_ver').DataTable().row(row).remove();
                    $('#table_app_ver').DataTable().draw();
                    this.application = this.application.filter(
                      (ver_id: { id: any }) => ver_id.id !== id
                    );
                    document
                      .querySelector('.updateServerLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Application has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                    this.getDiff();
                  }
                } else {
                  document
                    .querySelector('.updateServerLoad')
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
                  .querySelector('.updateServerLoad')
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
              .querySelector('.updateServerLoad')
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

  deleteBackup(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this backup ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateServerLoad')?.classList.remove('d-none');
        this.backupExecutionsService
          .getBackupExecutionsByOperationID(id)
          .subscribe(
            (result) => {
              this.response4 = result;
              let backup = this.response4.data;
              backup.status = 4;
              const formatedTimestamp = () => {
                const d = new Date();
                const date = d.toISOString().split('T')[0];
                const time = d.toTimeString().split(' ')[0];
                return `${date} ${time}`;
              };
              backup.end_date = formatedTimestamp();
              this.backupExecutionsService
                .updateBackupExecutions(backup, backup?.id)
                .subscribe(
                  (result) => {
                    if (result.status == 200) {
                      this.CreateLogs(
                        'Delete',
                        formatedTimestamp(),
                        17,
                        backup?.id,
                        this.user,
                        8
                      );

                      let row = document.getElementById('b-' + id);
                      if (row != null) {
                        $('#table_back').DataTable().row(row).remove();
                        $('#table_back').DataTable().draw();
                        this.backupsList = this.backupsList.filter(
                          (b: { id: any }) => b.id !== id
                        );
                        document
                          .querySelector('.updateServerLoad')
                          ?.classList.add('d-none');
                        Swal.fire({
                          title: 'Deleted!',
                          text: 'Backup has been deleted.',
                          icon: 'success',
                          confirmButtonColor: '#2f49c7',
                        });
                        this.getDiff();
                      }
                    } else {
                      document
                        .querySelector('.updateServerLoad')
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
                      .querySelector('.updateServerLoad')
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
                .querySelector('.updateServerLoad')
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

  deleteCredentials(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this credential ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.updateServerLoad')?.classList.remove('d-none');
        this.accessCredentialsService.getAccessCredentialsByID(id).subscribe(
          (result) => {
            let cred = result.data;
            cred.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            cred.end_date = formatedTimestamp();
            this.accessCredentialsService
              .updateAccessCredentials(cred, id)
              .subscribe(
                (result) => {
                  if (result.status == 200) {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      6,
                      id,
                      this.user,
                      8
                    );

                    let row = document.getElementById('cre-' + id);
                    if (row != null) {
                      $('#table_cre').DataTable().row(row).remove();
                      $('#table_cre').DataTable().draw();
                      this.accessCredentials = this.accessCredentials.filter(
                        (cre: { id: any }) => cre.id !== id
                      );
                      document
                        .querySelector('.updateServerLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Credential has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                      this.getDiff();
                    }
                  } else {
                    document
                      .querySelector('.updateServerLoad')
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
                    .querySelector('.updateServerLoad')
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
              .querySelector('.updateServerLoad')
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
  cpuChange2(value: any) {
    this.valuue = value;
  }
  cpuChange(value: any) {
    this.value = value;
  }
  getSelectedSkill(event: any) {
    this.affiche2 = true;
  }
  getDiff() {
    let new_object: any = '';
    this.userslogsService.getServerLogsList(this.server.instance.id).subscribe(
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
        $('#table_server_logs')
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

  getDiffAppInstance() {
    let new_object: any = '';

    this.ApplicationInstancesService.getApplicationInstanceByInstanceID(
      this.server.instance.id
    ).subscribe(
      (result) => {
        this.response11 = result;
        this.application1 = this.response11.data;
        for (let key in this.application1) {
          if (
            JSON.stringify(this.application1[key]) ===
            JSON.stringify(this.application[key])
          ) {
            continue;
          } else {
            new_object = this.application1[key];
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

        if (
          this.usrPer.applications.includes('update') == true &&
          this.usrPer.applications.includes('delete') == true
        ) {
          new_object.actions =
            `<div class="d-flex gap-2 justify-content-center">
                            <a class="btn btn-sm btn-soft-primary"
                              href="#/application-details/` +
            new_object?.application?.id +
            `" placement="top" ngbTooltip="View">
                              <i class="mdi mdi-pencil font-size-16"></i>
                            </a>

                            <a class="btn btn-sm btn-soft-danger btnDelAppIns" data-id="${new_object?.id}" (click)="deleteApplicationInstance(app?.id)"
                              type="button" placement="top" ngbTooltip="Delete">
                              <i class="mdi mdi-delete font-size-16"></i>
                            </a>
                          </div>`;
        } else if (
          this.usrPer.applications.includes('update') == false &&
          this.usrPer.applications.includes('delete') == true
        ) {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            <a class="btn btn-sm btn-soft-danger btnDelAppIns" data-id="${new_object?.id}" (click)="deleteApplicationInstance(app?.id)"
                              type="button" placement="top" ngbTooltip="Delete">
                              <i class="mdi mdi-delete font-size-16"></i>
                            </a>
                          </div>`;
        } else if (
          this.usrPer.applications.includes('update') == true &&
          this.usrPer.applications.includes('delete') == false
        ) {
          new_object.actions =
            `<div class="d-flex gap-2 justify-content-center">
                            <a class="btn btn-sm btn-soft-primary"
                              href="#/application-details/` +
            new_object?.application?.id +
            `" placement="top" ngbTooltip="View">
                              <i class="mdi mdi-pencil font-size-16"></i>
                            </a>
                          </div>`;
        } else {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">---</div>`;
        }

        $('#table_app_ver')
          .DataTable()
          .row.add([
            new_object.id,
            new_object.application.name,
            new_object.status,
            new_object.actions,
          ])
          .draw();
        //@ts-ignore
        $('#table_app_ver').DataTable().row(':last').node().id =
          'app-ver-' + new_object.id;
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

  getDiffBackup() {
    let new_object: any = '';
    this.backupOperationsService
      .getBackupOperationsListByInstanceID(this.server.instance.id)
      .subscribe(
        (result) => {
          this.response10 = result;
          this.backupsList1 = this.response10.data;
          for (let key in this.backupsList1) {
            if (
              JSON.stringify(this.backupsList1[key]) ===
              JSON.stringify(this.backupsList[key])
            ) {
              continue;
            } else {
              new_object = this.backupsList1[key];
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

          if (
            this.usrPer.backups.includes('update') == true &&
            this.usrPer.backups.includes('delete') == true
          ) {
            new_object.actions =
              `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-primary" placement="top"
                                ngbTooltip="View" href="#/backups/backups-details/` +
              new_object?.id +
              `">
                                <i class="mdi mdi-pencil font-size-16"></i>
                              </a>
                              <a class="btn btn-sm btn-soft-primary" placement="top"
                                ngbTooltip="download">
                                <i class="mdi mdi-arrow-down-bold-box-outline font-size-16"></i>
                              </a>
                              <a class="btn btn-sm btn-soft-danger btnDelBackIns" data-id="${new_object?.id}" (click)="deleteBackup(backup?.id)"
                                type="button" placement="top" ngbTooltip="Delete">
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.backups.includes('update') == false &&
            this.usrPer.backups.includes('delete') == true
          ) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-primary" placement="top"
                                ngbTooltip="download">
                                <i class="mdi mdi-arrow-down-bold-box-outline font-size-16"></i>
                              </a>
                              <a class="btn btn-sm btn-soft-danger btnDelBackIns" data-id="${new_object?.id}" (click)="deleteBackup(backup?.id)"
                                type="button" placement="top" ngbTooltip="Delete">
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else if (
            this.usrPer.backups.includes('update') == true &&
            this.usrPer.backups.includes('delete') == false
          ) {
            new_object.actions =
              `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-primary" placement="top"
                                ngbTooltip="View" href="#/backups/backups-details/` +
              new_object?.id +
              `">
                                <i class="mdi mdi-pencil font-size-16"></i>
                              </a>
                              <a class="btn btn-sm btn-soft-primary" placement="top"
                                ngbTooltip="download">
                                <i class="mdi mdi-arrow-down-bold-box-outline font-size-16"></i>
                              </a>
                            </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-primary" placement="top"
                                ngbTooltip="download">
                                <i class="mdi mdi-arrow-down-bold-box-outline font-size-16"></i>
                              </a>
                            </div>`;
          }

          $('#table_back')
            .DataTable()
            .row.add([
              new_object.id,
              new_object.name,
              new_object.status,
              new_object.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_back').DataTable().row(':last').node().id =
            'b-' + new_object.id;
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

  getDiffAccessCred() {
    let new_object: any = '';
    this.accessCredentialsService
      .getServerCredentialsByElementId(this.id)
      .subscribe(
        (result) => {
          this.response8 = result;
          this.accessCredentials1 = this.response8.data;
          for (let key in this.accessCredentials1) {
            if (
              JSON.stringify(this.accessCredentials1[key]) ===
              JSON.stringify(this.accessCredentials[key])
            ) {
              continue;
            } else {
              new_object = this.accessCredentials1[key];
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

          new_object.password = '******';
          if (this.usrPer.access_credentials.includes('delete') == true) {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                              <a class="btn btn-sm btn-soft-danger btnDelCred" data-id="${new_object?.id}" (click)="deleteCredentials(cred?.id)"
                                type="button" placement="top" ngbTooltip="Delete">
                                <i class="mdi mdi-delete font-size-16"></i>
                              </a>
                            </div>`;
          } else {
            new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                            ---
                            </div>`;
          }

          $('#table_cre')
            .DataTable()
            .row.add([
              new_object.id,
              new_object.name,
              new_object.login,
              new_object.password,
              new_object.port,
              new_object.status,
              new_object.actions,
            ])
            .draw();
          //@ts-ignore
          $('#table_cre').DataTable().row(':last').node().id =
            'cre-' + new_object.id;
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
    this.userslogsService.getServerLogsList(this.server.instance.id).subscribe(
      (result) => {
        this.response5 = result;
        this.userLogsList = this.response5.data.map((elem: any) => {
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

  getAppList() {
    this.ApplicationInstancesService.getApplicationInstanceByInstanceID(
      this.server.instance.id
    ).subscribe(
      (result) => {
        let res: any;
        res = result;
        let applicationn = res.data;
        this.applicationService.getApplicationList().subscribe(
          (result) => {
            let res1: any;
            res1 = result;
            if (applicationn.length !== 0) {
              for (let i = 0; i < applicationn.length; i++) {
                res1.data = res1.data.filter(
                  (app_id: { id: any }) =>
                    app_id.id !== applicationn[i]?.application?.id
                );
                this.applicationList = res1.data;
              }
            } else {
              this.applicationList = res1.data;
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
  /*
getDiffApp(){
this.serverService.getserverById(this.id).subscribe(
result=>{
this.response = result
this.ApplicationInstancesService.getApplicationInstanceByInstanceID(this.server.instance.id).subscribe(
result=>{
this.response2 = result
this.application = this.response2.data
this.applicationService.getApplicationList().subscribe(
result=>{
this.response9 = result
if(this.application.length !==0){
for(let i=0; i<this.application.length;i++){
this.response9.data = this.response9.data.filter((app_id: { id: any; }) => app_id.id !== this.application[i]?.application?.id);
this.applicationList = this.response9.data
}
}else{
this.applicationList = this.response9.data
}

},error=>{
}
)
},error=>{
}
)
},error=>{
}
  )
}
*/
  getServer() {
    this.serverService.getserverById(this.id).subscribe(
      (result) => {
        this.response = result;
        this.server = this.response.data;
        this.getUserLogs();
        this.ApplicationInstancesService.getApplicationInstanceByInstanceID(
          this.server.instance.id
        ).subscribe(
          (result) => {
            this.response2 = result;
            this.application = this.response2.data;
            this.applicationService.getApplicationList().subscribe(
              (result) => {
                this.response9 = result;
                if (this.application.length !== 0) {
                  for (let i = 0; i < this.application.length; i++) {
                    this.response9.data = this.response9.data.filter(
                      (app_id: { id: any }) =>
                        app_id.id !== this.application[i]?.application?.id
                    );
                    this.applicationList = this.response9.data;
                  }
                } else {
                  this.applicationList = this.response9.data;
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
            this.backupOperationsService
              .getBackupOperationsListByInstanceID(this.server.instance.id)
              .subscribe(
                (result) => {
                  this.response3 = result;
                  this.backupsList = this.response3.data;
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

  getServerAccessCredentials() {
    this.accessCredentialsService
      .getServerCredentialsByElementId(this.id)
      .subscribe(
        (result) => {
          this.response1 = result;
          this.accessCredentials = this.response1.data;
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

  ValidateIPaddress(ipaddress: any) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
      )
    ) {
      return true;
    }
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You have entered an invalid IP address!',
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
}

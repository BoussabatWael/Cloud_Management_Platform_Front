import { BackupExecutionsService } from 'src/app/Services/backup-executions.service';
import { BackupInstancesService } from './../../../Services/backup-instances.service';
import { ServerService } from './../../../Services/server.service';
import { BackupOperationsService } from './../../../Services/backup-operations.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import flatpickr from 'flatpickr';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css'],
})
export class BackupsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  response: any;
  response1: any;
  response2: any;
  backupOperationsList: any;
  backupOperationsList1: any;
  serversList: any;
  searchText: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  radio_one: any;
  radio_two: any;
  value: any = true;
  target: any;
  affiche1: boolean = false;
  affiche2: boolean = false;
  submitted: boolean = false;
  selectedSkill: any;
  valuue: any;
  usr: any;
  user: any;
  userLogs: logs = new logs();
  backupForm!: FormGroup;
  userPermission: any;
  usrPer: any;

  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private backupOperationsService: BackupOperationsService,
    private router: Router,
    private userslogsService: UserslogsService,
    private ServersSercie: ServerService,
    private BackupInstancesService: BackupInstancesService,
    private BackupExecutionsService: BackupExecutionsService
  ) {
    this.backupForm = this.fb.group({
      name: ['', Validators.required],
      layout: ['', Validators.required],
      classe: [''],
      target: [''],
      schedule: ['', Validators.required],
      instance: this.fb.group({
        id: ['', Validators.required],
      }),
    });
  }
  status = [
    { name: 'active', value: 1 },
    { name: 'in progress', value: 2 },
    { name: 'innactive', value: 3 },
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
      let clickedElement = event?.target?.closest('.btnDeleteBackup');
      if (clickedElement) {
        _this.deleteBackup(clickedElement.dataset.id);
      }
    });

    this.getAllServers();
    this.getBackupOperationsList();
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

  open() {
    const config = {
      enableTime: true,
      altInput: true,
      altFormat: 'm-d-Y h:i ',
    };

    flatpickr('#flatpickr_time', config);
  }

  getSelectedSkill(event: any) {
    this.affiche2 = true;
  }
  close() {
    this.backupForm.reset();
    this.cpuChange(2);
    document.querySelector('.addbackup')?.classList.add('d-none');
  }
  get backupform() {
    return this.backupForm.controls;
  }

  getDiff() {
    let new_object: any = '';
    this.backupOperationsService.getBackupOperationsList().subscribe(
      (result) => {
        this.response2 = result;
        this.backupOperationsList1 = this.response2.data;
        for (let key in this.backupOperationsList1) {
          if (
            JSON.stringify(this.backupOperationsList1[key]) ===
            JSON.stringify(this.backupOperationsList[key])
          ) {
            continue;
          } else {
            new_object = this.backupOperationsList1[key];
          }
        }
        if (new_object?.layout === 1) {
          new_object.layout = 'All';
        } else if (new_object?.layout === 2) {
          new_object.layout = 'Files';
        } else if (new_object?.layout === 3) {
          new_object.layout = 'Folders';
        } else {
          new_object.layout = 'Databases';
        }

        if (new_object?.synchronization === 1) {
          new_object.synchronization = 'YES';
        } else {
          new_object.synchronization = 'NO';
        }

        if (new_object?.target === 1) {
          new_object.target = 'Local';
        } else {
          new_object.target = 'Remote';
        }

        if (new_object?.status === 1) {
          new_object.status =
            '<i class="mdi mdi-circle text-success align-middle me-1"></i>Active';
        } else if (new_object?.status === 2) {
          new_object.status =
            '<i class="mdi mdi-circle text-danger align-middle me-1"></i>Inactive';
        } else {
          new_object.status =
            '<i class="mdi mdi-circle text-warning align-middle me-1"></i>In Progress';
        }

        if (
          this.usrPer.backups.includes('update') == true &&
          this.usrPer.backups.includes('delete') == true
        ) {
          new_object.actions =
            `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-primary"
                        href="#/backups/backups-details/` +
            new_object?.id +
            `" placement="top" ngbTooltip="View">
                       <i class="mdi mdi-pencil font-size-16"></i>
                     </a>

                     <a class="btn btn-sm btn-soft-warning" placement="top" ngbTooltip="Stop">
                       <i class="mdi mdi-stop font-size-16"></i>
                     </a>
                     <a class="btn btn-sm btn-soft-danger btnDeleteBackup" data-id="${new_object?.id}" (click)="deleteBackup(backup_op?.id)"  type="button"
                     placement="top" ngbTooltip="Delete">
                     <i class="mdi mdi-delete font-size-16"></i>
                   </a>
                      </div>`;
        } else if (
          this.usrPer.backups.includes('update') == false &&
          this.usrPer.backups.includes('delete') == true
        ) {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                     <a class="btn btn-sm btn-soft-warning" placement="top" ngbTooltip="Stop">
                       <i class="mdi mdi-stop font-size-16"></i>
                     </a>
                     <a class="btn btn-sm btn-soft-danger btnDeleteBackup" data-id="${new_object?.id}" (click)="deleteBackup(backup_op?.id)"  type="button"
                     placement="top" ngbTooltip="Delete">
                     <i class="mdi mdi-delete font-size-16"></i>
                   </a>
                      </div>`;
        } else if (
          this.usrPer.backups.includes('update') == true &&
          this.usrPer.backups.includes('delete') == false
        ) {
          new_object.actions =
            `<div class="d-flex gap-2 justify-content-center">
                        <a class="btn btn-sm btn-soft-primary"
                        href="#/backups/backups-details/` +
            new_object?.id +
            `" placement="top" ngbTooltip="View">
                       <i class="mdi mdi-pencil font-size-16"></i>
                     </a>

                     <a class="btn btn-sm btn-soft-warning" placement="top" ngbTooltip="Stop">
                       <i class="mdi mdi-stop font-size-16"></i>
                     </a>
                      </div>`;
        } else {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                     <a class="btn btn-sm btn-soft-warning" placement="top" ngbTooltip="Stop">
                       <i class="mdi mdi-stop font-size-16"></i>
                     </a>
                      </div>`;
        }

        $('#table_backup_op')
          .DataTable()
          .row.add([
            new_object?.id,
            new_object?.name,
            new_object?.layout,
            new_object?.target,
            new_object?.synchronization,
            new_object?.status,
            new_object?.actions,
          ])
          .draw();
        //@ts-ignore
        $('#table_backup_op').DataTable().row(':last').node().id =
          'backup-op-' + new_object?.id;
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

  addBackup() {
    let data = this.backupForm.value;
    if (data.target == '') {
      data.target = 1;
    }
    data.account = this.user.account;
    data.schedule = this.datepipe.transform(
      data.schedule,
      'yyyy-MM-dd HH:mm:ss'
    );
    data.status = 1;
    data.run = 1;
    data.synchronization = 1;
    if (this.backupForm.invalid || this.backupForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.addbackup')?.classList.remove('d-none');
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
          13
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
              13
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
                  13
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
                document.querySelector('.addbackup')?.classList.add('d-none');
                Toast.fire({
                  icon: 'success',
                  title: 'Backup Added',
                });
                this.close();
                this.closebutton.nativeElement.click();
                this.getDiff();
              },
              (error) => {
                document.querySelector('.addbackup')?.classList.add('d-none');
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
            document.querySelector('.addbackup')?.classList.add('d-none');
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
        document.querySelector('.addbackup')?.classList.add('d-none');
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonColor: '#2f49c7',
        });
      }
    );
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
        document.querySelector('.backupLoad')?.classList.remove('d-none');
        this.backupOperationsService.getBackupByID(id).subscribe(
          (result) => {
            let backup_op = result.data;
            backup_op.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            backup_op.end_date = formatedTimestamp();
            this.backupOperationsService.updateBackup(backup_op, id).subscribe(
              (result) => {
                if (result.status == 200) {
                  this.CreateLogs(
                    'Delete',
                    formatedTimestamp(),
                    16,
                    id,
                    this.user,
                    13
                  );

                  let row = document.getElementById('backup-op-' + id);
                  if (row != null) {
                    $('#table_backup_op').DataTable().row(row).remove();
                    $('#table_backup_op').DataTable().draw();
                    this.backupOperationsList =
                      this.backupOperationsList.filter(
                        (b_op: { id: any }) => b_op.id !== id
                      );
                    document
                      .querySelector('.backupLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Backup has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                  }
                } else {
                  document
                    .querySelector('.backupLoad')
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
                document.querySelector('.backupLoad')?.classList.add('d-none');
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
            document.querySelector('.backupLoad')?.classList.add('d-none');
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
  cpuChange(value: any) {
    this.value = value;
  }
  cpuChange2(value: any) {
    this.valuue = value;
  }

  getBackupOperationsList() {
    this.backupOperationsService.getBackupOperationsList().subscribe(
      (result) => {
        this.response = result;
        if (this.response.status == 200) {
          this.backupOperationsList = this.response.data;
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

  getAllServers() {
    this.ServersSercie.getAllServers().subscribe(
      (result) => {
        this.response1 = result;
        if (this.response1.status == 200) {
          this.serversList = this.response1.data;
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

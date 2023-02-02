import { UserslogsService } from 'src/app/Services/userslogs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackupOperationsService } from 'src/app/Services/backup-operations.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
@Component({
  selector: 'app-detailsbackups',
  templateUrl: './detailsbackups.component.html',
  styleUrls: ['./detailsbackups.component.css'],
})
export class DetailsbackupsComponent implements OnInit {
  id: any;
  response: any;
  response1: any;
  response2: any;
  userLogsList: any;
  userLogsList1: any;
  backup: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  backupForm!: FormGroup;
  usr: any;
  user: any;
  submitted = false;
  userLogs: logs = new logs();
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
    private route: ActivatedRoute,
    private backupOperationsService: BackupOperationsService,
    private router: Router,
    private userslogsService: UserslogsService
  ) {
    this.backupForm = this.fb.group({
      id: [''],
      classe: [''],
      end_date: [''],
      layout: ['', Validators.required],
      name: ['', Validators.required],
      run: [''],
      start_date: [''],
      status: ['', Validators.required],
      schedule: [''],
      synchronization: [''],
      target: [''],
      account: this.fb.group({
        id: [''],
      }),
    });
  }
  status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 2 },
    { name: 'In Progress', value: 3 },
  ];
  type = [
    { name: 'Backup', value: 1 },
    { name: 'Provider', value: 2 },
    { name: 'Snapshot', value: 3 },
  ];
  layout = [
    { name: 'all', value: 1 },
    { name: 'Files Backup', value: 2 },
    { name: 'Folders Backup', value: 3 },
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
      pageLength: 5,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    this.id = this.route.snapshot.paramMap.get('id');

    this.getUserLogs();
    this.getBackupByID();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get form() {
    return this.backupForm.controls;
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

  updateBackup(id: any) {
    let data = this.backupForm.value;
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
    document.querySelector('.updateBackLoad')?.classList.remove('d-none');
    this.backupOperationsService.updateBackup(data, id).subscribe(
      (result) => {
        if (result.status == 200 && result.message == 'Nothing was changed!') {
          document.querySelector('.updateBackLoad')?.classList.add('d-none');
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
          this.CreateLogs('Edit', formatedTimestamp(), 16, id, this.user, 14);
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
          document.querySelector('.updateBackLoad')?.classList.add('d-none');
          Toast.fire({
            icon: 'success',
            title: 'Backup updated',
          });
          this.getDiff();
          this.backup.name = data.name;
          this.backup.status = data.status;
          this.backup.layout = data.layout;
        } else {
          document.querySelector('.updateBackLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      },
      (error) => {
        document.querySelector('.updateBackLoad')?.classList.add('d-none');
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
    this.userslogsService.getBackupLogsList(this.id).subscribe(
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
        $('#table_backup_logs')
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
    this.userslogsService.getBackupLogsList(this.id).subscribe(
      (result) => {
        this.response1 = result;
        this.userLogsList = this.response1.data.map((elem: any) => {
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

  getBackupByID() {
    this.backupOperationsService.getBackupByID(this.id).subscribe(
      (result) => {
        this.response = result;
        this.backup = this.response.data;
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
}

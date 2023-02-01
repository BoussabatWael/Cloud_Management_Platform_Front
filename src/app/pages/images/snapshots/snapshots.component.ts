import { BackupInstancesService } from './../../../Services/backup-instances.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
import { UserslogsService } from 'src/app/Services/userslogs.service';
@Component({
  selector: 'app-snapshots',
  templateUrl: './snapshots.component.html',
  styleUrls: ['./snapshots.component.css'],
})
export class SnapshotsComponent implements OnInit {
  searchText: any;
  response: any;
  backupExecutionsList: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usr: any;
  user: any;
  account: any;
  userLogs: logs = new logs();
  userPermission: any;
  usrPer: any;

  constructor(
    private backupInstancesService: BackupInstancesService,
    private router: Router,
    private userslogsService: UserslogsService
  ) {}

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

    this.getBackupExecutionsList();
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

  deleteBackupImage(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this image ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.imageLoad')?.classList.remove('d-none');
        this.backupInstancesService.getBackupInstanceByID(id).subscribe(
          (result) => {
            let backup_img = result.data;
            backup_img.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            backup_img.end_date = formatedTimestamp();
            this.backupInstancesService
              .updateBackupInstance(backup_img, id)
              .subscribe(
                (result) => {
                  if (result.status == 200) {
                    this.CreateLogs(
                      'Delete',
                      formatedTimestamp(),
                      17,
                      id,
                      this.user,
                      15
                    );

                    let row = document.getElementById('backup-img-' + id);
                    if (row != null) {
                      $('#table_backup_img').DataTable().row(row).remove();
                      $('#table_backup_img').DataTable().draw();
                      this.backupExecutionsList =
                        this.backupExecutionsList.filter(
                          (b_img: { id: any }) => b_img.id !== id
                        );
                      document
                        .querySelector('.imageLoad')
                        ?.classList.add('d-none');
                      Swal.fire({
                        title: 'Deleted!',
                        text: 'Image has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#2f49c7',
                      });
                    }
                  } else {
                    document
                      .querySelector('.imageLoad')
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
                  document.querySelector('.imageLoad')?.classList.add('d-none');
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
            document.querySelector('.imageLoad')?.classList.add('d-none');
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

  getBackupExecutionsList() {
    this.backupInstancesService.getBackupInstancesList().subscribe(
      (result) => {
        this.response = result;
        if (this.response.status == 200) {
          this.backupExecutionsList = this.response.data;
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
}

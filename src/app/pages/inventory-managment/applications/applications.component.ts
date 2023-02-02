import { inventory_applications } from './../../../models/inventory_applications';
import { ApplicationVersionsService } from './../../../Services/application-versions.service';
import { ApplicationSourcesService } from './../../../Services/application-sources.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { logs } from 'src/app/models/core_logs';
import { core_users } from 'src/app/models/core_users';

import { ApplicationService } from 'src/app/Services/application.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import Swal from 'sweetalert2';
declare function setP(): any;
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  applicationList: any;
  applicationList1: any;
  response: any;
  response1: any;
  searchText: any;
  p: number = 1;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  activeUser: any;
  value: any;
  usr: any;
  user: any;
  application: inventory_applications = new inventory_applications();
  userLogs: logs = new logs();
  applicationForm!: FormGroup;
  submitted: boolean = false;
  userPermission: any;
  usrPer: any;
  constructor(
    private fb: FormBuilder,
    private applicationsService: ApplicationService,
    private router: Router,
    private userslogsService: UserslogsService,
    private ApplicationSourcesService: ApplicationSourcesService,
    private ApplicationVersionsService: ApplicationVersionsService
  ) {
    this.applicationForm = this.fb.group({
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

  Environment = [
    { name: 'test1', value: 1 },
    { name: 'test2', value: 2 },
    { name: 'test3', value: 3 },
  ];

  classe = [
    { name: 'Website', value: 1 },
    { name: 'Platform', value: 2 },
    { name: 'Tool', value: 3 },
    { name: 'SaaS', value: 4 },
  ];
  status = [
    { name: 'Active ', value: 1 },
    { name: ' In progress', value: 2 },
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
      pageLength: 10,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElement = event?.target?.closest('.btnDeleteAppp');
      if (clickedElement) {
        _this.deleteApplication(clickedElement.dataset.id);
      }
    });

    this.getApplicationList();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    setP();
  }

  get form() {
    return this.applicationForm.controls;
  }
  close() {
    this.applicationForm.reset();
    document.querySelector('.addapp')?.classList.add('d-none');
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

  getDiff() {
    let new_object: any;
    this.applicationsService.getApplicationList().subscribe(
      (result) => {
        this.response1 = result;
        this.applicationList1 = this.response1.data;
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
  file: any;
  imgUrl: any;
  selectImge(event: any) {
    this.file = event.target.files[0];
    let fr = new FileReader();
    fr.readAsDataURL(this.file);
    fr.onload = (event) => (this.imgUrl = fr.result);
  }

  addApplication() {
    let data = this.applicationForm.value;
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
      this.applicationForm.invalid ||
      this.applicationForm.value.length == 0
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
    document.querySelector('.addapp')?.classList.remove('d-none');

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
                  document.querySelector('.addapp')?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'Application Added',
                  });
                  this.close();
                  this.closebutton.nativeElement.click();
                  this.getDiff();
                },
                (error) => {
                  document.querySelector('.addapp')?.classList.add('d-none');
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
              document.querySelector('.addapp')?.classList.add('d-none');
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
          document.querySelector('.addapp')?.classList.add('d-none');
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
                  document.querySelector('.addapp')?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'Application Added',
                  });
                  this.close();
                  this.closebutton.nativeElement.click();
                  this.getDiff();
                },
                (error) => {
                  document.querySelector('.addapp')?.classList.add('d-none');
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
              document.querySelector('.addapp')?.classList.add('d-none');
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
          document.querySelector('.addapp')?.classList.add('d-none');
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
  deleteApplication(id: any) {
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
        document.querySelector('.applicationLoad')?.classList.remove('d-none');
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
                    document
                      .querySelector('.applicationLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Application has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                  }
                } else {
                  document
                    .querySelector('.applicationLoad')
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
                  .querySelector('.applicationLoad')
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
            document.querySelector('.applicationLoad')?.classList.add('d-none');
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

  cpuchange(value: any) {
    this.value = value;
  }

  getApplicationList() {
    this.applicationsService.getApplicationList().subscribe(
      (result) => {
        this.response = result;
        this.applicationList = this.response.data;
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

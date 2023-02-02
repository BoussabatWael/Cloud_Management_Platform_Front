import { ApplicationSourcesService } from './../../Services/application-sources.service';
import { ApplicationService } from 'src/app/Services/application.service';
import { ServerService } from 'src/app/Services/server.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationInstancesService } from './../../Services/application-instances.service';
import Swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
import { UserslogsService } from 'src/app/Services/userslogs.service';
declare function setP(): any;
@Component({
  selector: 'app-deployments',
  templateUrl: './deployments.component.html',
  styleUrls: ['./deployments.component.css'],
})
export class DeploymentsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  valuee: any;
  affiche2: any;
  deploymentsList: any;
  deploymentsList1: any;
  serversList: any;
  applicationList: any;
  response: any;
  response1: any;
  response2: any;
  response3: any;
  usr: any;
  user: any;
  deploymentForm!: FormGroup;
  userLogs: logs = new logs();
  userPermission: any;
  usrPer: any;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private applicationInstancesService: ApplicationInstancesService,
    private router: Router,
    private userslogsService: UserslogsService,
    private ServersSercie: ServerService,
    private applicationsService: ApplicationService,
    private ApplicationSourcesService: ApplicationSourcesService
  ) {
    this.deploymentForm = this.fb.group({
      type: ['', Validators.required],
      source_type: [''],
      name: [''],
      source_url: [''],
      application: this.fb.group({
        id: [''],
      }),
      instance: this.fb.group({
        id: ['', Validators.required],
      }),
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
      let clickedElement = event?.target?.closest('.btnDelDeployment');
      if (clickedElement) {
        _this.deleteDeployment(clickedElement.dataset.id);
      }
    });
    this.getAllServers();
    this.getDeploymentsList();
  }

  ngAfterViewInit() {
    setP();
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

  get depform() {
    return this.deploymentForm.controls;
  }
  close() {
    this.deploymentForm.reset();
    document.querySelector('.adddeployment')?.classList.add('d-none');
  }

  getDiff() {
    let new_object: any = '';
    this.applicationInstancesService.getApplicationInstancesList().subscribe(
      (result) => {
        this.response3 = result;
        this.deploymentsList1 = this.response3.data;
        for (let key in this.deploymentsList1) {
          if (
            JSON.stringify(this.deploymentsList1[key]) ===
            JSON.stringify(this.deploymentsList[key])
          ) {
            continue;
          } else {
            new_object = this.deploymentsList1[key];
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

        if (this.usrPer.deployments.includes('delete') == true) {
          new_object.actions = `<a class="btn btn-sm btn-soft-danger btnDelDeployment" data-id="${new_object?.id}" (click)="deleteDeployment(deployment?.id)"
                          type="button" placement="top" ngbTooltip="Delete" >
                          <i class="mdi mdi-delete font-size-16"></i>
                        </a>`;
        } else {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">---</div>`;
        }
        $('#table_deployment')
          .DataTable()
          .row.add([
            new_object?.id,
            new_object?.instance.name,
            new_object?.application.name,
            new_object?.status,
            new_object?.actions,
          ])
          .draw();
        //@ts-ignore
        $('#table_deployment').DataTable().row(':last').node().id =
          'deployment-' + new_object?.id;
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

  addDeployment() {
    let data = this.deploymentForm.value;

    const formatedTimestamp = () => {
      const d = new Date();
      const date = d.toISOString().split('T')[0];
      const time = d.toTimeString().split(' ')[0];
      return `${date} ${time}`;
    };
    if (data.type == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Type is required!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    if (this.deploymentForm.invalid || this.deploymentForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.adddeployment')?.classList.remove('d-none');

    if (data.type == 'git') {
      data.status = 1;
      data.classe = 1;
      data.environment = 1;
      data.account = this.user.account;
      this.applicationsService.addApplication(data).subscribe(
        (result) => {
          let new_app = result.data;
          this.CreateLogs(
            'Create',
            formatedTimestamp(),
            12,
            new_app?.id,
            this.user,
            6
          );

          let app_src = data;
          app_src.source_type = 1;
          app_src.application = new_app;
          this.ApplicationSourcesService.addApplicationSources(
            app_src
          ).subscribe(
            (result1) => {
              let new_app_src = result1.data;
              this.CreateLogs(
                'Create',
                formatedTimestamp(),
                15,
                new_app_src?.id,
                this.user,
                6
              );

              let app_ins = data;
              app_ins.application = new_app;
              this.applicationInstancesService
                .saveApplicationInstance(app_ins)
                .subscribe(
                  (result2) => {
                    let new_app_ins = result2.data;
                    this.CreateLogs(
                      'Create',
                      formatedTimestamp(),
                      14,
                      new_app_ins?.id,
                      this.user,
                      6
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
                      .querySelector('.adddeployment')
                      ?.classList.add('d-none');
                    Toast.fire({
                      icon: 'success',
                      title: 'Deployment Added',
                    });
                    this.close();
                    this.closebutton.nativeElement.click();
                    this.getDiff();
                  },
                  (error) => {
                    document
                      .querySelector('.adddeployment')
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
              document.querySelector('.adddeployment')?.classList.add('d-none');
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
          document.querySelector('.adddeployment')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else if (data.type == 'file') {
      data.status = 1;
      data.classe = 1;
      data.environment = 1;
      data.account = this.user.account;
      this.applicationsService.addApplication(data).subscribe(
        (result) => {
          let new_app = result.data;
          this.CreateLogs(
            'Create',
            formatedTimestamp(),
            12,
            new_app?.id,
            this.user,
            6
          );

          let app_src = data;
          app_src.source_type = 3;
          app_src.application = new_app;
          this.ApplicationSourcesService.addApplicationSources(
            app_src
          ).subscribe(
            (result1) => {
              let new_app_src = result1.data;
              this.CreateLogs(
                'Create',
                formatedTimestamp(),
                15,
                new_app_src?.id,
                this.user,
                6
              );

              let app_ins = data;
              app_ins.application = new_app;
              this.applicationInstancesService
                .saveApplicationInstance(app_ins)
                .subscribe(
                  (result2) => {
                    let new_app_ins = result2.data;
                    this.CreateLogs(
                      'Create',
                      formatedTimestamp(),
                      14,
                      new_app_ins?.id,
                      this.user,
                      6
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
                      .querySelector('.adddeployment')
                      ?.classList.add('d-none');
                    Toast.fire({
                      icon: 'success',
                      title: 'Deployment Added',
                    });
                    this.close();
                    this.closebutton.nativeElement.click();
                    this.getDiff();
                  },
                  (error) => {
                    document
                      .querySelector('.adddeployment')
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
              document.querySelector('.adddeployment')?.classList.add('d-none');
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
          document.querySelector('.adddeployment')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else {
      data.status = 1;
      this.applicationInstancesService.saveApplicationInstance(data).subscribe(
        (result) => {
          let new_app_ins = result.data;
          this.CreateLogs(
            'Create',
            formatedTimestamp(),
            14,
            new_app_ins?.id,
            this.user,
            6
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
          document.querySelector('.adddeployment')?.classList.add('d-none');
          Toast.fire({
            icon: 'success',
            title: 'Deployment Added',
          });
          this.close();
          this.closebutton.nativeElement.click();
          this.getDiff();
        },
        (error) => {
          document.querySelector('.adddeployment')?.classList.add('d-none');
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

  deleteDeployment(id: any) {
    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't to delete this deployment ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.deploymentLoad')?.classList.remove('d-none');
        this.applicationInstancesService
          .getApplicationInstanceByID(id)
          .subscribe(
            (result) => {
              let app_ins = result.data;
              app_ins.status = 4;
              const formatedTimestamp = () => {
                const d = new Date();
                const date = d.toISOString().split('T')[0];
                const time = d.toTimeString().split(' ')[0];
                return `${date} ${time}`;
              };
              app_ins.end_date = formatedTimestamp();
              this.applicationInstancesService
                .updateApplicationInstance(app_ins, id)
                .subscribe(
                  (result) => {
                    if (result.status == 200) {
                      this.CreateLogs(
                        'Delete',
                        formatedTimestamp(),
                        14,
                        id,
                        this.user,
                        6
                      );

                      let row = document.getElementById('deployment-' + id);
                      if (row != null) {
                        $('#table_deployment').DataTable().row(row).remove();
                        $('#table_deployment').DataTable().draw();
                        this.deploymentsList = this.deploymentsList.filter(
                          (d: { id: any }) => d.id !== id
                        );
                        document
                          .querySelector('.deploymentLoad')
                          ?.classList.add('d-none');
                        Swal.fire({
                          title: 'Deleted!',
                          text: 'Deployment has been deleted.',
                          icon: 'success',
                          confirmButtonColor: '#2f49c7',
                        });
                      }
                    } else {
                      document
                        .querySelector('.deploymentLoad')
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
                      .querySelector('.deploymentLoad')
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
                .querySelector('.deploymentLoad')
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
  displayStyle = 'none';
  closePopup() {
    this.displayStyle = 'none';
  }
  cpuChange(valuee: any) {
    this.valuee = valuee;
  }

  getSelectedSkill(event: any) {
    this.affiche2 = true;
  }

  getDeploymentsList() {
    this.applicationInstancesService.getApplicationInstancesList().subscribe(
      (result) => {
        this.response = result;
        this.deploymentsList = this.response.data;
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

  getApplicationList() {
    this.applicationInstancesService.getApplicationInstancesList().subscribe(
      (result) => {
        let res: any;
        res = result;
        let deploymentList = res.data;

        this.applicationsService.getApplicationList().subscribe(
          (result1) => {
            let res1: any;
            res1 = result1;
            if (res1.status == 200) {
              if (deploymentList.length !== 0) {
                for (let i = 0; i < deploymentList.length; i++) {
                  res1.data = res1.data.filter(
                    (app: { id: any }) =>
                      app?.id !== deploymentList[i].application.id
                  );
                  this.applicationList = res1.data;
                }
              } else {
                this.applicationList = res1.data;
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

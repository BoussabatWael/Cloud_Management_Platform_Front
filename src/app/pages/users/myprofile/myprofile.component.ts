import { core_users } from './../../../models/core_users';
import { UsersSecurityService } from 'src/app/Services/users-security.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreModulesService } from 'src/app/Services/core-modules.service';
import { UserModulesService } from 'src/app/Services/user-modules.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import { logs } from 'src/app/models/core_logs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css'],
})
export class MyprofileComponent implements OnInit {
  response: any;
  response1: any;
  response2: any;
  usr: any;
  user: any;
  userSecurity: any;
  userModule: any;
  Module: any;
  userForm!: FormGroup;
  acc: any;
  userLogsList: any[] = [];
  userLogsList1: any[] = [];
  hasChange: boolean = false;
  submitted: boolean = false;
  modulesList: any;
  searchText: any;
  searchText2: any;
  p2: number = 1;
  p: number = 1;
  userLogs: logs = new logs();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
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
    22: 'Module',
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
  status = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 2 },
    { name: 'In Progress', value: 3 },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersSecurityService: UsersSecurityService,
    private usersService: UserService,
    private userslogsService: UserslogsService,
    private moduleService: CoreModulesService,
    private userModulesService: UserModulesService
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('user') === null) {
      this.router.navigateByUrl('');
    }

    this.usr = localStorage.getItem('user');
    this.user = JSON.parse(this.usr);

    this.dtOptions = {
      lengthMenu: [5, 10, 20, 50, 100],
      pageLength: 5,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    this.getUserLogs();
    this.getUserModulesList();
    this.getUserSecurity();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  get userform() {
    return this.userForm.controls;
  }

  change(module: any, id: any) {
    document.querySelector('.updateProfileLoad')?.classList.remove('d-none');
    if (module.status == 1) {
      module.status = 2;
      this.moduleService.updateModule(module, id).subscribe(
        (result) => {
          if (
            result.status == 200 &&
            result.message == 'Nothing was changed!'
          ) {
            document
              .querySelector('.updateProfileLoad')
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
            this.CreateLogs(
              'Deactivate',
              formatedTimestamp(),
              22,
              id,
              this.user,
              1
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
              .querySelector('.updateProfileLoad')
              ?.classList.add('d-none');
            Toast.fire({
              icon: 'success',
              title: 'Module updated',
            });
            this.getDiff();
            this.getUserModulesList();
          } else {
            document
              .querySelector('.updateProfileLoad')
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
          document.querySelector('.updateProfileLoad')?.classList.add('d-none');
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#2f49c7',
          });
        }
      );
    } else {
      module.status = 1;
      this.moduleService.updateModule(module, id).subscribe(
        (result) => {
          if (
            result.status == 200 &&
            result.message == 'Nothing was changed!'
          ) {
            document
              .querySelector('.updateProfileLoad')
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
            this.CreateLogs(
              'Activate',
              formatedTimestamp(),
              22,
              id,
              this.user,
              1
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
              .querySelector('.updateProfileLoad')
              ?.classList.add('d-none');
            Toast.fire({
              icon: 'success',
              title: 'Module updated',
            });
            this.getDiff();
            this.getUserModulesList();
          } else {
            document
              .querySelector('.updateProfileLoad')
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
          document.querySelector('.updateProfileLoad')?.classList.add('d-none');
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
  getUserModulesList() {
    this.moduleService.getAllModules().subscribe(
      (result) => {
        this.response = result;
        this.modulesList = this.response.data;
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

  getUserSecurity() {
    this.usersSecurityService.getUserSecurityByUserId(this.user.id).subscribe(
      (result) => {
        this.userSecurity = result.data;
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

  UpdateUser(id: any) {
    let data = this.userForm.value;
    if (this.userForm.invalid || this.userForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.updateProfileLoad')?.classList.remove('d-none');
    if (
      data.firstname == this.user.firstname &&
      data.lastname == this.user.lastname &&
      data.login == this.userSecurity.login &&
      data.password == this.userSecurity.password
    ) {
      document.querySelector('.updateProfileLoad')?.classList.add('d-none');
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
    } else {
      if (
        (data.firstname !== this.user.firstname ||
          data.lastname !== this.user.lastname) &&
        data.login == this.userSecurity.login &&
        data.password == this.userSecurity.password
      ) {
        this.usersService.updateUser(data, id).subscribe(
          (result) => {
            if (result.status == 200) {
              const formatedTimestamp = () => {
                const d = new Date();
                const date = d.toISOString().split('T')[0];
                const time = d.toTimeString().split(' ')[0];
                return `${date} ${time}`;
              };
              this.CreateLogs(
                'Edit',
                formatedTimestamp(),
                1,
                this.user.id,
                this.user,
                1
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
                .querySelector('.updateProfileLoad')
                ?.classList.add('d-none');
              Toast.fire({
                icon: 'success',
                title: 'Profile updated!',
              });
              this.user.firstname = data.firstname;
              this.user.lastname = data.lastname;

              localStorage.removeItem('user');
              localStorage.setItem('user', JSON.stringify(this.user));

              window.location.reload();
            } else {
              document
                .querySelector('.updateProfileLoad')
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
              .querySelector('.updateProfileLoad')
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
      if (
        (data.login !== this.userSecurity.login ||
          data.password !== this.userSecurity.password) &&
        data.firstname == this.user.firstname &&
        data.lastname == this.user.lastname
      ) {
        if (data.login !== this.userSecurity.login) {
          this.usersSecurityService.login(data.login).subscribe(
            (result1) => {
              if (result1.status == 200 && result1.data !== null) {
                document
                  .querySelector('.updateProfileLoad')
                  ?.classList.add('d-none');
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Choose another login please !',
                  confirmButtonColor: '#2f49c7',
                });
              } else {
                this.usersSecurityService
                  .updateUserSecurity(data, this.userSecurity.id)
                  .subscribe(
                    (result2) => {
                      if (result2.status == 200) {
                        const formatedTimestamp = () => {
                          const d = new Date();
                          const date = d.toISOString().split('T')[0];
                          const time = d.toTimeString().split(' ')[0];
                          return `${date} ${time}`;
                        };
                        this.CreateLogs(
                          'Edit',
                          formatedTimestamp(),
                          2,
                          this.userSecurity.id,
                          this.user,
                          1
                        );
                        const Toast = Swal.mixin({
                          toast: true,
                          position: 'top-right',
                          showConfirmButton: false,
                          timer: 2500,
                          timerProgressBar: true,
                          didOpen: (toast) => {
                            toast.addEventListener(
                              'mouseenter',
                              Swal.stopTimer
                            );
                            toast.addEventListener(
                              'mouseleave',
                              Swal.resumeTimer
                            );
                          },
                        });
                        document
                          .querySelector('.updateProfileLoad')
                          ?.classList.add('d-none');
                        Toast.fire({
                          icon: 'success',
                          title: 'Profile updated!',
                        });
                        this.getDiff();
                        this.userSecurity.login = data.login;
                        this.userSecurity.password = data.password;
                      } else {
                        document
                          .querySelector('.updateProfileLoad')
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
                        .querySelector('.updateProfileLoad')
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
            },
            (error) => {
              document
                .querySelector('.updateProfileLoad')
                ?.classList.add('d-none');
              Swal.fire({
                title: 'Error!',
                text: 'Something went wrong!',
                icon: 'error',
                confirmButtonColor: '#2f49c7',
              });
            }
          );
        } else {
          this.usersSecurityService
            .updateUserSecurity(data, this.userSecurity.id)
            .subscribe(
              (result3) => {
                if (result3.status == 200) {
                  const formatedTimestamp = () => {
                    const d = new Date();
                    const date = d.toISOString().split('T')[0];
                    const time = d.toTimeString().split(' ')[0];
                    return `${date} ${time}`;
                  };
                  this.CreateLogs(
                    'Edit',
                    formatedTimestamp(),
                    2,
                    this.userSecurity.id,
                    this.user,
                    1
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
                    .querySelector('.updateProfileLoad')
                    ?.classList.add('d-none');
                  Toast.fire({
                    icon: 'success',
                    title: 'Profile updated!',
                  });
                  this.getDiff();
                  this.userSecurity.login = data.login;
                  this.userSecurity.password = data.password;
                } else {
                  document
                    .querySelector('.updateProfileLoad')
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
                  .querySelector('.updateProfileLoad')
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
      }
      if (
        (data.login !== this.userSecurity.login ||
          data.password !== this.userSecurity.password) &&
        (data.firstname !== this.user.firstname ||
          data.lastname !== this.user.lastname)
      ) {
        this.usersService.updateUser(data, id).subscribe(
          (result4) => {
            if (result4.status == 200) {
              const formatedTimestamp = () => {
                const d = new Date();
                const date = d.toISOString().split('T')[0];
                const time = d.toTimeString().split(' ')[0];
                return `${date} ${time}`;
              };
              this.CreateLogs(
                'Edit',
                formatedTimestamp(),
                1,
                this.user.id,
                this.user,
                1
              );
              this.usersSecurityService
                .updateUserSecurity(data, this.userSecurity.id)
                .subscribe(
                  (result) => {
                    if (result.status == 200) {
                      const formatedTimestamp = () => {
                        const d = new Date();
                        const date = d.toISOString().split('T')[0];
                        const time = d.toTimeString().split(' ')[0];
                        return `${date} ${time}`;
                      };
                      this.CreateLogs(
                        'Edit',
                        formatedTimestamp(),
                        2,
                        this.userSecurity.id,
                        this.user,
                        1
                      );
                      const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 2500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer);
                          toast.addEventListener(
                            'mouseleave',
                            Swal.resumeTimer
                          );
                        },
                      });
                      document
                        .querySelector('.updateProfileLoad')
                        ?.classList.add('d-none');
                      Toast.fire({
                        icon: 'success',
                        title: 'Profile updated!',
                      });
                      this.user.firstname = data.firstname;
                      this.user.lastname = data.lastname;
                      this.userSecurity.login = data.login;
                      this.userSecurity.password = data.password;
                      localStorage.removeItem('user');
                      localStorage.setItem('user', JSON.stringify(this.user));

                      window.location.reload();
                    } else {
                      document
                        .querySelector('.updateProfileLoad')
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
                      .querySelector('.updateProfileLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Error!',
                      text: 'Something went wrong!',
                      icon: 'error',
                      confirmButtonColor: '#2f49c7',
                    });
                  }
                );
            } else {
              document
                .querySelector('.updateProfileLoad')
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
              .querySelector('.updateProfileLoad')
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
    }
  }
  getDiff() {
    let new_object: any = '';
    this.userslogsService.getLogsList(this.user.id).subscribe(
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
        $('#table_user_logs')
          .DataTable()
          .row.add([
            new_object?.id,
            new_object?.action,
            new_object?.element,
            new_object?.element_id,
            new_object?.log_date,
            new_object?.source,
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
    this.userslogsService.getLogsList(this.user.id).subscribe(
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
}

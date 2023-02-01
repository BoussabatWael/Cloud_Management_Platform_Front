import { CloudProvidersAccountsService } from './../../../Services/cloud-providers-accounts.service';
import { DomaineNameService } from './../../../Services/domaine-name.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { core_users } from 'src/app/models/core_users';
import { logs } from 'src/app/models/core_logs';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { domain_name } from 'src/app/models/networks_domain_names';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-domain-names',
  templateUrl: './domain-names.component.html',
  styleUrls: ['./domain-names.component.css'],
})
export class DomainNamesComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  searchText: any;
  domainName: any;
  domainName1: any;
  cloudProvidersAccountsList: any;
  response: any;
  response1: any;
  response2: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usr: any;
  user: any;
  account: any;
  userLogs: logs = new logs();
  domainForm!: FormGroup;
  submitted: boolean = false;
  domain: domain_name = new domain_name();
  userPermission: any;
  usrPer: any;

  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private domainNamesService: DomaineNameService,
    private router: Router,
    private userslogsService: UserslogsService,
    private CloudProvidersAccountsService: CloudProvidersAccountsService
  ) {
    this.domainForm = this.fb.group({
      name: ['', Validators.required],
      cloud_provider_account: this.fb.group({
        id: ['', Validators.required],
      }),
      renew_date: [''],
    });
  }
  provider = [
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
      pageLength: 10,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    let _this = this;
    document.addEventListener('click', function (event) {
      // @ts-ignore
      let clickedElement = event?.target?.closest('.btnDelDmn');
      if (clickedElement) {
        _this.deleteDomainName(clickedElement.dataset.id);
      }
    });

    this.getCloudProvidersAccounts();
    this.getDomainNames();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get form() {
    return this.domainForm.controls;
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
    let new_object: any = '';
    this.domainNamesService.getAllDomainNames().subscribe(
      (result) => {
        this.response2 = result;
        this.domainName1 = this.response2.data;
        for (let key in this.domainName1) {
          if (
            JSON.stringify(this.domainName1[key]) ===
            JSON.stringify(this.domainName[key])
          ) {
            continue;
          } else {
            new_object = this.domainName1[key];
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
          this.usrPer.domains.includes('update') == true &&
          this.usrPer.domains.includes('delete') == true
        ) {
          new_object.actions =
            `<div class="d-flex gap-2 justify-content-center">
                        <a *ngIf="this.usrPer.domains.includes('update')==true" class="btn btn-sm btn-soft-primary" placement="top" ngbTooltip="Edit"
                        href="#/domain_names/domain-details/` +
            new_object?.id +
            `">
                        <i class="mdi mdi-pencil font-size-16"></i>
                      </a>
                      <a *ngIf="this.usrPer.domains.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDelDmn" data-id="${new_object?.id}" (click)="deleteDomainName(domain?.id)"
                        type="button" placement="top" ngbTooltip="Delete" >
                        <i class="mdi mdi-delete font-size-16"></i>
                      </a>
                      </div>`;
        } else if (
          this.usrPer.domains.includes('update') == false &&
          this.usrPer.domains.includes('delete') == true
        ) {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">
                      <a *ngIf="this.usrPer.domains.includes('delete')==true" class="btn btn-sm btn-soft-danger btnDelDmn" data-id="${new_object?.id}" (click)="deleteDomainName(domain?.id)"
                        type="button" placement="top" ngbTooltip="Delete" >
                        <i class="mdi mdi-delete font-size-16"></i>
                      </a>
                      </div>`;
        } else if (
          this.usrPer.domains.includes('update') == true &&
          this.usrPer.domains.includes('delete') == false
        ) {
          new_object.actions =
            `<div class="d-flex gap-2 justify-content-center">
                        <a *ngIf="this.usrPer.domains.includes('update')==true" class="btn btn-sm btn-soft-primary" placement="top" ngbTooltip="Edit"
                        href="#/domain_names/domain-details/` +
            new_object?.id +
            `">
                        <i class="mdi mdi-pencil font-size-16"></i>
                      </a>
                      </div>`;
        } else {
          new_object.actions = `<div class="d-flex gap-2 justify-content-center">---</div>`;
        }

        $('#table_domain')
          .DataTable()
          .row.add([
            new_object.id,
            new_object.name,
            new_object.status,
            new_object.actions,
          ])
          .draw();
        //@ts-ignore
        $('#table_domain').DataTable().row(':last').node().id =
          'domain-' + new_object.id;
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

  addDomain() {
    this.domain = this.domainForm.value;
    this.domain.account = this.user.account;
    this.domain.status = 1;
    this.domain.renew_date = this.datepipe.transform(
      this.domainForm.value.renew_date,
      'yyyy-MM-dd HH:mm:ss'
    );

    if (this.domainForm.invalid || this.domainForm.value.length == 0) {
      this.submitted = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fill all information!',
        confirmButtonColor: '#2f49c7',
      });
      return;
    }
    document.querySelector('.adddomain')?.classList.remove('d-none');
    this.domainNamesService.saveDomainNames(this.domain).subscribe(
      (result) => {
        let new_domain = result.data;

        const formatedTimestamp = () => {
          const d = new Date();
          const date = d.toISOString().split('T')[0];
          const time = d.toTimeString().split(' ')[0];
          return `${date} ${time}`;
        };
        this.CreateLogs(
          'Create',
          formatedTimestamp(),
          8,
          new_domain?.id,
          this.user,
          9
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
        document.querySelector('.adddomain')?.classList.add('d-none');
        Toast.fire({
          icon: 'success',
          title: 'Domain Added',
        });
        this.close();
        this.closebutton.nativeElement.click();
        this.getDiff();
      },
      (error) => {
        document.querySelector('.adddomain')?.classList.add('d-none');
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
    this.domainForm.reset();
    document.querySelector('.adddomain')?.classList.add('d-none');
  }

  deleteDomainName(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this domain ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.domainLoad')?.classList.remove('d-none');
        this.domainNamesService.getDomainNamesById(id).subscribe(
          (result) => {
            let domain = result.data;
            domain.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            domain.end_date = formatedTimestamp();
            this.domainNamesService.updateDomainNames(domain, id).subscribe(
              (result) => {
                if (result.status == 200) {
                  this.CreateLogs(
                    'Delete',
                    formatedTimestamp(),
                    8,
                    id,
                    this.user,
                    9
                  );

                  let row = document.getElementById('domain-' + id);
                  if (row != null) {
                    $('#table_domain').DataTable().row(row).remove();
                    $('#table_domain').DataTable().draw();
                    this.domainName = this.domainName.filter(
                      (d: { id: any }) => d.id !== id
                    );
                    document
                      .querySelector('.domainLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Domain has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                  }
                } else {
                  document
                    .querySelector('.domainLoad')
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
                document.querySelector('.domainLoad')?.classList.add('d-none');
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
            document.querySelector('.domainLoad')?.classList.add('d-none');
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

  getDomainNames() {
    this.domainNamesService.getAllDomainNames().subscribe(
      (result) => {
        this.response = result;
        if (this.response.status == 200) {
          this.domainName = this.response.data;
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

  getCloudProvidersAccounts() {
    this.CloudProvidersAccountsService.getCloudProvidersAccountsList().subscribe(
      (result) => {
        this.response1 = result;
        if (this.response1.status == 200) {
          this.cloudProvidersAccountsList = this.response1.data;
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

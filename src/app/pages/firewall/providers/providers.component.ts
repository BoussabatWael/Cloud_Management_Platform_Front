import { CloudProvidersAccountsService } from './../../../Services/cloud-providers-accounts.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { logs } from 'src/app/models/core_logs';
import { core_users } from 'src/app/models/core_users';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css'],
})
export class ProvidersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  response: any;
  CloudProvidersList: any;
  usr: any;
  user: any;
  account: any;
  userLogs: logs = new logs();
  userPermission: any;
  usrPer: any;

  constructor(
    private CloudProvidersAccountsService: CloudProvidersAccountsService,
    private router: Router,
    private userslogsService: UserslogsService
  ) {}
  status = [
    { name: 'Draft', value: 3 },
    { name: 'Active', value: 1 },
    { name: 'In Progress', value: 2 },
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

    this.getProvidersList();

    setTimeout(() => {
      (<any>$('#formapplicationprovider')).steps({
        headerTag: 'h3',
        bodyTag: 'section',
        transitionEffect: 'slide',
        onFinished: function (event: any, currentIndex: any) {
          $('.sub-btn').trigger('click');
        },
      });
    }, 20);

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

  deleteProvider(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this provider ?!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2f49c7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector('.ProvLoad')?.classList.remove('d-none');
        this.CloudProvidersAccountsService.getCloudProviderbyID(id).subscribe(
          (result) => {
            let c_provider = result.data;
            c_provider.status = 4;
            const formatedTimestamp = () => {
              const d = new Date();
              const date = d.toISOString().split('T')[0];
              const time = d.toTimeString().split(' ')[0];
              return `${date} ${time}`;
            };
            c_provider.end_date = formatedTimestamp();
            this.CloudProvidersAccountsService.updateCloudProvider(
              c_provider,
              id
            ).subscribe(
              (result) => {
                if (result.status == 200) {
                  this.CreateLogs(
                    'Delete',
                    formatedTimestamp(),
                    7,
                    id,
                    this.user,
                    4
                  );

                  let row = document.getElementById('prov-' + id);
                  if (row != null) {
                    $('#table_provider').DataTable().row(row).remove();
                    $('#table_provider').DataTable().draw();
                    this.CloudProvidersList = this.CloudProvidersList.filter(
                      (p: { id: any }) => p.id !== id
                    );
                    document
                      .querySelector('.ProvLoad')
                      ?.classList.add('d-none');
                    Swal.fire({
                      title: 'Deleted!',
                      text: 'Provider has been deleted.',
                      icon: 'success',
                      confirmButtonColor: '#2f49c7',
                    });
                  }
                } else {
                  document.querySelector('.ProvLoad')?.classList.add('d-none');
                  Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonColor: '#2f49c7',
                  });
                }
              },
              (error) => {
                document.querySelector('.ProvLoad')?.classList.add('d-none');
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
            document.querySelector('.ProvLoad')?.classList.add('d-none');
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

  getProvidersList() {
    this.CloudProvidersAccountsService.getCloudProvidersAccountsList().subscribe(
      (result) => {
        this.response = result;
        if (this.response.status == 200) {
          this.CloudProvidersList = this.response.data;
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

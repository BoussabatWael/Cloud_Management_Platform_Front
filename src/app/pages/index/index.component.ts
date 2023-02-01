import { BackupOperationsService } from 'src/app/Services/backup-operations.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { InstanceService } from 'src/app/Services/instance.service';
import { UserslogsService } from 'src/app/Services/userslogs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  response: any;
  response1: any;
  response2: any;
  instancesNumber: any;
  instancesList: any;
  backupsNumber: any;
  userLogsList: any[] = [];
  LastActivity: any;
  usr: any;
  user: any;
  account: any;
  ipAddress: any;
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

  constructor(
    private inventoryInstancesService: InstanceService,
    private BackupOperationsService: BackupOperationsService,
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

    this.dtOptions = {
      lengthMenu: [5, 10, 20, 50, 100],
      pageLength: 5,
      autoWidth: true,
      dom: '<"dataTables_filter"f>rt<"bottom"lp><"clear  "i>',
      language: { search: '', searchPlaceholder: 'Search...' },
    };

    this.getUserLogs();
    this.getAllInstances();
    this.getAllBackupExecutions();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getAllInstances() {
    this.inventoryInstancesService.getAllInventoryInstances().subscribe(
      (result) => {
        this.response = result;
        this.instancesList = this.response.data;
        this.instancesNumber = this.response.total;
        this.dtTrigger.next();
      },
      (error) => {
        Swal.fire('Error!', 'Something went wrong!', 'error');
      }
    );
  }

  getAllBackupExecutions() {
    this.BackupOperationsService.getBackupOperationsList().subscribe(
      (result) => {
        this.response1 = result;
        this.backupsNumber = this.response1.total;
      },
      (error) => {
        Swal.fire('Error!', 'Something went wrong!', 'error');
      }
    );
  }

  getUserLogs() {
    this.userslogsService.getLogsList(this.user.id).subscribe(
      (result) => {
        this.response2 = result;
        let userlogs = this.response2.data.map((elem: any) => {
          elem.element = this.elementType[elem.element];
          elem.source = this.sourceType[elem.source];
          return elem;
        });
        this.userLogsList = userlogs.slice(Math.max(userlogs.length - 5, 0));
        this.LastActivity = userlogs.slice(Math.max(userlogs.length - 4, 0));
      },
      (error) => {
        Swal.fire('Error!', 'Something went wrong!', 'error');
      }
    );
  }
}

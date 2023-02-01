import { TestBed } from '@angular/core/testing';

import { BackupInstancesService } from './backup-instances.service';

describe('BackupInstancesService', () => {
  let service: BackupInstancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackupInstancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

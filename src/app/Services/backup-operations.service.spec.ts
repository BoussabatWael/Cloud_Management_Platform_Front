import { TestBed } from '@angular/core/testing';

import { BackupOperationsService } from './backup-operations.service';

describe('BackupOperationsService', () => {
  let service: BackupOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackupOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

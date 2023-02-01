import { TestBed } from '@angular/core/testing';

import { BackupExecutionsService } from './backup-executions.service';

describe('BackupExecutionsService', () => {
  let service: BackupExecutionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackupExecutionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

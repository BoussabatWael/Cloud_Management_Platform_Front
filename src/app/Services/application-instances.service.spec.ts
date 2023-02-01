import { TestBed } from '@angular/core/testing';

import { ApplicationInstancesService } from './application-instances.service';

describe('ApplicationInstancesService', () => {
  let service: ApplicationInstancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationInstancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

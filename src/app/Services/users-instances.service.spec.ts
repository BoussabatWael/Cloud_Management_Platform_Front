import { TestBed } from '@angular/core/testing';

import { UsersInstancesService } from './users-instances.service';

describe('UsersInstancesService', () => {
  let service: UsersInstancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersInstancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

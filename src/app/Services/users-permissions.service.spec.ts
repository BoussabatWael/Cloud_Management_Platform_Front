import { TestBed } from '@angular/core/testing';

import { UsersPermissionsService } from './users-permissions.service';

describe('UsersPermissionsService', () => {
  let service: UsersPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

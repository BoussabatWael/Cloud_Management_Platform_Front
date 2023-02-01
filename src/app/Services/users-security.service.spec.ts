import { TestBed } from '@angular/core/testing';

import { UsersSecurityService } from './users-security.service';

describe('UsersSecurityService', () => {
  let service: UsersSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UserslogsService } from './userslogs.service';

describe('UserslogsService', () => {
  let service: UserslogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserslogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

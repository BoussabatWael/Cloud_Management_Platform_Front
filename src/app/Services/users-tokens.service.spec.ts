import { TestBed } from '@angular/core/testing';

import { UsersTokensService } from './users-tokens.service';

describe('UsersTokensService', () => {
  let service: UsersTokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersTokensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

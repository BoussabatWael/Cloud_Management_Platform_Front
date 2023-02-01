import { TestBed } from '@angular/core/testing';

import { ApplicationVersionsService } from './application-versions.service';

describe('ApplicationVersionsService', () => {
  let service: ApplicationVersionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationVersionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

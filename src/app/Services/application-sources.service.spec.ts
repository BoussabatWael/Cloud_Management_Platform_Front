import { TestBed } from '@angular/core/testing';

import { ApplicationSourcesService } from './application-sources.service';

describe('ApplicationSourcesService', () => {
  let service: ApplicationSourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationSourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ApplicationDependenciesService } from './application-dependencies.service';

describe('ApplicationDependenciesService', () => {
  let service: ApplicationDependenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationDependenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

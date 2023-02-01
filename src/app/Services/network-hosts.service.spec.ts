import { TestBed } from '@angular/core/testing';

import { NetworkHostsService } from './network-hosts.service';

describe('NetworkHostsService', () => {
  let service: NetworkHostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkHostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { InventoryHostsService } from './inventory-hosts.service';

describe('InventoryHostsService', () => {
  let service: InventoryHostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryHostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

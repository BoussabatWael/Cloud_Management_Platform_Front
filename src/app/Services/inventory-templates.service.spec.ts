import { TestBed } from '@angular/core/testing';

import { InventoryTemplatesService } from './inventory-templates.service';

describe('InventoryTemplatesService', () => {
  let service: InventoryTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

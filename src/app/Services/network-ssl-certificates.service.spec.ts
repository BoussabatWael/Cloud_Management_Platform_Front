import { TestBed } from '@angular/core/testing';

import { NetworkSslCertificatesService } from './network-ssl-certificates.service';

describe('NetworkSslCertificatesService', () => {
  let service: NetworkSslCertificatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkSslCertificatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

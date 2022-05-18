import { TestBed } from '@angular/core/testing';

import { ReqResService } from './req-res.service';

describe('ReqResService', () => {
  let service: ReqResService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReqResService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

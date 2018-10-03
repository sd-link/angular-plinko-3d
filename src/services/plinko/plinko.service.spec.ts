import { TestBed, inject } from '@angular/core/testing';

import { PlinkoService } from './plinko.service';

describe('BitRocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlinkoService]
    });
  });

  it('should be created', inject([PlinkoService], (service: PlinkoService) => {
    expect(service).toBeTruthy();
  }));
});

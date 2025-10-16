import { TestBed } from '@angular/core/testing';

import { ImageSearchServiceService } from './image-search-service.service';

describe('ImageSearchServiceService', () => {
  let service: ImageSearchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageSearchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

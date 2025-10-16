import { TestBed } from '@angular/core/testing';

import { AntecedenteAssociativaDelituosasService } from './antecedente-associativa-delituosas.service';

describe('AntecedenteAssociativaDelituosasService', () => {
  let service: AntecedenteAssociativaDelituosasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntecedenteAssociativaDelituosasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

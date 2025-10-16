import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribuicaoPorOrgaoComponent } from './distribuicao-por-orgao.component';

describe('DistribuicaoPorOrgaoComponent', () => {
  let component: DistribuicaoPorOrgaoComponent;
  let fixture: ComponentFixture<DistribuicaoPorOrgaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistribuicaoPorOrgaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistribuicaoPorOrgaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

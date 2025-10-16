import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoDecisaoTribunalComponent } from './registo-decisao-tribunal.component';

describe('RegistoDecisaoTribunalComponent', () => {
  let component: RegistoDecisaoTribunalComponent;
  let fixture: ComponentFixture<RegistoDecisaoTribunalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoDecisaoTribunalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoDecisaoTribunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

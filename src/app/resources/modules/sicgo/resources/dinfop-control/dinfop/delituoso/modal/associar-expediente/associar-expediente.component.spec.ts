import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociarExpedienteComponent } from './associar-expediente.component';

describe('AssociarExpedienteComponent', () => {
  let component: AssociarExpedienteComponent;
  let fixture: ComponentFixture<AssociarExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociarExpedienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociarExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

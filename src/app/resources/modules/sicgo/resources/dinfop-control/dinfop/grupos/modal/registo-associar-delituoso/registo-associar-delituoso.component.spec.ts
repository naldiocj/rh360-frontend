import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoAssociarDelituosoComponent } from './registo-associar-delituoso.component';

describe('RegistoAssociarDelituosoComponent', () => {
  let component: RegistoAssociarDelituosoComponent;
  let fixture: ComponentFixture<RegistoAssociarDelituosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistoAssociarDelituosoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistoAssociarDelituosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoriosGeradosComponent } from './relatorios-gerados.component';

describe('RelatoriosGeradosComponent', () => {
  let component: RelatoriosGeradosComponent;
  let fixture: ComponentFixture<RelatoriosGeradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatoriosGeradosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatoriosGeradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefiaExpedientesComponent } from './chefia-expedientes.component';

describe('ChefiaExpedientesComponent', () => {
  let component: ChefiaExpedientesComponent;
  let fixture: ComponentFixture<ChefiaExpedientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefiaExpedientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefiaExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

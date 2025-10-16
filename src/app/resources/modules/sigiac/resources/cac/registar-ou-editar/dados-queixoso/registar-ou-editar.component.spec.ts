import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosQueixosoComponent } from './registar-ou-editar.component';

describe('DadosQueixosoComponent', () => {
  let component: DadosQueixosoComponent;
  let fixture: ComponentFixture<DadosQueixosoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosQueixosoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosQueixosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

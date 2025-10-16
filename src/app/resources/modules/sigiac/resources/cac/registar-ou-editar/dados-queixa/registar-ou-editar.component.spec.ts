import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosQueixaComponent } from './registar-ou-editar.component';

describe('DadosQueixaComponent', () => {
  let component: DadosQueixaComponent;
  let fixture: ComponentFixture<DadosQueixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosQueixaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosQueixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

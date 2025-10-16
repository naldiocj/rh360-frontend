import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarQrComponent } from './listar-qr.component';

describe('ListarQrComponent', () => {
  let component: ListarQrComponent;
  let fixture: ComponentFixture<ListarQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

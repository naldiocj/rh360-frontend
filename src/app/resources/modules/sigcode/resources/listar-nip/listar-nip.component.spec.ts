import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNipComponent } from './listar-nip.component';

describe('ListarNipComponent', () => {
  let component: ListarNipComponent;
  let fixture: ComponentFixture<ListarNipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarNipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarNipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

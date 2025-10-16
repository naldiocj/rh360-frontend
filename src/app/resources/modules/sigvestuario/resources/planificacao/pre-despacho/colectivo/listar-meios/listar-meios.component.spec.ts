import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMeiosComponent } from './listar-meios.component';

describe('ListarMeiosComponent', () => {
  let component: ListarMeiosComponent;
  let fixture: ComponentFixture<ListarMeiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarMeiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarMeiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

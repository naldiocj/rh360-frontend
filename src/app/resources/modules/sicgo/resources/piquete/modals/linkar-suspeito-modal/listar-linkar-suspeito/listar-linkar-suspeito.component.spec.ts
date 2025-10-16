import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLinkarSuspeitoComponent } from './listar-linkar-suspeito.component';

describe('ListarLinkarSuspeitoComponent', () => {
  let component: ListarLinkarSuspeitoComponent;
  let fixture: ComponentFixture<ListarLinkarSuspeitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarLinkarSuspeitoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarLinkarSuspeitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

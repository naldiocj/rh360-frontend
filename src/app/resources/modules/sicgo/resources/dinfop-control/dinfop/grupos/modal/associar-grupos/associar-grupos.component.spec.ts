import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociarGruposComponent } from './associar-grupos.component';

describe('AssociarGruposComponent', () => {
  let component: AssociarGruposComponent;
  let fixture: ComponentFixture<AssociarGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociarGruposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociarGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

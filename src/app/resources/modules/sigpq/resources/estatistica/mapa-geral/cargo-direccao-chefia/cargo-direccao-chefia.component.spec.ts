import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoDireccaoChefiaComponent } from './cargo-direccao-chefia.component';

describe('CargoDireccaoChefiaComponent', () => {
  let component: CargoDireccaoChefiaComponent;
  let fixture: ComponentFixture<CargoDireccaoChefiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargoDireccaoChefiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoDireccaoChefiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

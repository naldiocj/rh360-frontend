import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodebensComponent } from './tipodebens.component';

describe('TipodebensComponent', () => {
  let component: TipodebensComponent;
  let fixture: ComponentFixture<TipodebensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipodebensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipodebensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

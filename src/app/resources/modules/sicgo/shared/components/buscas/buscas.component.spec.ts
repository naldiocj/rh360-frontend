import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscasComponent } from './buscas.component';

describe('BuscasComponent', () => {
  let component: BuscasComponent;
  let fixture: ComponentFixture<BuscasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

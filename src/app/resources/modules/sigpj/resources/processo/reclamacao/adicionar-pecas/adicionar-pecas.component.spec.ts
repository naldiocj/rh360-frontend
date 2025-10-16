import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarPecasComponent } from './adicionar-pecas.component';

describe('AdicionarPecasComponent', () => {
  let component: AdicionarPecasComponent;
  let fixture: ComponentFixture<AdicionarPecasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdicionarPecasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarPecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

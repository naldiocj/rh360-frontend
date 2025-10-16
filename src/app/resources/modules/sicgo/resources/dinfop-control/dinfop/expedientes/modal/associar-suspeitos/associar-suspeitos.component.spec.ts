import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociarSuspeitosComponent } from './associar-suspeitos.component';

describe('AssociarSuspeitosComponent', () => {
  let component: AssociarSuspeitosComponent;
  let fixture: ComponentFixture<AssociarSuspeitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociarSuspeitosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociarSuspeitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

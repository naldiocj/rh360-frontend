import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkarSuspeitoModalComponent } from './linkar-suspeito-modal.component';

describe('LinkarSuspeitoModalComponent', () => {
  let component: LinkarSuspeitoModalComponent;
  let fixture: ComponentFixture<LinkarSuspeitoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkarSuspeitoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkarSuspeitoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

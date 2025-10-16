import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestemunhaComponent } from './testemunha.component';

describe('TestemunhaComponent', () => {
  let component: TestemunhaComponent;
  let fixture: ComponentFixture<TestemunhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestemunhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestemunhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

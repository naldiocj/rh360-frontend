import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NipListComponent } from './nip-list.component';

describe('NipListComponent', () => {
  let component: NipListComponent;
  let fixture: ComponentFixture<NipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NipListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

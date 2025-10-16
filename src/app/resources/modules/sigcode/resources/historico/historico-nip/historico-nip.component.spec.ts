import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoNipComponent } from './historico-nip.component';

describe('HistoricoNipComponent', () => {
  let component: HistoricoNipComponent;
  let fixture: ComponentFixture<HistoricoNipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoNipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoNipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

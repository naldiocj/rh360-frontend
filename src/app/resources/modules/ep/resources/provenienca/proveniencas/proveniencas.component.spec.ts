import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveniencasComponent } from './proveniencas.component';

describe('ProveniencasComponent', () => {
  let component: ProveniencasComponent;
  let fixture: ComponentFixture<ProveniencasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveniencasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveniencasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

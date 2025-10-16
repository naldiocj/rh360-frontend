import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDinfopComponent } from './menu-dinfop.component';

describe('MenuDinfopComponent', () => {
  let component: MenuDinfopComponent;
  let fixture: ComponentFixture<MenuDinfopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuDinfopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDinfopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

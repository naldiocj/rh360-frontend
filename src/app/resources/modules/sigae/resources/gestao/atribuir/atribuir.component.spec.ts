import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AtribuirComponent } from "./atribuir.component";

describe("AtribuirComponent", () => {
  let component: AtribuirComponent;
  let fixture: ComponentFixture<AtribuirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtribuirComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AtribuirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

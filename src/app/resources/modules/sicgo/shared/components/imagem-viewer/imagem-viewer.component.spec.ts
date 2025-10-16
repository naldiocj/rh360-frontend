import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemViewerComponent } from './imagem-viewer.component';

describe('ImagemViewerComponent', () => {
  let component: ImagemViewerComponent;
  let fixture: ComponentFixture<ImagemViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagemViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagemViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCauHinhDongBoComponent } from './update-cau-hinh-dong-bo.component';

describe('UpdateCauHinhDongBoComponent', () => {
  let component: UpdateCauHinhDongBoComponent;
  let fixture: ComponentFixture<UpdateCauHinhDongBoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCauHinhDongBoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCauHinhDongBoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

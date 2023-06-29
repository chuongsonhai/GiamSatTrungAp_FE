import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauHinhDongBoComponent } from './cau-hinh-dong-bo.component';

describe('CauHinhDongBoComponent', () => {
  let component: CauHinhDongBoComponent;
  let fixture: ComponentFixture<CauHinhDongBoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauHinhDongBoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauHinhDongBoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

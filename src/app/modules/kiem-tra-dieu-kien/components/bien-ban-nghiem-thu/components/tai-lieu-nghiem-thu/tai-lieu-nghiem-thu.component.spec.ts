import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaiLieuNghiemThuComponent } from './tai-lieu-nghiem-thu.component';

describe('TaiLieuNghiemThuComponent', () => {
  let component: TaiLieuNghiemThuComponent;
  let fixture: ComponentFixture<TaiLieuNghiemThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaiLieuNghiemThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaiLieuNghiemThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

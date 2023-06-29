import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaiLieuNghiemThuComponent } from './update-tai-lieu-nghiem-thu.component';

describe('UpdateTaiLieuNghiemThuComponent', () => {
  let component: UpdateTaiLieuNghiemThuComponent;
  let fixture: ComponentFixture<UpdateTaiLieuNghiemThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTaiLieuNghiemThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaiLieuNghiemThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

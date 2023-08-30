import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietKhaoSatKhachHangComponent } from './chi-tiet-khao-sat-khach-hang.component';

describe('ChiTietKhaoSatKhachHangComponent', () => {
  let component: ChiTietKhaoSatKhachHangComponent;
  let fixture: ComponentFixture<ChiTietKhaoSatKhachHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietKhaoSatKhachHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietKhaoSatKhachHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

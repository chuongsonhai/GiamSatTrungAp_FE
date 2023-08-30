import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopKhaoSatKhachHangComponent } from './tong-hop-khao-sat-khach-hang.component';

describe('TongHopKhaoSatKhachHangComponent', () => {
  let component: TongHopKhaoSatKhachHangComponent;
  let fixture: ComponentFixture<TongHopKhaoSatKhachHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopKhaoSatKhachHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopKhaoSatKhachHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

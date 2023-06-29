import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoChiTietThangComponent } from './bao-cao-chi-tiet-thang.component';

describe('BaoCaoChiTietThangComponent', () => {
  let component: BaoCaoChiTietThangComponent;
  let fixture: ComponentFixture<BaoCaoChiTietThangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoChiTietThangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoChiTietThangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

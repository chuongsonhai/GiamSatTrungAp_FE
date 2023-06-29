import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinKhachHangComponent } from './thong-tin-khach-hang.component';

describe('ThongTinKhachHangComponent', () => {
  let component: ThongTinKhachHangComponent;
  let fixture: ComponentFixture<ThongTinKhachHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinKhachHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinKhachHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

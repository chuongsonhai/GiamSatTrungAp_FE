import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsKhachHangComponent } from './ds-khach-hang.component';

describe('DsKhachHangComponent', () => {
  let component: DsKhachHangComponent;
  let fixture: ComponentFixture<DsKhachHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsKhachHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsKhachHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

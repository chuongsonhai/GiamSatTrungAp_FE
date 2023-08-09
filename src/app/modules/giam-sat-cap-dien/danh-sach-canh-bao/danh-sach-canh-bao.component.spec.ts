import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachCanhBaoComponent } from './danh-sach-canh-bao.component';

describe('DanhSachCanhBaoComponent', () => {
  let component: DanhSachCanhBaoComponent;
  let fixture: ComponentFixture<DanhSachCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

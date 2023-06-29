import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBienBanNghiemThuComponent } from './list-bien-ban-nghiem-thu.component';

describe('ListBienBanNghiemThuComponent', () => {
  let component: ListBienBanNghiemThuComponent;
  let fixture: ComponentFixture<ListBienBanNghiemThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBienBanNghiemThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBienBanNghiemThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

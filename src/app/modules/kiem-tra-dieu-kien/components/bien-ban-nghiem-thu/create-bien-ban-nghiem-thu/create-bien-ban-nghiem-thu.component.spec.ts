import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBienBanNghiemThuComponent } from './create-bien-ban-nghiem-thu.component';

describe('CreateBienBanNghiemThuComponent', () => {
  let component: CreateBienBanNghiemThuComponent;
  let fixture: ComponentFixture<CreateBienBanNghiemThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBienBanNghiemThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBienBanNghiemThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

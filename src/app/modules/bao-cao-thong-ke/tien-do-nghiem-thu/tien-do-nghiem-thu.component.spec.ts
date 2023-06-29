import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TienDoNghiemThuComponent } from './tien-do-nghiem-thu.component';

describe('TienDoNghiemThuComponent', () => {
  let component: TienDoNghiemThuComponent;
  let fixture: ComponentFixture<TienDoNghiemThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TienDoNghiemThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TienDoNghiemThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

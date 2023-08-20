import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauHinhNhanCanhBaoComponent } from './cau-hinh-nhan-canh-bao.component';

describe('CauHinhNhanCanhBaoComponent', () => {
  let component: CauHinhNhanCanhBaoComponent;
  let fixture: ComponentFixture<CauHinhNhanCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauHinhNhanCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauHinhNhanCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

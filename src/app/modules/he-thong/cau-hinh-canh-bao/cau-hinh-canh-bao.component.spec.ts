import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauHinhCanhBaoComponent } from './cau-hinh-canh-bao.component';

describe('CauHinhCanhBaoComponent', () => {
  let component: CauHinhCanhBaoComponent;
  let fixture: ComponentFixture<CauHinhCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauHinhCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauHinhCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

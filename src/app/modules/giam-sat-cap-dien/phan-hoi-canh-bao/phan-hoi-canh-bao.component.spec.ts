import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhanHoiCanhBaoComponent } from './phan-hoi-canh-bao.component';

describe('PhanHoiCanhBaoComponent', () => {
  let component: PhanHoiCanhBaoComponent;
  let fixture: ComponentFixture<PhanHoiCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhanHoiCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhanHoiCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

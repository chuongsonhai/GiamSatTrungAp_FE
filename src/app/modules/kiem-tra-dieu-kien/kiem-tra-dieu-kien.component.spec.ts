import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiemTraDieuKienComponent } from './kiem-tra-dieu-kien.component';

describe('KiemTraDieuKienComponent', () => {
  let component: KiemTraDieuKienComponent;
  let fixture: ComponentFixture<KiemTraDieuKienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiemTraDieuKienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KiemTraDieuKienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

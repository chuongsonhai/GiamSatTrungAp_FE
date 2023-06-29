import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaiLieuKiemTraComponent } from './tai-lieu-kiem-tra.component';

describe('TaiLieuKiemTraComponent', () => {
  let component: TaiLieuKiemTraComponent;
  let fixture: ComponentFixture<TaiLieuKiemTraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaiLieuKiemTraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaiLieuKiemTraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

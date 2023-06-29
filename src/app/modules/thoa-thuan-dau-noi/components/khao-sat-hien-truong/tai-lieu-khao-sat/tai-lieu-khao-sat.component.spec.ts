import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaiLieuKhaoSatComponent } from './tai-lieu-khao-sat.component';

describe('TaiLieuKhaoSatComponent', () => {
  let component: TaiLieuKhaoSatComponent;
  let fixture: ComponentFixture<TaiLieuKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaiLieuKhaoSatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaiLieuKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaiLieuKhaoSatComponent } from './update-tai-lieu-khao-sat.component';

describe('UpdateTaiLieuKhaoSatComponent', () => {
  let component: UpdateTaiLieuKhaoSatComponent;
  let fixture: ComponentFixture<UpdateTaiLieuKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTaiLieuKhaoSatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaiLieuKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

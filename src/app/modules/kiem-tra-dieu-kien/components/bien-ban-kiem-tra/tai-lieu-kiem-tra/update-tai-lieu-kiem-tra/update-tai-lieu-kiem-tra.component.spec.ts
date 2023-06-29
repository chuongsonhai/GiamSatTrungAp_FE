import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaiLieuKiemTraComponent } from './update-tai-lieu-kiem-tra.component';

describe('UpdateTaiLieuKiemTraComponent', () => {
  let component: UpdateTaiLieuKiemTraComponent;
  let fixture: ComponentFixture<UpdateTaiLieuKiemTraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTaiLieuKiemTraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaiLieuKiemTraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

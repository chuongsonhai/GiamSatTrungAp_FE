import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCauHinhCanhBaoComponent } from './update-cau-hinh-canh-bao.component';

describe('UpdateCauHinhCanhBaoComponent', () => {
  let component: UpdateCauHinhCanhBaoComponent;
  let fixture: ComponentFixture<UpdateCauHinhCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCauHinhCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCauHinhCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

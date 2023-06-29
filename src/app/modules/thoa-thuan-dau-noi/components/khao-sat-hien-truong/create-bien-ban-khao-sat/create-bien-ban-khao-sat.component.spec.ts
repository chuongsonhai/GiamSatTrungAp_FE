import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBienBanKhaoSatComponent } from './create-bien-ban-khao-sat.component';

describe('CreateBienBanKhaoSatComponent', () => {
  let component: CreateBienBanKhaoSatComponent;
  let fixture: ComponentFixture<CreateBienBanKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBienBanKhaoSatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBienBanKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhaoSatHienTruongComponent } from './khao-sat-hien-truong.component';

describe('KhaoSatHienTruongComponent', () => {
  let component: KhaoSatHienTruongComponent;
  let fixture: ComponentFixture<KhaoSatHienTruongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhaoSatHienTruongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhaoSatHienTruongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

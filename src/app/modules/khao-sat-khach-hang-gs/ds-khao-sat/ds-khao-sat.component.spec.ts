import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsKhaoSatComponent } from './ds-khao-sat.component';

describe('DsKhaoSatComponent', () => {
  let component: DsKhaoSatComponent;
  let fixture: ComponentFixture<DsKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsKhaoSatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

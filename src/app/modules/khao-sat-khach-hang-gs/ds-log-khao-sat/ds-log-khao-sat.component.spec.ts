import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsLogKhaoSatComponent } from './ds-log-khao-sat.component';

describe('DsLogKhaoSatComponent', () => {
  let component: DsLogKhaoSatComponent;
  let fixture: ComponentFixture<DsLogKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsLogKhaoSatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsLogKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietThietBiTreoComponent } from './chi-tiet-thiet-bi-treo.component';

describe('ChiTietThietBiTreoComponent', () => {
  let component: ChiTietThietBiTreoComponent;
  let fixture: ComponentFixture<ChiTietThietBiTreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietThietBiTreoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietThietBiTreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

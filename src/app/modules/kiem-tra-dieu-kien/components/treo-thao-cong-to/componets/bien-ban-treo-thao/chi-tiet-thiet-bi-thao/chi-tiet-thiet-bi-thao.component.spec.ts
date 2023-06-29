import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietThietBiThaoComponent } from './chi-tiet-thiet-bi-thao.component';

describe('ChiTietThietBiThaoComponent', () => {
  let component: ChiTietThietBiThaoComponent;
  let fixture: ComponentFixture<ChiTietThietBiThaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietThietBiThaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietThietBiThaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTcdnQuaHanComponent } from './chi-tiet-tcdn-qua-han.component';

describe('ChiTietTcdnQuaHanComponent', () => {
  let component: ChiTietTcdnQuaHanComponent;
  let fixture: ComponentFixture<ChiTietTcdnQuaHanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTcdnQuaHanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTcdnQuaHanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTcdnComponent } from './chi-tiet-tcdn.component';

describe('ChiTietTcdnComponent', () => {
  let component: ChiTietTcdnComponent;
  let fixture: ComponentFixture<ChiTietTcdnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTcdnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTcdnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

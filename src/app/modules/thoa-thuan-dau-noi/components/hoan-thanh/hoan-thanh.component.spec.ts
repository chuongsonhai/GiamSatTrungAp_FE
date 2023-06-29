import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoanThanhComponent } from './hoan-thanh.component';

describe('HoanThanhComponent', () => {
  let component: HoanThanhComponent;
  let fixture: ComponentFixture<HoanThanhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoanThanhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoanThanhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

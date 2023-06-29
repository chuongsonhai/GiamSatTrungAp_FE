import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeThongComponent } from './he-thong.component';

describe('HeThongComponent', () => {
  let component: HeThongComponent;
  let fixture: ComponentFixture<HeThongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeThongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeThongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

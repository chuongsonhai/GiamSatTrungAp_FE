import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietBiComponent } from './thiet-bi.component';

describe('ThietBiComponent', () => {
  let component: ThietBiComponent;
  let fixture: ComponentFixture<ThietBiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThietBiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

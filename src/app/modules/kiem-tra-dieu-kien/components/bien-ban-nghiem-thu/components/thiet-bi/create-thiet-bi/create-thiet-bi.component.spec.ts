import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThietBiComponent } from './create-thiet-bi.component';

describe('CreateThietBiComponent', () => {
  let component: CreateThietBiComponent;
  let fixture: ComponentFixture<CreateThietBiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateThietBiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateThietBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

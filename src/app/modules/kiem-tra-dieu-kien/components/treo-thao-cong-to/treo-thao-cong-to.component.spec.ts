import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreoThaoCongToComponent } from './treo-thao-cong-to.component';

describe('TreoThaoCongToComponent', () => {
  let component: TreoThaoCongToComponent;
  let fixture: ComponentFixture<TreoThaoCongToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreoThaoCongToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreoThaoCongToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

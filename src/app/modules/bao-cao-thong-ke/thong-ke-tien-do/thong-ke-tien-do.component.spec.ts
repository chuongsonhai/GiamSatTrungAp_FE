import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongKeTienDoComponent } from './thong-ke-tien-do.component';

describe('ThongKeTienDoComponent', () => {
  let component: ThongKeTienDoComponent;
  let fixture: ComponentFixture<ThongKeTienDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongKeTienDoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongKeTienDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

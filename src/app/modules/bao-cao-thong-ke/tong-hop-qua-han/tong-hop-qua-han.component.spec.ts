import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopQuaHanComponent } from './tong-hop-qua-han.component';

describe('TongHopQuaHanComponent', () => {
  let component: TongHopQuaHanComponent;
  let fixture: ComponentFixture<TongHopQuaHanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopQuaHanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopQuaHanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopTcdnComponent } from './tong-hop-tcdn.component';

describe('TongHopTcdnComponent', () => {
  let component: TongHopTcdnComponent;
  let fixture: ComponentFixture<TongHopTcdnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopTcdnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopTcdnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopKetQuaComponent } from './tong-hop-ket-qua.component';

describe('TongHopKetQuaComponent', () => {
  let component: TongHopKetQuaComponent;
  let fixture: ComponentFixture<TongHopKetQuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopKetQuaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopKetQuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

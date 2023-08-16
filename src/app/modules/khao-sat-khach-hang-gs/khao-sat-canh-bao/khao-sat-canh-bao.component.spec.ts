import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhaoSatCanhBaoComponent } from './khao-sat-canh-bao.component';

describe('KhaoSatCanhBaoComponent', () => {
  let component: KhaoSatCanhBaoComponent;
  let fixture: ComponentFixture<KhaoSatCanhBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhaoSatCanhBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhaoSatCanhBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

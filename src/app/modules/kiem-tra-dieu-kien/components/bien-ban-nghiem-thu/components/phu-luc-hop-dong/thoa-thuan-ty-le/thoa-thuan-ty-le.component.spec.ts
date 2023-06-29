import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoaThuanTyLeComponent } from './thoa-thuan-ty-le.component';

describe('ThoaThuanTyLeComponent', () => {
  let component: ThoaThuanTyLeComponent;
  let fixture: ComponentFixture<ThoaThuanTyLeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThoaThuanTyLeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoaThuanTyLeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

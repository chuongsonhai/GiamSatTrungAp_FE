import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiepNhanHoSoComponent } from './tiep-nhan-ho-so.component';

describe('TiepNhanHoSoComponent', () => {
  let component: TiepNhanHoSoComponent;
  let fixture: ComponentFixture<TiepNhanHoSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiepNhanHoSoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiepNhanHoSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

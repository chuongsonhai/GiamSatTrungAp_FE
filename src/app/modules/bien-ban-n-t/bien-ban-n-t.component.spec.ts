import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanNTComponent } from './bien-ban-n-t.component';

describe('BienBanNTComponent', () => {
  let component: BienBanNTComponent;
  let fixture: ComponentFixture<BienBanNTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanNTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanNTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

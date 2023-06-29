import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBienBanTtComponent } from './list-bien-ban-tt.component';

describe('ListBienBanTtComponent', () => {
  let component: ListBienBanTtComponent;
  let fixture: ComponentFixture<ListBienBanTtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBienBanTtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBienBanTtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

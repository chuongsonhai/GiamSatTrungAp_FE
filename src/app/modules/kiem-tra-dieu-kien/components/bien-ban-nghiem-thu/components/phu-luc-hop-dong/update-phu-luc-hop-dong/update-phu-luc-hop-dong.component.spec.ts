import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePhuLucHopDongComponent } from './update-phu-luc-hop-dong.component';

describe('UpdatePhuLucHopDongComponent', () => {
  let component: UpdatePhuLucHopDongComponent;
  let fixture: ComponentFixture<UpdatePhuLucHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePhuLucHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePhuLucHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

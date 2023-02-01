import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerapplicationComponent } from './serverapplication.component';

describe('ServerapplicationComponent', () => {
  let component: ServerapplicationComponent;
  let fixture: ComponentFixture<ServerapplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerapplicationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

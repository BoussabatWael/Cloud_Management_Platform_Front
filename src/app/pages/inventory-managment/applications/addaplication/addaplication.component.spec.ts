import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddaplicationComponent } from './addaplication.component';

describe('AddaplicationComponent', () => {
  let component: AddaplicationComponent;
  let fixture: ComponentFixture<AddaplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddaplicationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddaplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

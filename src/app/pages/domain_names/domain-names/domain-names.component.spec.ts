import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainNamesComponent } from './domain-names.component';

describe('DomainNamesComponent', () => {
  let component: DomainNamesComponent;
  let fixture: ComponentFixture<DomainNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomainNamesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

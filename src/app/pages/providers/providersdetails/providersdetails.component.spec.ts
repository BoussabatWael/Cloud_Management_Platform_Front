import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersdetailsComponent } from './providersdetails.component';

describe('ProvidersdetailsComponent', () => {
  let component: ProvidersdetailsComponent;
  let fixture: ComponentFixture<ProvidersdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvidersdetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerdetailsComponent } from './serverdetails.component';

describe('ServerdetailsComponent', () => {
  let component: ServerdetailsComponent;
  let fixture: ComponentFixture<ServerdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerdetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

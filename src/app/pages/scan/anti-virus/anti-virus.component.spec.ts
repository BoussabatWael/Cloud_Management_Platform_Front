import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntiVirusComponent } from './anti-virus.component';

describe('AntiVirusComponent', () => {
  let component: AntiVirusComponent;
  let fixture: ComponentFixture<AntiVirusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AntiVirusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AntiVirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

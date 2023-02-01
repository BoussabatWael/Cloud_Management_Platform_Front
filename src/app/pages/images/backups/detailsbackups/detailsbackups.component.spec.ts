import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsbackupsComponent } from './detailsbackups.component';

describe('DetailsbackupsComponent', () => {
  let component: DetailsbackupsComponent;
  let fixture: ComponentFixture<DetailsbackupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsbackupsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsbackupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

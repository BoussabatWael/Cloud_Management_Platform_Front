import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaildomaineNamesComponent } from './detaildomaine-names.component';

describe('DetaildomaineNamesComponent', () => {
  let component: DetaildomaineNamesComponent;
  let fixture: ComponentFixture<DetaildomaineNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetaildomaineNamesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaildomaineNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

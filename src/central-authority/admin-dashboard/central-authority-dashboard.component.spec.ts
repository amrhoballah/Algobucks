import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralAuthorityDashboardComponent } from './central-authority-dashboard.component';

describe('CentralAuthorityDashboardComponent', () => {
  let component: CentralAuthorityDashboardComponent;
  let fixture: ComponentFixture<CentralAuthorityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralAuthorityDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralAuthorityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

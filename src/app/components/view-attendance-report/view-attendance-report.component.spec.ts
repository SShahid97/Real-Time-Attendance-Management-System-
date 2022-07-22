import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttendanceReportComponent } from './view-attendance-report.component';

describe('ViewAttendanceReportComponent', () => {
  let component: ViewAttendanceReportComponent;
  let fixture: ComponentFixture<ViewAttendanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

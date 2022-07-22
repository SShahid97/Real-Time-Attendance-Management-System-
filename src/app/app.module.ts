import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//components
import { AppComponent } from './app.component';
import { StudentComponent } from './components/student/student.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import { AddSubjectComponent } from './components/add-subject/add-subject.component';
import { EditSubjectComponent } from './components/edit-subject/edit-subject.component';
import { LeftNavBarComponent } from './components/left-nav-bar/left-nav-bar.component';
import { ListSubjectsComponent } from './components/list-subjects/list-subjects.component';
import { ListStudentsComponent } from './components/list-students/list-students.component';
import { SubjectComponent } from './components/subject/subject.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { TakeAttendanceComponent } from './components/take-attendance/take-attendance.component';
import { ViewAttendanceComponent } from './components/view-attendance/view-attendance.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

//forms
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";

//services
import { MyserviceService } from '../app/shared/myservice.service';

//for firebase connection 
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//https
import { HttpClientModule } from '@angular/common/http';



//routes and guards
import { RouterModule } from '@angular/router';
import { routes } from './routes';


import { CapitalizeFirstPipe } from './pipes/capitalizefirst.pipe';

//storage
import { StorageServiceModule} from 'angular-webstorage-service';

//sweetalert 
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ViewAttendanceReportComponent } from './components/view-attendance-report/view-attendance-report.component';



//Material
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatNativeDateModule, MatDatepickerModule, MatInputModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';

/*
import { AppDateAdapter } from './validators/mydatepicker';
const APP_DATE_FORMATS =
  {
    parse: {
      dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    },
    display: {
      dateInput: 'input',
      monthYearLabel: { year: 'numeric', month: 'numeric' },
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
  };

*/


@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    AddStudentComponent,
    AddSubjectComponent,
    LeftNavBarComponent,
    ListSubjectsComponent,
    ListStudentsComponent,
    SubjectComponent,
    LoginComponent,
    PageNotFoundComponent,
    AddUserComponent,
    TakeAttendanceComponent,
    ViewAttendanceComponent,
    ViewUsersComponent,
    ChangePasswordComponent,
    CapitalizeFirstPipe,
    EditSubjectComponent,
    EditStudentComponent,
    EditUserComponent,
    ViewAttendanceReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    StorageServiceModule,
    // SweetAlert2Module.forRoot()

    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
    // BrowserAnimationsModule,
    // MatNativeDateModule,
    // MatDatepickerModule,
    // MatInputModule
  ],
  providers: [MyserviceService,
    // {provide: MAT_DATE_LOCALE, useValue: 'en-IN'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

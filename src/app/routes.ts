import {Routes} from '@angular/router';
import {ListStudentsComponent} from '../app/components/list-students/list-students.component';
import {AddStudentComponent} from '../app/components/add-student/add-student.component';
import {AddSubjectComponent} from '../app/components/add-subject/add-subject.component';
import {ListSubjectsComponent} from '../app/components/list-subjects/list-subjects.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { TakeAttendanceComponent } from './components/take-attendance/take-attendance.component';
import { ViewAttendanceComponent } from './components/view-attendance/view-attendance.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditSubjectComponent } from './components/edit-subject/edit-subject.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ViewAttendanceReportComponent } from './components/view-attendance-report/view-attendance-report.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch:'full'},
    {path: 'students/view-students', component:ListStudentsComponent},
    {path: 'students/add-student', component:AddStudentComponent},
    {path: 'students/edit-student/:semester/:key', component:EditStudentComponent},
    {path: 'subjects/add-subject', component:AddSubjectComponent},
    {path: 'subjects/edit-subject/:semester/:key', component:EditSubjectComponent},
    {path: 'subjects/view-subjects', component:ListSubjectsComponent},
    {path: 'users/add-user', component:AddUserComponent},
    {path: 'users/edit-user/:key', component:EditUserComponent},
    {path: 'users/view-users', component:ViewUsersComponent},
    {path: 'attendance/take-attendance', component:TakeAttendanceComponent},
    {path: 'attendance/view-attendance', component:ViewAttendanceComponent},
    // {path: 'attendance/edit-attendance/:date/:subjectkey', component:EditAttendanceComponent},
    {path: 'attendance/view-attendance-report', component:ViewAttendanceReportComponent},
    {path: 'myprofile/change-password', component:ChangePasswordComponent},
    {path: 'login', component:LoginComponent},
    {path: '**', component:PageNotFoundComponent},
     
];
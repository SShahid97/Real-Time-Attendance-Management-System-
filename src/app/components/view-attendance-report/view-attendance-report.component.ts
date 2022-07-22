import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-attendance-report',
  templateUrl: './view-attendance-report.component.html',
  styleUrls: ['./view-attendance-report.component.css']
})
export class ViewAttendanceReportComponent implements OnInit {
  
  reportForm:FormGroup;
  subjectChoosen:FormControl;
  fromDate:FormControl;
  toDate:FormControl;
 
  minDate:string;
  maxDate:string;

  userKey: string;
  currentUser: User;
  constructor() { 

    
    this.subjectChoosen = new FormControl("", [Validators.required]);
    this.fromDate = new FormControl(this.getTodaysDateStr(), [Validators.required]);
    this.toDate = new FormControl(this.getTodaysDateStr(), [Validators.required]);
    

    this.reportForm = new FormGroup({
      subjectChoosen:this.subjectChoosen,
      fromDate: this.fromDate,
      toDate: this.toDate

    });
  }

  ngOnInit() {

    this.minDate = "2018-03-01";
    this.maxDate = this.getTodaysDateStr();
  }

  viewAttendanceReport(){

  }

  onSubjectChange(val){

  }

  getTodaysDateStr() {
    let today = new Date();
    let day = (today.getDate()).toString();
    let month = (today.getMonth() + 1).toString();
    let year = today.getFullYear();

    if (parseInt(month) < 10)
      month = '0' + month;

    if (parseInt(day) < 10)
      day = '0' + day;

    return `${year}-${month}-${day}`;
  }
}
interface Subject {
  key: string,
  subjectCode: string,
  subjectTitle: string,
  semester: string
}
interface Subjects {
  key: string,
  semester: string
}

interface User {
  key: string,
  username: string,
  pasword: string,
  name: string,
  subjects: Subject[],
  role: string,
  status: string,
  subjectsAssigned: Subjects[]
}
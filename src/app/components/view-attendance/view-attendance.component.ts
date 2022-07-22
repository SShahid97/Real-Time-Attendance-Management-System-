import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../../shared/myservice.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as $ from 'jquery';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent implements OnInit {
  userKey: string;
  currentUser: User;
  students: Student[];
  loading: boolean = false;
  iamReady = false;

  // minDate = new Date(2017, 0, 1);
  // maxDate = new Date(2030, 11, 31);
  minDate = '2017-01-01';
  maxDate = '2030-12-31';
  todayDate = new Date();

  attendanceForm: FormGroup;
  subjectChoosen: FormControl;
  dateChoosen: FormControl;



  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private service: MyserviceService) {
    // this.getAllSubjectsData();

    //console.log("today's date",this.todayDate);
    this.subjectChoosen = new FormControl("", [Validators.required]);

    this.dateChoosen = new FormControl(this.getTodaysDateStr(), [Validators.required]);

    this.attendanceForm = new FormGroup({
      subjectChoosen: this.subjectChoosen,
      dateChoosen: this.dateChoosen

    });

  }

  dateToEpoch(year, month, day) {
    // let day = date.getDate(), month = date.getMonth(), year = date.getFullYear();
    return new Date(year, month, day).getTime();
  }


  epochToDateString(epoch) {
    return new Date(epoch).toDateString();
  }

  epochToDate(epoch) {
    return new Date(epoch);
  }



  subjects: Array<Subject>;

  // async getAllSubjectsData() {
  //   await this.service.getCollectionName("", "subjectListingAll").snapshotChanges().subscribe(items => {
  //     this.subjects = [];
  //     items.forEach(element => {
  //       var item = element.payload.toJSON();
  //       item["key"] = element.key;
  //       this.subjects.push(item as Subject)
  //     });

  //   });

  // }

  ngOnInit() {
    // swal("Good job!", "You clicked the button!", "success");
    // this.userKey = this.activatedRoute.snapshot.params['id'];
    this.userKey = this.storage.get('currentuserkey');
    this.getUserData();

    const subjectSelectedFormEl = this.attendanceForm.get('subjectChoosen');
    const dateChoosenFormEl = this.attendanceForm.get('dateChoosen');
    subjectSelectedFormEl.valueChanges.subscribe(val => {
      dateChoosenFormEl.setValue(this.getTodaysDateStr());
    });

  }


  // giveMeSubjectDetails(semester, firebaseKey) {
  //   let returnVal;
  //   this.subjects.forEach(oneSemester => {
  //     for (let subjectKey in oneSemester) {
  //       if (firebaseKey === subjectKey) {
  //         returnVal = oneSemester[subjectKey];
  //         break;
  //       }
  //     }
  //   });
  //   return returnVal;
  // }

  subjectsAssignedObj: Subjects[] = [];

  firstTime = true;

  getUserData() {

    this.currentUser = { key: "", username: "", pasword: "", name: "", subjects: [], subjectsAssigned: [], role: "", status: "" };

    this.service.fetchUserData(this.userKey).subscribe(userData => {
      this.currentUser = <User>userData[0].payload.toJSON();

      this.subjectsAssignedObj = [];
      this.subjectsAssignedObj = this.currentUser.subjectsAssigned;

      let mySubjects = [];
      for (let index in this.subjectsAssignedObj) {
        let obj = this.subjectsAssignedObj;
        this.service.getSubjectData(obj[index].key, obj[index].semester).subscribe(subjectData => {
          if(subjectData[0] != undefined){
            let result = subjectData[0].payload.toJSON();
            result['key'] = obj[index].key;
            result['semester'] = obj[index].semester;
            mySubjects.push(result);
          }
        });
      }
      this.currentUser["subjects"] = mySubjects;

      // console.log(this.currentUser)
    });

  }

  validatePicker(subjectChoosenKey) {

    this.service.checkIfSubjectsExists(subjectChoosenKey).subscribe(attendanceRecords => {
      if (attendanceRecords.length === 0) {
        //apply no validation filter to datepicker
        // this.minDate = new Date(2017, 0, 1);
        // this.maxDate = new Date(2030, 11, 31);
        // console.log("no records exist.........");
        this.minDate = '2017-01-01';
        this.maxDate = '2030-12-31';
      } else {

        let firstRecord = <Att>attendanceRecords[0].payload.toJSON();
        let lastRecord = <Att>attendanceRecords[(attendanceRecords.length - 1)].payload.toJSON();

        let firstDateConverted = this.epochToDate(firstRecord.date);
        let lastDateConverted = this.epochToDate(lastRecord.date);


        let firstDateYear = firstDateConverted.getFullYear();
        let firstDateMonth = (firstDateConverted.getMonth() + 1).toString();
        let firstDateDay = (firstDateConverted.getDate()).toString();
        if (parseInt(firstDateMonth) < 10)
          firstDateMonth = '0' + firstDateMonth.toString();
        if (parseInt(firstDateDay) < 10)
          firstDateDay = '0' + firstDateDay.toString();



        let lastDateYear = lastDateConverted.getFullYear();
        let lastDateMonth = (lastDateConverted.getMonth() + 1).toString();
        let lastDateDay = (lastDateConverted.getDate()).toString();
        if (parseInt(lastDateMonth) < 10)
          lastDateMonth = '0' + lastDateMonth.toString();
        if (parseInt(lastDateDay) < 10)
          lastDateDay = '0' + lastDateDay.toString();

        this.minDate = `${firstDateYear}-${firstDateMonth}-${firstDateDay}`;
        this.maxDate = `${lastDateYear}-${lastDateMonth}-${lastDateDay}`;
      }

    });

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

  attendanceArray: CaptureAttendance[] = [];
  subjectKey: string = "";

  onSubjectChange(subjectChoosenKey) {

    // console.log(this.attendanceForm.value.subjectChoosen);
    if (subjectChoosenKey === "")
      return;

    this.validatePicker(subjectChoosenKey);
  }



  // ----------------------------------------------View Attendance (Start)---------------------------------------------------------------- //
  viewAttendance() {

    let formValues = this.attendanceForm.value;
    // console.log(formValues);
    let dateSelected = this.attendanceForm.value.dateChoosen;
    this.subjectKey = this.attendanceForm.value.subjectChoosen;
    this.firstTime = false;

    this.service.getSubjectData(this.subjectKey, this.getSemesterForSubjectSelect()).subscribe(subjectData => {
      let result = <Subject>subjectData[0].payload.toJSON();
      this.headingLabelSubject = result.subjectTitle;
    });


    let dateArray = dateSelected.split('-'),
      year = dateArray[0],
      month = dateArray[1],
      day = dateArray[2],

      monthNumeric: number,
      dayNumeric: number;

    this.headingLabelDate = `${day}-${month}-${year}`;

    if (parseInt(month) < 10) {
      month = (month.toString()).slice(1);
    }
    if (parseInt(day) < 10) {
      day = (day.toString()).slice(1);
    }
    monthNumeric = month - 1;
    dayNumeric = day;


    let dateSelectedEpoch = this.dateToEpoch(year, monthNumeric, dayNumeric);
    this.loading = true;

    this.students = [];
    this.attendanceArray = [];
    // console.log("subject key", this.subjectKey);
    let exists = false;
    this.service.checkIfAttendanceExists(dateSelectedEpoch).subscribe(attendanceRecordsForSpecificDate => {
      // console.log(attendanceRecordsForSpecificDate.length);

      for (let i = 0; i < attendanceRecordsForSpecificDate.length; i++) {
        let allAttendancesForDateSelected = <Att>attendanceRecordsForSpecificDate[i].payload.toJSON();
        if (allAttendancesForDateSelected.subjectKey === this.subjectKey) {
          exists = true;
          let attendanceForSpecificDate = allAttendancesForDateSelected.attendance;
          for (let k in attendanceForSpecificDate) {
            this.attendanceArray.push(attendanceForSpecificDate[k]);
          }
          break;
        }
      }
      if (exists)
        this.listStudents();
      else
        this.loading = false;

    });

    // this.service.checkIfSubjectsExists(this.subjectKey).subscribe(attendanceRecords => {
    //   if (attendanceRecords.length === 0) {
    //     console.log("no records exists for this subject.........listing...");
    //     this.loading = false;
    //   } else {
    //     console.log("epocheeeee", );
    //   }
    // });

  }

  headingLabelSubject: string;
  headingLabelDate: string;
  headingLabelSemester: string;

  getSemesterForSubjectSelect(){
    let semester = "";
    for (var i in this.subjectsAssignedObj) {
      if (this.subjectsAssignedObj[i].key === this.subjectKey) {
        semester = this.subjectsAssignedObj[i].semester;
        break; 
      }
    }
    return semester;
  }

  //---------------------liststudents-------------------
  listStudents() {

    let semester = this.getSemesterForSubjectSelect();

    this.headingLabelSemester = semester.charAt(semester.length - 1);
    this.service.getCollectionName(semester, "studentListing").snapshotChanges().subscribe(items => {
      this.students = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;
        this.students.push(item as Student);
      });
      this.loading = false;
    });
  }



} //class ends here



interface Att {
  subjectKey: string,
  date: string,
  attendance: {
    studentKey: string,
    present: boolean
  }
}

interface Attendance {
  key: string,
  studentKey: string,
  subjectKey: string,
  semester: string,
  date: string,
  present: boolean,
  absent: boolean,
}


interface Subject {
  key: string,
  subjectCode: string,
  subjectTitle: string,
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

interface Subjects {
  key: string,
  semester: string
}

interface Student {
  key: string,
  name: string,
  rollNo: number,
  semester: string,
  email: string,
  contact: string,
  address: string,
  gender: string
}
interface CaptureAttendance {
  studentKey: string,
  present: boolean
}

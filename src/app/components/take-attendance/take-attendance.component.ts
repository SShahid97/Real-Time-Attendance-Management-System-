import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../../shared/myservice.service';
import * as $ from 'jquery';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import swal from 'sweetalert2';
import { element } from 'protractor';

@Component({
  selector: 'app-take-attendance',
  templateUrl: './take-attendance.component.html',
  styleUrls: ['./take-attendance.component.css']
})
export class TakeAttendanceComponent implements OnInit {

  isAttendanceUpdate = false; 
  userKey: string;
  currentUser: User;
  students: Student[];
  loading: boolean = false;
  today: string;

  dateChoosen: string;

  todaysDate: string;
  attendanceDate: string;
  attendanceDateString: string; 
  minDate: string;
  maxDate: string;

  headingLabelSubject:string;
  headingLabelSemester:string;
  headingLabelDate:string;

  constructor(private service: MyserviceService, @Inject(LOCAL_STORAGE) private storage: WebStorageService, private router:Router) {
    this.getAllSubjectsData();
    this.today = new Date().toDateString();
  }

  subjects: Array<Subject>;

  async getAllSubjectsData() {
    await this.service.getCollectionName("", "subjectListingAll").snapshotChanges().subscribe(items => {
      this.subjects = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;
        this.subjects.push(item as Subject)
      });

    });

  }

  ngOnInit() {
    // this.userKey = this.activatedRoute.snapshot.params['id'];
    this.userKey = this.storage.get('currentuserkey');
    this.getUserData();

    this.attendanceDate = this.getTodaysDateStr();
    this.attendanceDateString = new Date(this.attendanceDate).toDateString();
    this.minDate = "2018-03-01";
    this.maxDate = this.getTodaysDateStr();
    // console.log("maxDate",this.maxDate)
  }


  subjectsAssignedObj: Subjects[] = [];

  //----------------------------------------------getUserData()--------------------------------------------------------
  
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
    });

  }

  disableSave: boolean;
  allowSave(subjectChoosenKey, epoch) {
    this.disableSave = false;

    // let epochStr = epoch.toString();
    //I Method (get All attendances for subject choosen, then find if todays exists)
    // this.service.checkIfSubjectsExists(subjectChoosenKey).subscribe(items => {
    //   items.forEach(element => {
    //     var item = <Att>element.payload.toJSON();
    //     console.log("item ", item);
    //     console.log("epoch ", epochStr);
    //     console.log("item.date", item.date);
    //     if (item.date == epochStr) {
    //       console.log("ulll");
    //       this.disableSave = true;
    //     }
    //   });
    // });

    //II Method  (to enable disable)
    // get all attendance for today and find the attendance for the choosen subject via its subjectKey
    this.service.checkIfAttendanceExists(epoch).subscribe(items => {
      for (let i = 0; i < items.length; i++) {
        let item = <Att>items[i].payload.toJSON();
        if (item.subjectKey == subjectChoosenKey) {
          this.disableSave = true;
          break;
        }
      }

    });

  }

  dateStringToEpoch(dateSring) {
    let dateArray = dateSring.split('-'),
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

    return new Date(year, monthNumeric, dayNumeric).getTime();
  }

  onDateChange(dateSelected) {

    this.attendanceDateString = new Date(dateSelected).toDateString();

    let dateSelectedEpoch = this.dateStringToEpoch(dateSelected);

    // console.log("epoch.......", dateSelectedEpoch);
    // console.log("key", this.subjectKey);
    this.allowSave(this.subjectKey, dateSelectedEpoch);

  }


  getSemesterForSubjectSelected() {
    let semester = "";
    for (var i in this.subjectsAssignedObj) {
      if (this.subjectsAssignedObj[i].key === this.subjectKey) {
        semester = this.subjectsAssignedObj[i].semester;
        break;
      }
    }
    return semester;
  }
  attendanceArray: CaptureAttendance[] = [];
  subjectKey: string = "";

  onSubjectChange(subjectChoosenKey) {
    if(subjectChoosenKey == ""){
      // console.log("yah")
      return;
    }

    // console.log("sub key", subjectChoosenKey);
    this.subjectKey = subjectChoosenKey;

    // console.log("sem" , this.getSemesterForSubjectSelected());
    this.service.getSubjectData(this.subjectKey, this.getSemesterForSubjectSelected()).subscribe(subjectData => {
      let result = <Subject>subjectData[0].payload.toJSON();
      this.headingLabelSubject = result.subjectTitle;
    });

    let semester=this.getSemesterForSubjectSelected();
    this.headingLabelSemester = semester.charAt(semester.length - 1);;
    this.loading = true;



    // let today = new Date();
    // let day = today.getDate();
    // let month = today.getMonth();
    // let year = today.getFullYear();
    // let epoch = new Date(year, month, day).getTime();

    this.allowSave(subjectChoosenKey, this.dateStringToEpoch(this.attendanceDate));
    this.attendanceArray = [];

    this.service.getCollectionName(this.getSemesterForSubjectSelected(), "studentListing").snapshotChanges().subscribe(items => {
      this.students = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;

        // let att = { studentKey: element.key, present: true }

        let att =  { studentKey: element.key, present: this.giveMeAttedance(element.key) };
        // console.log(att);
        this.attendanceArray.push(att);
        this.students.push(item as Student);

      });
      this.loading = false;
      // console.log("this.attendanceArray", this.attendanceArray);
    });
  }
  
  giveMeAttedance(stdKey){
    // console.log("isAttendanceUpdate = "+ this.isAttendanceUpdate);
    if(this.isAttendanceUpdate == false){
      //initially keep all students present
      return true; 
    }else{
      //load their saved attendance..
      let valueToReturn = true; 
      this.previousAttendance.forEach(element=>{
        // console.log("element.......", element);
        let obj = <CaptureAttendance> element;
        if(obj.studentKey === stdKey ){
          valueToReturn = obj.present;
        }
      });
      return valueToReturn; 
    }
  }
  
  setradio(val) {
    // console.log("value of radio button",val);
    // console.log("hi..........", this.attendanceArray);
  }


  saveAttendance() {

    // console.log(new Date());
    // let today = new Date();
    // let day = today.getDate();
    // let month = today.getMonth();
    // let year = today.getFullYear();

    // let epoch = new Date(year, month, day).getTime();


    let epoch = this.dateStringToEpoch(this.attendanceDate);

    let databaseUrl = 'attendance/';
    let obj = {};
    obj['subjectKey'] = this.subjectKey;
    obj['date'] = epoch;
    obj['attendance'] = this.attendanceArray;


    if(!this.isAttendanceUpdate){
      this.service.saveAttendance(databaseUrl, obj);
      swal("Saved", "Attendance saved Successfully", "success");
    }else{
      this.service.updateAttendance(databaseUrl, obj, this.currentSubjectToUpdateKey);
      swal("Updated", "Attendance updated Successfully", "success");
      this.showExtras = true; 
      this.isAttendanceUpdate = false; 
      this.buttonLabel =  "Save Attendance";
      // console.log("let me update it..")
    }
  }

  public showCancel: boolean;
  public showExtras = true; 
  public buttonLabel = "Save Attendance";
  editAttendance() {
    this.showCancel= true;
    this.showExtras = false; 
    this.isAttendanceUpdate = true; 
    this.buttonLabel =  "Update Attendance";

    this.students = [];
    this.getAttendance();
    this.onSubjectChange(this.subjectKey);

 
    // this.router.navigate(['./attendance/edit-attendance/'+this.dateStringToEpoch(this.attendanceDate)+"/"+this.subjectKey]);
  

    // let epoch = this.dateStringToEpoch(this.attendanceDate);

    // let databaseUrl = 'attendance/';
    // let obj = {};
    // obj['subjectKey'] = this.subjectKey;
    // obj['date'] = epoch;
    // obj['attendance'] = this.attendanceArray;
    // this.service.saveAttendance(databaseUrl, obj);

    // swal("Saved", "Attendance saved Successfully", "success");
  }


  previousAttendance : CaptureAttendance[];
  currentSubjectToUpdateKey = "";
  getAttendance(){
    // let epochDateNumber = Number(this.epochDate);
    // console.log("i am called... getAttendance")
    this.previousAttendance = [];
    this.service.checkIfAttendanceExists(this.dateStringToEpoch(this.attendanceDate)).subscribe(items => {
      for (let i = 0; i < items.length; i++) {
        let myKey = items[i].key;
        let item = <Att>items[i].payload.toJSON();
        if (item.subjectKey == this.subjectKey) {
          for(let k in item.attendance){
            this.currentSubjectToUpdateKey = myKey;
            this.previousAttendance.push(item.attendance[k]);
          }
          break;
        }
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
 
 
  goBack(){
    this.showExtras = true; 
    this.showCancel = false;
    this.isAttendanceUpdate = false; 
    this.buttonLabel =  "Save Attendance";
    
  }

}


interface Att {
  subjectKey: string,
  date: string,
  attendance: {
    studentKey: string,
    present: string
  }
}

interface CaptureAttendance {
  studentKey: string,
  present: boolean
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
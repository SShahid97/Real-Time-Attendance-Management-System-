import { Component, OnInit, } from '@angular/core';
import { Student } from '../../shared/student.model';
import { MyserviceService } from '../../shared/myservice.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  stdsList: Student[];
  semesters: { val: string, label: string }[];
  subjects: any[];
  currentSemester = "";
  currentSubject = "";

  constructor(private service: MyserviceService) {
    // db: AngularFireDatabase
    // connect to node 'student' in our database 

    // console.log(this.items);
    this.semesters = [
      { val: "", label: "select" },
      { val: "semester1", label: "Semester 1" },
      { val: "semester2", label: "Semester 2" },
      { val: "semester3", label: "Semester 3" },
      { val: "semester4", label: "Semester 4" },
      { val: "semester5", label: "Semester 5" },
      { val: "semester6", label: "Semester 6" }
    ];

  }

  // insert() {
  //   //insert
  //   let record1 = { name: "shabir", rn: "22" };
  // }


  // update() {
  //   // let key;
  //   // let updatedStd;

  //   // this.stdsList.forEach((std, index) => {
  //   //   console.log(index);
  //   //   if (index == 0) {
  //   //     key = std.$key;
  //   //     updatedStd = { "rn": "999" }
  //   //   }
  //   // });
  //   // console.log("key = ", key);
  //   // console.log("std = ", updatedStd);
  //   // this.service.update(key, updatedStd);
  // }


  // delete() {
  //   // let key = "malik";
  //   // this.stdsList.forEach(function (el, index) {
  //   //   if (index == 4) {
  //   //     key = el.$key;
  //   //   }
  //   // });
  //   // if (key != undefined)
  //   //   this.service.removeStudent(key);
  // }

  // deleteAll() {
  //   // this.service.removeStudent(undefined);
  //   // this.service.removeStudent();
  // }

  // get() {
  //   // let table = this.service.getTableName();
  //   // table.snapshotChanges().subscribe(items => {
  //   //   this.stdsList = [];
  //   //   items.forEach(element => {
  //   //     var item = element.payload.toJSON();
  //   //     item["$key"] = element.key;
  //   //     this.stdsList.push(item as Student);
  //   //   });
  //   // });
  // }

  ngOnInit() {
    // this.get();


    // $(document).ready(function () {

    //   if (localStorage.getItem("navbarstatus") === "mini") {
    //     $('#sidebar').addClass('active');

    //     if ($("#sidebarCollapse i").hasClass("glyphicon-circle-arrow-left")) {
    //       $("#sidebarCollapse i").removeClass("glyphicon-circle-arrow-left").addClass("glyphicon-circle-arrow-right");
    //     }
    //   }

    //   $('#sidebarCollapse').on('click', function () {
    //     $('#sidebar').toggleClass('active');

    //     if ($("#sidebarCollapse i").hasClass("glyphicon-circle-arrow-right")) {
    //       $("#sidebarCollapse i").removeClass("glyphicon-circle-arrow-right").addClass("glyphicon-circle-arrow-left");
    //     } else {
    //       $("#sidebarCollapse i").removeClass("glyphicon-circle-arrow-left").addClass("glyphicon-circle-arrow-right");
    //     }

    //     if (localStorage.getItem("navbarstatus") === null) {
    //       localStorage.setItem("navbarstatus", "mini");
    //     } else {
    //       localStorage.removeItem("navbarstatus");
    //     }

    //     console.log(localStorage.getItem("navbarstatus"));

    //     //logout
    //     //localStorage.clear();
    //   });

    //   let width = $(window).width();
    //   if (width < 500) {
    //     if (!$('#sidebar').hasClass('active')) {
    //       $("#sidebarCollapse").trigger("click");
    //     }
    //   }
    //   // console.log(width);
    //   // $(window).resize(function () {

    //   // });

    //   // // Initialize tooltip component
    //   // $(function () {
    //   //   $('[data-toggle="tooltip"]').tooltip()
    //   // })


    //   // // Initialize popover component
    //   // $(function () {
    //   //   $('[data-toggle="popover"]').popover()
    //   // })

    //   //datepicker


    //   // $("#popupBtn").click();

    //   $("#changeSemester").on("click", () => {
    //     $("#popupBtn").click();
    //   });
    // });
  }

  //providing subjects according to selected semester
//   onSemesterChange(semesterSelected) {
//     if (semesterSelected !== "") {
//       let semester = this.service.getSubjectsTable(semesterSelected);
//       return semester.snapshotChanges().subscribe(items => {
//         this.subjects = [];
//         items.forEach((element, index) => {
//           var item = element.payload.toJSON();
//           if (index === 0) {
//             this.currentSubject = item + "";
//           }
//           this.subjects.push(item);
//         });
//       });

//     } else {
//       this.subjects = [];
//     }
//   }


//   onSubjectChange(slectSubject) {
//     // console.log(this.currentSemester);
//     // console.log(this.currentSubject);
//   }


//   getStudents() {
//     // console.log(this.currentSemester);
//     // console.log(this.currentSubject);

//     if (localStorage.getItem("currentSemester") !== null) {
//       localStorage.removeItem("currentSemester");
//     }
//     localStorage.setItem("currentSemester", this.currentSemester);
//   }

// }

// class Country {
//   constructor(public id: number, public name: string) { }
 }
import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Student } from '../../shared/student.model';
import { MyserviceService } from '../../shared/myservice.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';


@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.css']
})
export class ListStudentsComponent implements OnInit {
  semesters: Semester[];
  students: Student[];
  loading: boolean = false; 
  semesterSelected:string;

  constructor(private service: MyserviceService, private router:Router) {
    this.semesters = [
      { val: "semester1", label: "Semester 1" },
      { val: "semester2", label: "Semester 2" },
      { val: "semester3", label: "Semester 3" },
      { val: "semester4", label: "Semester 4" },
      { val: "semester5", label: "Semester 5" },
      { val: "semester6", label: "Semester 6" }
    ];
  } 
  ngOnInit() {
    this.onSemesterChange('semester1');
    this.semesterSelected = 'semester1';
  }

  onSemesterChange(semester) {

    this.semesterSelected = semester;
    this.loading = true;
    let table = this.service.getCollectionName(semester, "studentListing");
    // if(table === null){
    //   alert("oh yah");
    // }
    table.snapshotChanges().subscribe(items => {
      this.students = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;
        this.students.push(item as Student);
      });
      this.loading = false;
     //console.log("Studnet key",this.students[3].key);
     
    });
  }

    deleteData(KeyOfStudent){
               
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this data!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        // console.log("result", result);
        if (result.value) {
          
          this.service.removeStudent(KeyOfStudent, this.semesterSelected);
          swal(
            'Deleted!',
            'Your content has been deleted.',
            'success'
          )
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Cancelled',
            'Your content is safe :)',
            'error'
          )
        }
      return;
      });

  }

  editStudent(studentKey){
    this.router.navigate(['./students/edit-student/'+this.semesterSelected+"/"+studentKey]);
  }

}

interface Semester {
  val: string,
  label: string
}

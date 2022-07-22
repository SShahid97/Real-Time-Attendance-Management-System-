import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../../shared/myservice.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  selector: 'app-list-subjects',
  templateUrl: './list-subjects.component.html',
  styleUrls: ['./list-subjects.component.css']
})
export class ListSubjectsComponent implements OnInit {

  semesters: Semester[];
  subjects: Array<Subject>;
  loading: boolean = false;
  semesterSelected:string; 

  constructor(private service: MyserviceService, private router:Router ) {
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
    this.listSubjects('semester1');
    this.semesterSelected='semester1';
  }

  listSubjects(semester) {
    // console.log(this.subjectsFilterForm.value);
    this.semesterSelected = semester;
    this.loading = true;
    let table = this.service.getCollectionName(semester, "subjectListing");
    // console.log(table);
    table.snapshotChanges().subscribe(items => {
      this.subjects = [];
      items.forEach(element => {
        var item = element.payload.toJSON();
        item["key"] = element.key;
        // console.log(item);
        this.subjects.push(item as Subject);
      });
      this.loading = false;
      // console.log(this.subjects);
    });
  }

  deleteSubject(subjectKey){
    
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
        
        this.service.removeSubject(subjectKey,this.semesterSelected);
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

  editSubject(subjectKey){
    this.router.navigate(['./subjects/edit-subject/'+this.semesterSelected+"/"+subjectKey]);
  }
 
}
interface Subject {
  key: string,
  subjectCode: string,
  subjectTitle: string,
}

interface Semester {
  val: string,
  label: string
}
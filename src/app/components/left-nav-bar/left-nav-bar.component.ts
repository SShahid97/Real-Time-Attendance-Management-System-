import { Component, OnInit, Inject } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from "@angular/router";
import { MyserviceService } from '../../shared/myservice.service';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

@Component({
  selector: 'app-left-nav-bar',
  templateUrl: './left-nav-bar.component.html',
  styleUrls: ['./left-nav-bar.component.css']
})
export class LeftNavBarComponent implements OnInit {

  currentUserRole:string;
  currentUserKey:string;  
  adminLoggedIn:boolean;
  currentUserName:string;
  constructor(private myService:MyserviceService,   @Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

  
  ngOnInit() {

    this.currentUserName=this.storage.get('username');
    // console.log("username...",this.currentUserName)

    
    this.currentUserRole=this.storage.get('role');
   if (this.currentUserRole == 'admin'){
      this.adminLoggedIn = true;
    }else if(this.currentUserRole == 'teacher'){
      this.adminLoggedIn = false;
    }

    


    $(document).ready( () =>{


      $(".modal a").not(".dropdown-toggle").on("click", function () {
        //$(".modal").modal ("hide");
      });



      // $("li").filter(".active").closest("ul").parent().addClass("active");
      // $("li").filter(".active").closest("ul").addClass("in");

      function collapseIt(selector) {
        // selector.parent().removeClass("active");
        selector.next("ul").removeClass("in");
        selector.attr("aria-expanded", false);
      }

      // var loc = window.location;
      // let origin = loc.origin;
      // let pathname = loc.pathname;
      // let moduleName = pathname.split("/")[1];
      // let actionName = pathname.split("/")[2];

      $("nav#sidebar ul li a#studentsNav").on("click", function () {
        collapseIt($("#usersNav"));
        collapseIt($("#subjectsNav"));
        collapseIt($("#attendancNav"));
      });

      $("nav#sidebar ul li a#subjectsNav").on("click", function () {
        collapseIt($("#studentsNav"));
        collapseIt($("#usersNav"));
        collapseIt($("#attendancNav"));
      });

      $("nav#sidebar ul li a#usersNav").on("click", function () {
        collapseIt($("#studentsNav"));
        collapseIt($("#subjectsNav"));
        collapseIt($("#attendancNav"));
      });

      $("nav#sidebar ul li a#attendancNav").on("click", function () {
        collapseIt($("#studentsNav"));
        collapseIt($("#usersNav"));
        collapseIt($("#subjectsNav"));
      });


      $("nav#sidebar ul li ul li a").on("click", function () {
        // console.log("clicked...");
      });


      $("#view").on("click", function () {
        $(".titleChange").html("Subject View");
      });

      // $("#add").on("click", function(){

      //   $(".titleChange").append("<h4 style='color:white; font-weight:bold; text-align:center; padding-top:10px;'  >Add Subject</h4>");
      // });

      //search Box
      $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("table tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });


      // $("#myInput").on("click", ()=>{
      //   console.log("called......fouc");
      //   $("#myInput").prev("i").css("display", "none");
      // });

      // $("#popupBtn").click();
      $("#logout").on("click", () => {
        $("#popupBtn").click();
      });

    });

  }


  logout(){
    // this.router.navigate(['./login'])
    this.storage.remove('currentuserkey');
    this.storage.remove('role');
    this.storage.remove('username');


    window.location.href="./login";
  }

}


interface User {
  key: string,
  username: string,
  password: string,
  name: string,
  subjects: string[],
  role: string,
  status: string

}
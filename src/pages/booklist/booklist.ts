import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { ListPage } from "../list/list";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs-compat";
import { firestore } from "firebase";
@Component({
  selector: "page-booklist",
  templateUrl: "booklist.html"
})
export class BookListPage {
  // lists: Array<{ name: string; lastModified: Date }> = [
  //   {
  //     name: "To-Read",
  //     lastModified: new Date()
  //   },
  //   {
  //     name: "Currently-Reading",
  //     lastModified: new Date()
  //   },
  //   {
  //     name: "Completed",
  //     lastModified: new Date()
  //   }
  // ];

  lists: Observable<any>;
  fireStore: AngularFirestore;
  bookListCollection: any;

  constructor(public navCtrl: NavController, db: AngularFirestore) {
    this.fireStore = db;
    // this.lists = db.collection("to-read").valueChanges();
    // this.lists = db.collection("book-lists").valueChanges();
    // this.lists = db.collection("book-lists").snapshotChanges();
    this.lists = db.collection<any>("book-lists").valueChanges();
    console.log("Lists: " + this.lists);
  }

  createList(event) {
    this.bookListCollection = this.fireStore.collection("book-lists");
    this.bookListCollection.add({
      name: "list_name",
      lastModified: new Date().toLocaleDateString()
    });
  }

  itemTapped(event, list) {
    this.navCtrl.push(ListPage, {
      list: list
    });
  }
}

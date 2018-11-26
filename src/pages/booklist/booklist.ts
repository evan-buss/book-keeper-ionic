import { Component, ViewChild } from "@angular/core";
import { NavController } from "ionic-angular";
import { ListPage } from "../list/list";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs-compat";

@Component({
  selector: "page-booklist",
  templateUrl: "booklist.html"
})
export class BookListPage {
  @ViewChild("newListInput") newListInput;

  lists: Observable<any>;
  fireStore: AngularFirestore;
  bookListCollection: any;
  listName: String;
  inputVisible: boolean = false;

  constructor(public navCtrl: NavController, db: AngularFirestore) {
    this.fireStore = db;
    this.lists = db.collection<any>("book-lists").valueChanges();
    console.log("Lists: " + this.lists);
  }

  createList(event) {
    if (this.inputVisible == false) {
      this.inputVisible = true;
      setTimeout(() => {
        this.newListInput.setFocus();
      }, 150); //a least 150ms.
    } else if (this.inputVisible == true) {
      this.bookListCollection = this.fireStore.collection("book-lists");

      this.bookListCollection.doc(this.listName).set({
        name: this.listName,
        lastModified: new Date().toLocaleDateString()
      });
      this.listName = "";
      this.inputVisible = false;
    }
  }

  itemTapped(event, list) {
    this.inputVisible = false;
    this.navCtrl.push(ListPage, {
      list: list
    });
  }
}

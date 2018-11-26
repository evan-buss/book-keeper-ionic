import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs-compat";

import { DetailsPage } from "../details/details";

@IonicPage()
@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  public listName: string;
  public books: Observable<any>;
  public bookListRef: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFirestore
  ) {
    this.listName = navParams.get("list").name;
    this.bookListRef = this.db
      .collection("book-lists")
      .doc(this.listName)
      .collection("books");
    this.books = this.bookListRef.valueChanges();
  }

  swipeEvent(event) {
    // User swipes right
    if (event.direction == 4) {
      this.navCtrl.pop();
    }
  }

  editBook(title) {
    this.navCtrl.push(DetailsPage, {
      listName: this.listName,
      bookTitle: title,
      purpose: "edit"
    });
  }

  addBook(event) {
    this.navCtrl.push(DetailsPage, {
      listName: this.listName,
      bookTitle: "",
      purpose: "add"
    });
  }

  // ionViewDidLoad() {
  //   console.log("ionViewDidLoad ListPage");
  // }
}

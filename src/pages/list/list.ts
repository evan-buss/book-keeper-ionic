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

  addBook(event) {
    this.navCtrl.push(DetailsPage, {
      listName: this.listName,
      title: "Add a Book"
    });

    // console.log("Book create event here");
    // this.bookListRef.add({
    //   title: "Book Title",
    //   author: "Book Author",
    //   dateAdded: new Date().toLocaleDateString()
    // });
  }

  // ionViewDidLoad() {
  //   console.log("ionViewDidLoad ListPage");
  // }
}

import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { AlertController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-details",
  templateUrl: "details.html"
})
export class DetailsPage {
  @ViewChild("titleInput") titleInput;
  @ViewChild("authorInput") authorInput;

  listName: string;
  editNotAdd: boolean;
  imgProvided: boolean = false;

  // Firebase ref to full booklist
  bookListCol: AngularFirestoreCollection;
  selBookDoc: AngularFirestoreDocument;
  books: any;
  // books: Observable<Book[]>;

  navTitle: string;
  bookID: string;
  bookTitle: string;
  bookAuthor: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFirestore,
    public alertCtrl: AlertController
  ) {
    // Get info from the navigation parameters and assign local vars
    this.listName = navParams.get("listName");
    // this.bookTitle = navParams.get("bookTitle");
    if (navParams.get("purpose") === "edit") {
      this.editNotAdd = true;
      this.navTitle = "Edit: " + navParams.get("bookTitle");
    } else {
      this.navTitle = "Add a Book";
      this.editNotAdd = false;
    }

    // Get reference to the book collection of the given list
    this.bookListCol = db
      .collection("book-lists")
      .doc(this.listName)
      .collection("books");

    // Get
    db.collection("book-lists")
      .ref.where("name", "==", "to-read")
      .get()
      .then(snap => {
        if (!snap.empty) {
          let results = snap.docs.map(item => {
            return item.data();
          });
          console.log("Query test: ", results[0].name);
        }
      });

    // Populate local variables with book information from firebase
    if (this.editNotAdd) {
      db.collection("book-lists")
        .doc(this.listName)
        .collection("books")
        .ref.where("title", "==", navParams.get("bookTitle"))
        .get()
        .then(snap => {
          if (!snap.empty) {
            let results = snap.docs.map(item => {
              return { id: item.id, data: item.data() };
            });
            this.bookAuthor = results[0].data.author;
            this.bookTitle = results[0].data.title;
            this.bookID = results[0].id;
          } else {
            console.log("No results for the query...");
          }
        });
      console.log(this.bookTitle);
      console.log(this.bookAuthor);
    }
  }

  saveChanges() {
    if (this.editNotAdd) {
      this.editBook();
    } else {
      this.addBook();
    }
    this.navCtrl.pop();
  }

  editBook() {
    console.log("edit book function");
    this.bookListCol.doc(this.bookID).update({
      author: this.bookAuthor,
      title: this.bookTitle
    });
  }

  addBook() {
    console.log("Book create event here");
    this.bookListCol.doc(this.bookTitle).set({
      title: this.bookTitle,
      author: this.bookAuthor,
      dateAdded: new Date().toLocaleDateString()
    });
  }

  deleteBook() {
    const confirm = this.alertCtrl.create({
      title: "Are you sure you want to delete this book?",
      message: "Once a book is deleted you can not recover it.",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Delete cancelled");
          }
        },
        {
          text: "Yes",
          handler: () => {
            if (this.editNotAdd == false) {
              console.log("Delete existing book.");
            } else {
              console.log("Cancel book creation");
            }
          }
        }
      ]
    });
    confirm.present();
  }

  // ionViewDidLoad() {
  //   console.log("ionViewDidLoad DetailsPage");
  // }
}

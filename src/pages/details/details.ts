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

  // The name of the specific book list. Used to retrieve document of the
  //  same name
  listName: string;
  // True if book already exists otherwise a new book will be created
  editNotAdd: boolean;
  // True if there is an image associated with the book
  imgProvided: boolean = false;

  // Firebase collection for books in the given book list
  bookListCol: AngularFirestoreCollection;

  // The formatted string that will be displayed in the navbar
  // Changes depending on if the user is creating or editing a book
  navTitle: string;
  // The associated information of the book being edited or created
  book: any = {
    id: "",
    title: "",
    author: "",
    photoURL: ""
  };

  // bookID: string;
  // // The title of the book being edited or created
  // bookTitle: string;
  // bookAuthor: string;

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

    // Populate local variables with book information from firebase
    // Search for the document with the book title given as a parameter
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
            this.book.author = results[0].data.author;
            this.book.title = results[0].data.title;
            this.book.id = results[0].id;
          } else {
            console.log("No results for the query...");
          }
        });
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

  // Used to update the details of a book, not overwrite the entire thing
  editBook() {
    this.bookListCol.doc(this.book.id).update({
      author: this.book.author,
      title: this.book.title
    });
  }

  // Used to add a new book with all new information
  addBook() {
    this.bookListCol.doc(this.book.title).set({
      title: this.book.title,
      author: this.book.author,
      dateAdded: new Date().toLocaleDateString()
    });
  }

  // Delete the selected book. Prompts user before deleting
  deleteBook() {
    const confirm = this.alertCtrl.create({
      title: this.editNotAdd
        ? "Are you sure you want to delete this book?"
        : "Are you sure you want to cancel book creation?",
      message: this.editNotAdd
        ? "Once a book is deleted you can not recover it."
        : "Entered information will not be saved.",
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
            if (this.editNotAdd) {
              this.bookListCol.doc(this.book.id).delete();
            } else {
              this.book.author = "";
              this.book.title = "";
            }
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }
}

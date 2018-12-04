import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { AlertController } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { v4 as uuid } from "uuid";
import * as firebase from "firebase/app";
import "firebase/storage";

// @IonicPage()
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
    photoURL: "",
    rating: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public db: AngularFirestore,
    public storage: AngularFireStorage,
    public camera: Camera
  ) {
    // Get info from the navigation parameters and assign local vars
    this.listName = navParams.get("listName");
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
            this.book.photoURL = results[0].data.photoURL;
            this.book.rating = results[0].data.rating;
            if (this.book.photoURL !== "" && this.book.photoURL !== null) {
              this.imgProvided = true;
            }
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
      title: this.book.title,
      photoURL: this.book.photoURL,
      rating: this.book.rating
    });
  }

  incrementCount(list) {
    // Get the current bookCount for the list
    firebase
      .firestore()
      .collection("book-lists")
      .doc(list)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data().bookCount;
        }
      })
      .then(count => {
        // Increment the current bookCount for the list
        firebase
          .firestore()
          .collection("book-lists")
          .doc(list)
          .update({ bookCount: count + 1 });
      });
  }

  decrementCount(list) {
    // Get the current bookCount for the list
    firebase
      .firestore()
      .collection("book-lists")
      .doc(list)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data().bookCount;
        }
      })
      .then(count => {
        // Decrement the current bookCount for the list
        firebase
          .firestore()
          .collection("book-lists")
          .doc(list)
          .update({ bookCount: count - 1 });
      });
  }

  // Used to add a new book with all new information
  addBook() {
    this.incrementCount(this.listName);
    this.bookListCol.doc(this.book.title).set({
      title: this.book.title,
      author: this.book.author,
      photoURL: this.book.photoURL,
      dateAdded: new Date().toLocaleDateString(),
      rating: this.book.rating
    });
  }

  changeList() {
    let readingLists = [];
    let alert = this.alertCtrl.create();
    alert.setTitle("Move book to another list");

    firebase
      .firestore()
      .collection("book-lists")
      .get()
      .then(doc => {
        return doc.docs;
      })
      .then(documents => {
        readingLists = documents.map(list => {
          return list.id;
        });
        // console.log("documents" + documents);
        // console.log("readingLists" + readingLists);
        // console.log("length: " + readingLists.length);

        if (readingLists.length > 1) {
          alert.setSubTitle("Select a list");
          for (let i = 0; i < readingLists.length; i++) {
            alert.addInput({
              id: (i + 1).toString(),
              type: "radio",
              label: readingLists[i],
              value: readingLists[i],
              checked: readingLists[i] === this.listName ? true : false
            });
          }
        } else {
          alert.setSubTitle("No other booklists other than " + this.listName);
        }
        alert.addButton("Cancel");
        alert.addButton({
          text: "OK",
          handler: newList => {
            // Copy the data from the existing item
            firebase
              .firestore()
              .collection("book-lists")
              .doc(this.listName)
              .collection("books")
              .doc(this.book.title)
              .get()
              .then(object => {
                // Create a new document with the data in the new list
                firebase
                  .firestore()
                  .collection("book-lists")
                  .doc(newList)
                  .collection("books")
                  .doc(object.data().title)
                  .set(object.data());

                this.incrementCount(newList);
                // .then(() => {});
              })
              .then(() => {
                firebase
                  .firestore()
                  .collection("book-lists")
                  .doc(this.listName)
                  .collection("books")
                  .doc(this.book.title)
                  .delete();
                this.decrementCount(this.listName);
              });
            this.navCtrl.pop();
          }
        });
      })
      .then(() => {
        alert.present();
      });
  }

  rateBook(event) {
    let alert = this.alertCtrl.create();
    alert.setTitle("Book Rating");

    alert.addInput({
      type: "radio",
      label: "⭐",
      value: "1",
      checked: this.book.rating === "1" ? true : false
    });
    alert.addInput({
      type: "radio",
      label: "⭐⭐",
      value: "2",
      checked: this.book.rating === "2" ? true : false
    });
    alert.addInput({
      type: "radio",
      label: "⭐⭐⭐",
      value: "3",
      checked: this.book.rating === "3" ? true : false
    });
    alert.addInput({
      type: "radio",
      label: "⭐⭐⭐⭐",
      value: "4",
      checked: this.book.rating === "4" ? true : false
    });
    alert.addInput({
      type: "radio",
      label: "⭐⭐⭐⭐⭐",
      value: "5",
      checked: this.book.rating === "5" ? true : false
    });

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        this.book.rating = data;
        // console.log("new rating: " + data);
      }
    });
    alert.present();
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
            // console.log("Delete cancelled");
          }
        },
        {
          text: "Yes",
          handler: () => {
            if (this.editNotAdd) {
              this.bookListCol.doc(this.book.id).delete();
              this.decrementCount(this.listName);
              firebase
                .storage()
                .refFromURL(this.book.photoURL)
                .delete();
            } else {
              this.book.author = "";
              this.book.title = "";
              if (this.book.photoURL !== "") {
                firebase
                  .storage()
                  .refFromURL(this.book.photoURL)
                  .delete();
              }
            }
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  myPhoto: any;
  imageUploading: boolean = false;

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 800,
      targetWidth: 800,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true,
      saveToPhotoAlbum: true
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        this.myPhoto = imageData;
        this.uploadPhoto();
      })
      .catch(error => {
        // console.log("Error taking picture: ", error);
      });
  }

  private uploadPhoto(): void {
    this.imageUploading = true;
    var imageRef = firebase.storage().ref("bookPhotos/" + uuid() + ".jpeg");
    imageRef
      .putString(this.myPhoto, "base64", { contentType: "image/jpeg" })
      .then(() => {
        imageRef.getDownloadURL().then(url => {
          // Delete old photo from library if it already exists
          if (this.book.photoURL !== "") {
            this.imgProvided = false;
            let oldURL = this.book.photoURL;
            this.book.photoURL = "";
            firebase
              .storage()
              .refFromURL(oldURL)
              .delete();
          }
          this.book.photoURL = url;
          this.imgProvided = true;
          this.imageUploading = false;
        });
      });
  }
}

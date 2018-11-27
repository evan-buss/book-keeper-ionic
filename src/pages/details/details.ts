import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { AlertController } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import firebase from "firebase";

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
            console.log("Photo URL: " + this.book.photoURL);
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
      photoURL: this.book.photoURL
    });
  }

  // Used to add a new book with all new information
  addBook() {
    if (this.book.title === "" || this.book.author == "") {
      console.log("Enter some shit bro");
    } else {
      this.bookListCol.doc(this.book.title).set({
        title: this.book.title,
        author: this.book.author,
        photoURL: this.book.photoURL,
        dateAdded: new Date().toLocaleDateString()
      });
    }
  }
  rateBook() {
    const rating = this.alertCtrl.create({
      title: "Book Rating"
    });
    rating.present();
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

  myPhoto: any;
  restrictSave: boolean = false;

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true
    };
    this.camera.getPicture(options).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    });
  }

  private uploadPhoto(): void {
    this.restrictSave = true;
    var imageRef = firebase
      .storage()
      .ref("bookPhotos/" + this.book.author + "_" + this.book.title + ".jpeg");
    imageRef
      .putString(this.myPhoto, "base64", { contentType: "image/jpeg" })
      .then(() => {
        imageRef.getDownloadURL().then(url => {
          console.log(url);
          this.book.photoURL = url;
          this.imgProvided = true;
          this.restrictSave = false;
        });
      });
  }
}

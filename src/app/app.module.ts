import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";

// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";

// Pages
import { AboutPage } from "../pages/about/about";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { BookListPage } from "../pages/booklist/booklist";
import { ListPage } from "../pages/list/list";
import { DetailsPage } from "../pages/details/details";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Camera } from "@ionic-native/camera";

export const firebaseConfig = {
  apiKey: "AIzaSyBeO_sQclab8IK0JR6zGWztrz3fRnfj9Iw",
  authDomain: "book-list-68850.firebaseapp.com",
  databaseURL: "https://book-list-68850.firebaseio.com",
  projectId: "book-list-68850",
  storageBucket: "book-list-68850.appspot.com",
  messagingSenderId: "5517341615"
};
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage,
    BookListPage,
    ListPage,
    DetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage,
    BookListPage,
    ListPage,
    DetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}

import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
// import { AngularFireStorageModule } from "@angular/fire/storage";
import { firebaseConfig } from "../environments/environment";

import { AboutPage } from "../pages/about/about";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { BookListPage } from "../pages/booklist/booklist";
import { ListPage } from "../pages/list/list";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

@NgModule({
  declarations: [MyApp, AboutPage, HomePage, TabsPage, BookListPage, ListPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    TabsPage,
    BookListPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}

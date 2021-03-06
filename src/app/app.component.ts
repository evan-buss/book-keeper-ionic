import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { TabsPage } from "../pages/tabs/tabs";
import * as firebase from "firebase/app";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = TabsPage;
  public globalString: String = "Test String :)";

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyBeO_sQclab8IK0JR6zGWztrz3fRnfj9Iw",
      authDomain: "book-list-68850.firebaseapp.com",
      databaseURL: "https://book-list-68850.firebaseio.com",
      projectId: "book-list-68850",
      storageBucket: "book-list-68850.appspot.com",
      messagingSenderId: "5517341615"
    });

    firebase.firestore().settings({
      timestampsInSnapshots: true
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault(); // Was showing a black status bar for me
      statusBar.styleLightContent();
      splashScreen.hide();
    });
  }
}

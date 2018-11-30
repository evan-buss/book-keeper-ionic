import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams
} from "ionic-angular";
@IonicPage()
@Component({
  selector: "page-modal-content",
  templateUrl: "modal-content.html"
})
export class ModalContentPage {
  reminderTime: Date;
  // reminderDays: Object = {
  //   monday: false,
  //   tuesday: false,
  //   wednesday: false,
  //   thursday: false,
  //   friday: false,
  //   saturday: false,
  //   sunday: false
  // };
  // reminderDays: boolean[] = [false, false, false, false, false, false, false];
  reminderDays: boolean[];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    this.reminderDays = navParams.get("reminderDays");
    this.reminderTime = navParams.get("reminderTime");
  }

  dismiss() {
    this.viewCtrl.dismiss({
      reminderDays: this.reminderDays,
      reminderTime: this.reminderTime
    });
  }
}

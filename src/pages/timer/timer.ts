import { Component } from "@angular/core";
import {
  NavController,
  ToastController,
  ModalController,
  NavParams
} from "ionic-angular";
import { LocalNotifications } from "@ionic-native/local-notifications";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { ModalContentPage } from "../modal-content/modal-content";
import * as moment from "moment";

export interface CountdownTimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
}

// @IonicPage()
@Component({
  selector: "page-timer",
  templateUrl: "timer.html"
})
export class TimerPage {
  timeInSeconds: number;
  timeInMinutes: number;
  timer: CountdownTimer;
  timerReady: boolean = false;
  reminderDays: boolean[] = [false, false, false, false, false, false, false];
  reminderTime: string;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private local: LocalNotifications,
    public navParams: NavParams
  ) {
    this.local.requestPermission().then(granted => {
      // if (granted) {
      //   console.log("Notification permission granted");
      // } else {
      //   console.log("Notification permission denied");
      // }
    });

    firebase
      .firestore()
      .collection("reminders")
      .doc("reminder")
      .get()
      .then(doc => {
        if (doc.exists) {
          this.reminderDays = doc.data().reminderDays;
          this.reminderTime = doc.data().reminderTime;
        }
      });
    firebase
      .firestore()
      .collection("reminders")
      .doc("reminderTime")
      .get();
  }

  public showModal() {
    const modal = this.modalCtrl.create(ModalContentPage, {
      reminderDays: this.reminderDays,
      reminderTime: this.reminderTime
    });

    modal.onDidDismiss(data => {
      this.reminderDays = data.reminderDays;
      this.reminderTime = data.reminderTime;
      this.saveReminder();
    });
    modal.present();
  }

  saveReminder() {
    firebase
      .firestore()
      .collection("reminders")
      .doc("reminder")
      .set({
        reminderDays: this.reminderDays,
        reminderTime: this.reminderTime
      });

    // Show toast that the reminder details where saved
    let toast = this.toastCtrl.create({
      message: "Reminder updated!",
      duration: 2000,
      position: "top"
    });
    toast.present();

    let time = this.reminderTime.split(":");
    let hour = +time[0];
    let minutes = +time[1];

    this.reminderDays.forEach((value, index) => {
      if (value === true) {
        let dayNeeded = index + 1;
        let today = moment().isoWeekday();
        let notifDate;
        if (today <= dayNeeded) {
          notifDate = moment()
            .isoWeekday(dayNeeded)
            .hours(hour)
            .minutes(minutes)
            .seconds(0)
            .toDate();
        } else {
          notifDate = moment()
            .add(1, "weeks")
            .isoWeekday(dayNeeded)
            .hours(hour)
            .minutes(minutes)
            .seconds(0)
            .toDate();
        }
        this.local.schedule({
          id: dayNeeded,
          title: "Time to Read!",
          text: "It is your scheduled reading time!",
          lockscreen: true,
          led: "1ABC9C",
          vibrate: true,
          trigger: { at: notifDate }
        });
      }
    });
  }

  handleStartButton() {
    this.timeInSeconds = this.timeInMinutes * 60;
    this.timerReady = true;
    this.initTimer();
  }

  ngOnInit() {
    this.timeInSeconds = this.timeInMinutes * 60;
    this.timerReady = true;
    this.initTimer();
  }

  hasFinished() {
    return this.timer.hasFinished;
  }

  initTimer() {
    if (!this.timeInSeconds) {
      this.timeInSeconds = 0;
    }

    this.timer = <CountdownTimer>{
      seconds: this.timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      secondsRemaining: this.timeInSeconds
    };

    this.timer.displayTime = this.getSecondsAsDigitalClock(
      this.timer.secondsRemaining
    );
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  pauseTimer() {
    this.timer.runTimer = false;
  }

  resumeTimer() {
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) {
        return;
      }
      this.timer.secondsRemaining--;
      this.timer.displayTime = this.getSecondsAsDigitalClock(
        this.timer.secondsRemaining
      );
      if (this.timer.secondsRemaining > 0) {
        this.timerTick();
      } else {
        this.timer.hasFinished = true;

        this.local.schedule({
          title: "Reading timer finished!",
          text:
            "You read for " +
            this.timeInMinutes +
            (this.timeInMinutes > 1 ? " minutes!" : " minute!"),
          vibrate: true,
          lockscreen: true,
          led: "1ABC9C"
        });
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - hours * 3600) / 60);
    const seconds = secNum - hours * 3600 - minutes * 60;
    let hoursString = "";
    let minutesString = "";
    let secondsString = "";
    hoursString = hours < 10 ? "0" + hours : hours.toString();
    minutesString = minutes < 10 ? "0" + minutes : minutes.toString();
    secondsString = seconds < 10 ? "0" + seconds : seconds.toString();
    return hoursString + ":" + minutesString + ":" + secondsString;
  }
}

import { Component, Input } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  ModalController,
  NavParams
} from "ionic-angular";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { ModalContentPage } from "../modal-content/modal-content";

export interface CountdownTimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
}

@IonicPage()
@Component({
  selector: "page-timer",
  templateUrl: "timer.html"
})
export class TimerPage {
  @Input() timeInSeconds: number;
  timer: CountdownTimer;
  timerReady: boolean = false;
  reminderDays: Object;
  reminderTime: Date;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
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

    let toast = this.toastCtrl.create({
      message: "Reminder updated!",
      duration: 2000,
      position: "top"
    });

    toast.present();
  }

  ngOnInit() {
    this.initTimer();
  }

  // handleChange(event) {
  //   this.timeInSeconds = event.value;
  //   this.timerReady = true;
  // }

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

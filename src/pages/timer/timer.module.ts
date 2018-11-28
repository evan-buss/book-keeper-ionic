import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TimerPage } from "./timer";
import { ModalContentPage } from "../modal-content/modal-content";

@NgModule({
  declarations: [TimerPage],
  imports: [ModalContentPage, IonicPageModule.forChild(TimerPage)]
})
export class TimerPageModule {}

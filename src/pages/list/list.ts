import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  public selectedList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedList = navParams.get("list");
    // console.log(db.collection(this.selectedList.name));

    console.log(this.selectedList);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ListPage");
  }
}

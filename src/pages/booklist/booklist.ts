import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { ListPage } from "../list/list";

@Component({
  selector: "page-booklist",
  templateUrl: "booklist.html"
})
export class BookListPage {
  lists: Array<{ name: string; lastModified: Date }> = [
    {
      name: "To-Read",
      lastModified: new Date()
    },
    {
      name: "Currently-Reading",
      lastModified: new Date()
    },
    {
      name: "Completed",
      lastModified: new Date()
    }
  ];

  constructor(public navCtrl: NavController) {}

  itemTapped(event, list) {
    this.navCtrl.push(ListPage, {
      list: list
    });
  }
}

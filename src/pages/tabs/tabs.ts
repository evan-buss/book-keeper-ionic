import { Component } from "@angular/core";

import { HomePage } from "../home/home";
import { BookListPage } from "../booklist/booklist";
import { TimerPage } from "../timer/timer";
import { AboutPage } from "../about/about";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = BookListPage;
  tab3Root = TimerPage;
  tab4Root = AboutPage;

  constructor() {}
}

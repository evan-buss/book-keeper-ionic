import { Component } from "@angular/core";

import { AboutPage } from "../about/about";
import { BookListPage } from "../booklist/booklist";
import { HomePage } from "../home/home";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = BookListPage;
  tab3Root = AboutPage;

  constructor() {}
}

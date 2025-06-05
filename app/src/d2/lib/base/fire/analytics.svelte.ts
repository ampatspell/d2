import { logEvent } from "@firebase/analytics";
import { firebase } from "./firebase.svelte";
import { browser } from "$app/environment";
import { afterNavigate } from "$app/navigation";

export class FirebaseAnalytics {
  private get service() {
    return firebase.analytics;
  }

  initialize() {
    if(browser) {
      afterNavigate(() => this.pageView());
    }
  }

  pageView() {
    logEvent(this.service, 'page_view');
  }
}

export const analytics = new FirebaseAnalytics();

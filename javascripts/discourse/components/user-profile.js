import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class SidebarWelcome extends Component {
  @service router;
  @service composer;
  @service siteSettings;
  @service site;
  @service currentUser;

  get isTopRoute() {
    const { currentRoute } = this.router;
    const topMenuRoutes = this.siteSettings.top_menu.split("|").filter(Boolean);
    return topMenuRoutes.includes(currentRoute.localName);
  }
}

import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import Composer from "discourse/models/composer";

export default class SidebarWelcome extends Component {
  @service router;
  @service composer;
  @service siteSettings;
  @service site;
  @service currentUser;

  get isTopicPage() {
    return this.router.currentRoute?.parent?.name === "topic"
  }
}

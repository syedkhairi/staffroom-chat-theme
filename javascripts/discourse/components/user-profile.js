import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

export default class SidebarWelcome extends Component {
  @service router;
  @service currentUser;
}

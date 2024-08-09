import Component from "@glimmer/component";
import { action } from "@ember/object";
import Composer from "discourse/models/composer";
import { inject as service } from "@ember/service";

export default class FakeInputCreate extends Component {
  @service composer;
  @service router;
  @service currentUser;

  get category() {
    return this.router.currentRoute?.attributes?.category;
  }

  get tag() {
    return this.router.currentRoute?.attributes?.tag;
  }

  @action
  customCreateTopic() {
    if (document.querySelector(".d-editor-input")) {
      document.querySelector(".d-editor-input").focus();
    } else {
      this.composer.open({
        action: Composer.CREATE_TOPIC,
        draftKey: Composer.NEW_TOPIC_KEY,
        categoryId: this.category?.id,
        tags: this.tag?.id,
      });
    }
  }
}

import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class LatestTopicsSidebar extends Component {
  @service router;
  @service store;
  @service siteSettings;
  @service currentUser;
  @tracked latestTopics = null;

  @action
  async getLatestTopics() {
    let topicList;

    if (this.currentUser) {
      topicList = await this.store.findFiltered("topicList", {
        filter: "read",
        params: {
          order: "latest",
        },
      });
    } else {
      topicList = await this.store.findFiltered("topicList", {
        filter: "latest",
        params: {
          order: "created",
        },
      });
    }

    this.latestTopics = topicList.topics
      .filter((topic) => !topic.closed)
      .slice(0, 5);
  }
}

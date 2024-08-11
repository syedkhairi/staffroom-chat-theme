import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import { getURLWithCDN } from "discourse-common/lib/get-url";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class UserProfile extends Component {
  @service router;
  @service composer;
  @service siteSettings;
  @service site;
  @service currentUser;
  @tracked bgUrl = null;
  @tracked flairUrl = null;

  get isTopRoute() {
    const { currentRoute } = this.router;
    const topMenuRoutes = this.siteSettings.top_menu.split("|").filter(Boolean);
    return topMenuRoutes.includes(currentRoute.localName);
  }

  get avatarUrl() {
    return this.currentUser.avatar_template.replace("{size}", 120);
  }

  @action
  async fetchBgUrl() {
   try {
      const response = await fetch(`/u/${this.currentUser.username}.json`);
      const data = await response.json(); // assuming this is json
      const profileBgUrl = data.user.profile_background_upload_url;
      const userFlairUrl = data.user.flair_url;
      this.bgUrl = getURLWithCDN(profileBgUrl);
      this.flairUrl = getURLWithCDN(userFlairUrl);
    } catch (error) {
      console.error("Failed:", error);
    }
  }

  @action
  goToProfile() {
    window.location.href = `/u/${this.currentUser.username}/summary`;
  }

  setupComponent(attrs, component) {
    if (!this.site.mobileView) {
      withPluginApi("0.8.7", (api) => {
        if (api.getCurrentUser() === null) return false;

        let username = component.currentUser.username;

        ajax(`/u/${username}/summary.json`).then((result) => {
          const {
            likes_received: userLikesReceived,
            likes_given: userLikesGiven,
            days_visited: userDayVisited,
            topic_count: userTopicCount,
            post_count: userPostCount,
            time_read: userTimeRead,
            bookmark_count: userBookmarkCount,
            solved_count: userSolvedCount,
          } = result.user_summary;

          component.userLikesReceived = userLikesReceived;
          component.userLikesGiven = userLikesGiven;
          component.userDayVisited = userDayVisited;
          component.userTopicCount = userTopicCount;
          component.userPostCount = userPostCount;
          component.userTimeRead = userTimeRead;
          component.userBookmarkCount = userBookmarkCount;
          component.userSolvedCount = userSolvedCount;

          component.userName = api.getCurrentUser().name;
          component.user = api.getCurrentUser().username;
        });

        ajax(`/u/${username}/card.json`).then((result) => {
          const userCardBg = result.user.card_background_upload_url;
          const stinkinBadges = result.badges ? result.badges : [];
          const allBadges = result.user.badge_count;

          component.userCardBg = getURLWithCDN(userCardBg);
          component.stinkinBadges = stinkinBadges;
          component.allBadges = allBadges;
        });
      });
    }
  }
}

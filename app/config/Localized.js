import Utility from './Utility';

var Localized = function(key) {
  var value = key
  value = english[key]
  return value
}

String.prototype.Localized = function() {
  return Localized(String(this))
};

export default Localized;

let english = {
  sign_in: "Sign In",
  create_group: "Create Group",
  save: "Save",
  done: "Done",
  group_title: "Group Title",
  group_type: "Group Type",
  description: "Description",
  location: "Location",
  group_members: "Group Members",
  topics: "Topics",
  upload_image: "Upload Image",
  view_all: "View All",
  private: "Private",
  public: "Public",
  manage_topics: "Manage Topics",
  add_topic: "Add Topic",
  add_member: "Add Member",
  invite_user: "Invite User",
  email: "Email",
  phone: "Phone",
  groups: "Groups",
  members: "Members",
  select_profile: "Select Profile Image",
  search_here: "Search here",
  meetups: "Meetups",
  new_post: "New Post",
  add_post_prompt_text: "A penny for your thoughts...",
  leave_the_group: "Leave the Group",
  close: "Close"
}

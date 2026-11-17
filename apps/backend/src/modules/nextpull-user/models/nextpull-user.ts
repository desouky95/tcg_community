import { model } from "@medusajs/framework/utils";

export const NextPullUser = model.define("nextpull-user", {
  id: model.id().primaryKey(),
  next_pull_user_id: model.text().unique(),
});

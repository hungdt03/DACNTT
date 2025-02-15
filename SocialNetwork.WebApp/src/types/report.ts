import { CommentResource } from "./comment";
import { GroupResource } from "./group";
import { PostResource } from "./post";
import { UserResource } from "./user";

export type ReportResource = {
    id: string;
    reason: string;
    reportType: string;
    resolutionNotes: string;
    status: string;
  
    group: GroupResource;
    reporter: UserResource;
    targetUser: UserResource;
    targetPost: PostResource;
    targetGroup: GroupResource;
    targetComment: CommentResource;
    resolvedAt: Date;
    dateCreatedAt: Date;
  }
  
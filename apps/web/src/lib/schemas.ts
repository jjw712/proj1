import { z } from "zod";

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(), // ISO string
});

export const PostsPageSchema = z.object({
  items: z.array(PostSchema),
  nextCursor: z.number().nullable(),
});

export type Post = z.infer<typeof PostSchema>;
export type PostsPage = z.infer<typeof PostsPageSchema>;

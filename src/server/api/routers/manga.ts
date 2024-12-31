import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { favouriteManga } from "~/server/db/schema";

export const mangaRouter = createTRPCRouter({
  addFavourite: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(favouriteManga).values({
        mangaId: input,
        userId: ctx.session?.user.id ?? "",
      });
    }),
  getUserFavourite: publicProcedure.query(async ({ ctx }) => {
    const favourite = await ctx.db.query.favouriteManga.findMany({
      where: eq(favouriteManga.userId, ctx.session?.user.id ?? ""),
    });
    return favourite;
  }),
  removeFavoutite: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(favouriteManga)
        .where(
          and(
            eq(favouriteManga.userId, ctx.session?.user.id ?? ""),
            eq(favouriteManga.mangaId, input),
          ),
        );
    }),
});

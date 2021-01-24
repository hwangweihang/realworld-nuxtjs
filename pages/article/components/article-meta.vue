<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.username" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt }}</span>
    </div>
    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following,
      }"
      :disabled="followDisabled"
      @click="onFollow(article.author)"
    >
      <i class="ion-plus-round"></i>
      &nbsp; Follow {{ article.author.username }}
      <span class="counter">(10)</span>
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited,
      }"
      :disabled="favoriteDisabled"
      @click="onFavorite(article)"
    >
      <i class="ion-heart"></i>
      &nbsp; Favorite Post
      <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import { followUser, unfollowUser } from "@/api/user";
import { addFavorite, deleteFavorite } from '@/api/article'

export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {
      followDisabled: false,
      favoriteDisabled: false,
    };
  },
  methods: {
    async onFollow(author) {
      this.followDisabled = true;
      if (author.following) {
        await unfollowUser(author.username);
        author.following = false;
      } else {
        await followUser(author.username);
        author.following = true;
      }
      this.followDisabled = false;
    },
    async onFavorite(article){
        this.favoriteDisabled = true;
        if(article.favorited){
          await deleteFavorite(article.slug);
          article.favorited = false;
          article.favoritesCount--;
        }else {
          await addFavorite(article.slug);
          article.favorited = true;
          article.favoritesCount++;
        }
        this.favoriteDisabled = false;
      }
  },
};
</script>

<style>
</style>
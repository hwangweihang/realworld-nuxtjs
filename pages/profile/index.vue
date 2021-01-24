<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp; Follow {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'my' }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      tab: 'my',
                    }
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'favorite' }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      tab: 'favorite',
                    }
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="`/profile/${article.author.username}`"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="`/profile/${article.author.username}`"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{ article.createdAt }}</span>
              </div>
              <button
                class="btn btn-sm pull-xs-right"
                :class="{
                  'btn-primary': article.favorited,
                  'btn-outline-primary': !article.favorited,
                }"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="'/article/' + article.slug" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.articlesCount }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile } from "@/api/profile";
import { getArticles, addFavorite, deleteFavorite } from "@/api/article";

export default {
  middleware: "authenticated",
  watchQuery: ['tab'],
  name: "ProfileIndex",
  data: function () {
    return {
      tab: "myarticles",
    };
  },
  async asyncData({ params, query }) {
    const profileRes = await getProfile(params.username);
    const profile = profileRes.data.profile;
    let tab = query.tab || "my";

    const articlesRes = await getArticles({
      [tab === "my" ? "author" : "favorited"]: profile.username,
    });

    const articles = articlesRes.data.articles;
    articles.forEach(function (article) {
      article.favoriteDisabled = false;
    });

    return {
      profile,
      articles,
      tab,
    };
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount--;
      } else {
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount++;
      }
      article.favoriteDisabled = false;
    },
  },
};
</script>

<style>
</style>
<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }" 
                  v-if="user"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }" 
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag
                    }
                  }" 
                  v-if="tag">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="`/profile/${article.author.username}`"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link :to="`/profile/${article.author.username}`" class="author">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt }}</span>
              </div>
              <button 
                class="btn btn-sm pull-xs-right" 
                :class="{ 'btn-primary': article.favorited, 'btn-outline-primary': !article.favorited }"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="'/article/'+article.slug" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.articlesCount }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li 
                class="page-item" 
                :class="{ active: i === page }"
                v-for="i in totalPage" 
                :key="i"
              >
                <nuxt-link class="page-link" :to="{
                  name: 'home',
                  query: {
                    page: i,
                    tag: $route.query.tag,
                    tab: tab
                  }
                }">{{ i }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link 
                class="tag-pill tag-default" 
                v-for="t in tags"
                :key="t"
                :to="{
                  name: 'home',
                  query: {
                    tag: t,
                    tab: 'tag'
                  }
                }"
              >{{ t }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from "vuex";

export default {
    name: 'HomeIndex',
    watchQuery: ['page', 'tag', 'tab'],//NOTE: 监听query参数，实现路由跳转
    async asyncData ({ query, store }){//NOTE：路由跳转的时候，同样会进这个方法，每次重查询都是通过路由跳转实现的
      let page = parseInt(query.page) || 1;
      let tag = query.tag;
      let limit = 20;
      let tab = query.tab || 'global_feed';

      const [ articleRes, tagRes ] = await Promise.all([
        ( store.state.user && tab === 'your_feed' ) ? getFeedArticles({
          limit,
          offset: ( page - 1)*limit,
        }) : getArticles({
          limit,
          offset: ( page - 1)*limit,
          tag
        }),
        getTags()
      ]);

      const { articles, articlesCount } = articleRes.data;
      const { tags } = tagRes.data;

      articles.forEach(function(article){
        article.favoriteDisabled = false;
      });

      return {
        articles,
        articlesCount,
        tags,
        limit,
        page,
        tag,
        tab
      };
    },
    computed: {
      ...mapState(['user']),
      totalPage () {
        return Math.ceil( this.articlesCount / this.limit ); 
      }
    },
    methods: {
      async onFavorite(article){
        article.favoriteDisabled = true;
        if(article.favorited){
          await deleteFavorite(article.slug);
          article.favorited = false;
          article.favoritesCount--;
        }else {
          await addFavorite(article.slug);
          article.favorited = true;
          article.favoritesCount++;
        }
        article.favoriteDisabled = false;
      }
    }
};
</script>

<style>
</style>
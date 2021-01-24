<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="newComment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click="handleAddComment">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment } from "@/api/article";
import { mapState } from "vuex";

export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data: function () {
    return {
      comments: [],
      newComment: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created: async function () {
    const { data } = await getComments(this.article.slug);

    this.comments = data.comments;
  },
  methods: {
    async handleAddComment(event) {
        event.preventDefault();  //NOTE: form元素内button的click事件会引起页面自动刷新

        const { data } = await addComment(this.article.slug, {
          comment: {
            body: this.newComment,
          },
        });

        this.newComment = "";
        this.comments.push(data.comment);
    },
  },
};
</script>

<style>
</style>
<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags, separate tags with comma"
                  v-model="article.tagListStr"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                :disabled="publishDisabled"
                @click.prevent="publishArticle"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from "@/api/article";

export default {
  middleware: "authenticated",
  name: "Editor",
  data() {
    return {
      publishDisabled: false,
    };
  },
  async asyncData({ params }) {
    let article;
    if (params.slug) {
      const { data } = await getArticle(params.slug);
      article = data.article;
      article.tagListStr = article.tagList.join(",");
    } else {
      article = {
        title: "",
        description: "",
        body: "",
        tagListStr: "",
      };
    }

    return {
      article,
    };
  },
  methods: {
    async publishArticle() {
      this.publishDisabled = true;

      const slug = this.$route.params.slug;

      if (!slug) {
        this.article.tagList = this.article.tagListStr.split(",");
        const { data } = await createArticle({
          article: this.article,
        });
        
        alert("Article created successfully!");

        this.$router.push({
          name: "editor",
          params: {
            slug: data.article.slug,
          },
        });

      } else {
        this.article.tagList = this.article.tagListStr.split(",");
        const { data } = await updateArticle(slug, {
          article: this.article,
        });

        alert("Article updated successfully!");
      }

      this.publishDisabled = false;

    },
  },
};
</script>

<style>
</style>
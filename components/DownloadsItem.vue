<template>
  <div class="content">
    <div class="content">
      <p v-if="version"> The latest <b>{{ branch }}</b> version of {{ name }} was released on <b>{{ parseTimestamp(timestamp).toLocaleString() }}</b>
        (<span v-if="build"><a :href='`https://ci-dev.craftationgaming.com/job/${name}/${build}`' target="_blank" rel="noopener noreferrer">build {{ build }}</a>, <a :href='`https://github.com/${git}/commits/master`' target="_blank" rel="noopener noreferrer">commit history</a></span><span v-if="branch === 'stable'"><a :href='`https://github.com/${git}/releases`' target="_blank" rel="noopener noreferrer">changelog</a></span>).
      </p>
    </div>
    <div class="box">
      <div class="columns">
        <div class="column is-narrow">
          <u>
            <p class="title is-4 no-margin-bottom">{{ name }}</p>
          </u>
          <p>{{ version }}</p>
        </div>
        <div class="column">
          <div class="tags column-margin-top">
            <span v-for="tag in tags" :key="tag.name" :class="tagClass(tag)">
              <b>{{ tag.text }}</b>
            </span>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="buttons column-margin-top">
            <b-button type="is-info" style="background-color:#776202" v-if="branch !== 'stable'" tag="a" @click="toggleLastCommits">b{{build}} Changes</b-button>
            <b-button type="is-info" tag="a" @click="toggleCommits">Changelog</b-button>
            <b-button type="is-button-primary" v-if="downloadUrl && !landingUrl" tag="a" :href="downloadUrl"> Download </b-button>
            <b-button :type="downloadUrl ? 'is-button-primary' : 'is-button-secondary'" v-if="landingUrl && branch === 'stable'" tag="a" :href="landingUrl" target="_blank" rel="noopener noreferrer"> Download </b-button>
          </div>
        </div>
      </div>
      <hr/>
      <div class="message-body">
        <p v-html="description"></p>
      </div>
      <div>
        <hr v-if="build && showLastCommits"/>
        <Changelog
            v-if="build"
            :show="showLastCommits"
            messageType="warning"
            :title="`b${build} Changes`"
            :groupedCommits="groupedLastCommits"
            :formatCommit="formatCommit"
            :git="git"
            :toggle="toggleLastCommits"
        />
        <hr v-if="showCommits"/>
        <Changelog
            :show="showCommits"
            messageType="info"
            :title="branch === 'stable' ? 'Release Changelog' : 'Snapshot Changelog'"
            :groupedCommits="groupedCommits"
            :formatCommit="formatCommit"
            :git="git"
            :toggle="toggleCommits"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Changelog from './Changelog.vue';
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        version: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        git: {
          type: String,
          required: true
        },
        downloadUrl: {
            type: String,
            required: false
        },
        landingUrl: {
            type: String,
            required: false
        },
        commits: {
          type: Array,
          required: false,
          default: () => []
        },
        lastCommits: {
          type: Array,
          required: false,
          default: () => []
        },
        build: {
            type: String,
            required: false
        },
        timestamp: {
          type: String,
          required: false
        },
        info: {
            type: String,
            required: false
        },
        tags: {
            type: Array,
            required: false
        }
    },
    data() {
      return {
        showCommits: false,
        showLastCommits: false
      }
    },
    components: {
      Changelog
    },
    computed: {
        groupedCommits() {
          if (!this.commits || !Array.isArray(this.commits)) {
            return {};
          }

          return this.commits.reduce((acc, commit) => {
            if (!acc[commit.commitType]) {
              acc[commit.commitType] = [];
            }
            acc[commit.commitType].push(commit);
            return acc;
          }, {});
        },
        groupedLastCommits() {
          if (!this.lastCommits || !Array.isArray(this.lastCommits)) {
            return {};
          }

          return this.lastCommits.reduce((acc, commit) => {
            if (!acc[commit.commitType]) {
              acc[commit.commitType] = [];
            }
            acc[commit.commitType].push(commit);
            return acc;
          }, {});
        }
      },
    methods: {
        toggleCommits() {
          this.showCommits = !this.showCommits;
        },
        toggleLastCommits() {
          this.showLastCommits = !this.showLastCommits;
        },
        formatCommit(string) {
          return string.replace(/`([^`]+)`/g, '<b>$1</b>');
        },
        tagClass(tag) {
          let tagColor = tag.color || "primary";
          return {
            tag: true,
            [`is-${tagColor}`]: true
          };
        },
        parseTimestamp(timestamp) {
          if (!timestamp) return new Date();
          const date = new Date(typeof timestamp === 'string' && /^\d+$/.test(timestamp) ? Number(timestamp) : timestamp);
          return isNaN(date.getTime()) ? new Date() : date;
        }
    },
    watch: {
      branch() {
        this.showCommits = false;
        this.showLastCommits = false;
      }
    }
}
</script>

<style>
.no-margin-bottom {
    margin-bottom: 0;
}

.column-margin-top {
    margin-top: 0.2rem
}
</style>
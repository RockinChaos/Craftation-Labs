<template>
  <div v-if="show" :class="`message is-${messageType}`" class="mb-5">
    <div class="message-body">
      <div class="flex-container">
        <u><p class="title is-4 no-margin-bottom">{{ title }}</p></u>
        <b-button class="btn is-info" tag="a" @click="toggle">{{ show ? '&times;' : '+' }}</b-button>
      </div>
      <div v-if="Object.keys(groupedCommits).length > 0">
        <div v-for="(commits, type) in groupedCommits" :key="type">
          <h4 class="mt-5">{{ type }}</h4>
          <ul>
            <li v-for="commit in commits" :key="commit.commitId">
              <b>{{ formatCommit(commit.commitName) }}</b>
              <span v-if="commit.commitId">(<a :href="`https://github.com/${git}/commit/${commit.commitId}`" target="_blank" rel="noopener noreferrer">{{ commit.commitId.substring(0, 7) }}</a>)</span>
              <ul v-if="commit.commitDescription && commit.commitDescription.trim().length > 0" class="description-list">
                <li><span v-html="formatCommit(commit.commitDescription)"></span></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>No changes found</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    messageType: String,
    title: String,
    groupedCommits: Object,
    formatCommit: Function,
    git: String,
    toggle: Function
  }
}
</script>

<style>
.no-margin-bottom {
  margin-bottom: 0;
}

.flex-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn {
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
  padding: 0.15rem 0.25rem 0.25rem 0.25rem;
  height: 1.5rem;
}
</style>
<template>
    <div>
        <div class="columns">
            <div class="column">
                <div class="buttons has-addons">
                    <b-button
                        label="Stable releases"
                        @click="branch = 'stable'"
                        :loading="this.external.builds['stable'].loading"
                        :type="branch == 'stable' ? 'is-primary' : null"
                    />
                    <b-button
                        label="Development builds"
                        @click="branch = 'dev'"
                        :loading="this.external.builds['dev'].loading"
                        :type="branch == 'dev' ? 'is-primary' : null"
                    />
                </div>

                <b-notification type="is-danger" v-if="error" :closable="false">
                    <p>
                        Could not load the latest dev builds. <a href="#" @click="refreshDownloads">Retry</a>, or
                        click <a href="https://ci-dev.craftationgaming.com/" target="_blank" rel="noopener noreferrer">here</a> to view builds on Jenkins.
                    </p>
                    <p>
                        If the issue persists, check <saber-link to="/community">Discord</saber-link> for updates
                        and alternative download links.
                    </p>
                </b-notification>
                
                <div v-if="!loading">

                    <h1 class="title is-4">Plugins</h1>

                    <downloads-item
                        v-bind="plugins.itemjoin"
                        :branch="branch"
                    />

                    <hr type="is-danger">

                    <downloads-item
                        v-bind="plugins.fakecreative"
                        :branch="branch"
                    />

                    <downloads-item
                        v-bind="plugins.cloudsync"
                        :branch="branch"
                    />


                    <hr type="is-danger" v-if="branch === 'stable'">

                    <h1 class="title is-4" v-if="branch === 'stable'">Apps</h1>

                    <downloads-item
                        v-if="branch === 'stable'"
                        v-bind="plugins.shiru"
                        :branch="branch"
                    />


                    <hr type="is-danger">

                    <h1 class="title is-4">Other</h1>

                    <downloads-item
                        v-bind="plugins.chaoscore"
                        :branch="branch"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DownloadsItem from "./DownloadsItem.vue";

export default {
    data() {
        return {
            branch: this.startBranch
        };
    },
    computed: {
        branchInfo() {
            return this.external.builds[this.branch];
        },
        error() {
            return this.branchInfo.error;
        },
        loading() {
            return this.branchInfo.loading;
        },
        plugins() {
            return this.branchInfo.plugins;
        }
    },
    components: {
        DownloadsItem
    },
    props: {
        startBranch: {
            type: String,
            required: false,
            default: "dev"
        }
    }
}
</script>

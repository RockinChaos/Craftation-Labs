<template>
    <article class="media box has-background-discord has-text-white">
        <div class="media-content">
            <div class="content has-text-centered">
                <p>
                    <strong class="has-text-white">CraftationGaming</strong> on <strong class="has-text-white">Discord</strong>
                </p>
            </div>
            <nav class="level is-mobile">
                <div class="level-item has-text-centered">
                    <div>
                        <p class="title has-text-white">{{ members }}</p>
                        <p class="heading">Online</p>
                    </div>
                </div>
                <div class="level-item has-text-centered">
                    <div>
                        <p class="title has-text-white">1000+</p>
                        <p class="heading">Members</p>
                    </div>
                </div>
            </nav>
            <div class="content">
                <p class="has-text-right is-size-7">
                    <a class="has-text-white" href="https://discord.gg/D5FnJ7C" target="_blank" rel="noopener noreferrer">Join on Discord...</a>
                </p>
            </div>
        </div>
    </article>
</template>

<script>
export default {
    computed: {
        members() {
            return this.external.discord.members || "1000+";
        }
    }
}
</script>

<template>
    <div>
        <Navbar :hero="true" />
        <div class="section content">
            <div class="container">
              <b-notification type="is-primary" :closable="false">
                <p>
                    Welcome to Craftation Labs, a one-stop location for all resources developed by <a class="has-text-white" href="https://github.com/RockinChaos" target="_blank" rel="noopener noreferrer">@RockinChaos</a>.
                    <br/>
                    If you're looking for development builds "snapshots" click the downloads button to be redirected.
                </p>
              </b-notification>
                <div class="tile is-ancestor is-vertical">
                   <div class="tile is-parent row">
                        <div class="tile is-child is-3 has-text-centered icon-container">
                            <fa-icon icon="file-archive" size="8x" fixed-width />
                        </div>
                        <div class="tile is-child">
                            <h2>Repository</h2>
                            <p>Add support for any of our resources using the built-in API.</p>
                            <p>All our resources with API support can be found on our repository. With 99% uptime and offline support you can easily implement our resources as a dependency and compile as needed.</p>
                            <a class="button is-primary is-rounded" href="https://repo.craftationgaming.com" target="_blank" rel="noopener noreferrer">View the Repository</a>
                        </div>
                    </div>
                    <div class="tile is-parent row">
                        <div class="tile is-child is-3 has-text-centered icon-container">
                            <fa-icon icon="file-alt" size="8x" fixed-width />
                        </div>
                        <div class="tile is-child">
                            <h2>Wiki</h2>
                            <p>Many of our resources have a lot of features which may get confusing. We do our best to document everything in an easy to digest manner with easy browsing on our wiki.</p>
                            <p>If you find something is missing, you don't understand, or just need help you can always reach out to us on our <a class="has-text-white" href="https://discord.gg/D5FnJ7C" target="_blank" rel="noopener noreferrer">Discord</a>.</p>
                            <saber-link class="button is-primary is-rounded" to="/wiki">Visit the Wiki</saber-link>
                        </div>
                    </div>
                   <div class="tile is-parent row">
                        <div class="tile is-child is-3 has-text-centered icon-container">
                            <fa-icon icon="clipboard" size="8x" fixed-width />
                        </div>
                        <div class="tile is-child">
                            <h2>Paste</h2>
                            <p>Create a paste that stores plain-text that you can easily share.</p>
                            <a class="button is-primary is-rounded" href="https://paste.craftationgaming.com" target="_blank" rel="noopener noreferrer">Create a Paste</a>
                        </div>
                    </div>
                    <div class="tile is-parent row">
                        <div class="tile is-child is-3 has-text-centered icon-container">
                            <fa-icon :icon="['fab', 'java']" size="8x" fixed-width />
                        </div>
                        <div class="tile is-child">
                            <h2>JavaDocs</h2>
                            <p>Access any of the Minecraft JavaDocs from 1.7 to the latest release.</p>
                            <p>We try to support as many versions of Minecraft as possible, however things change... We host each major Minecraft version's javadocs so you can easily find what you are looking for.</p>
                            <a class="button is-primary is-rounded" href="https://craftationgaming.com/api/javadocs" target="_blank" rel="noopener noreferrer">Browse the JavaDocs</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "../src/components/Navbar.vue";

export default {
    components: {
        Navbar
    }
};

export const attributes = {
    layout: "homepage"
};
</script>

<style>
@keyframes spin {
    from { transform: perspective(10cm) rotateX(0) }
    to   { transform: perspective(10cm) rotateX(360deg) }
}

.konami .spin {
    animation: spin 2.5s linear infinite;
}

div.tile.row {
    padding-bottom: 2rem;
}

div.tile.icon-container {
    padding: 3.5rem 1rem 2rem;
}
</style>

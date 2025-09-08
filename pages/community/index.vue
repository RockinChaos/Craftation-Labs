<template>
    <div>
        <div class="section">
            <div class="container">
                <b-notification type="is-primary" :closable="false">
                    <p>
                        Need support with resources by <a href="https://github.com/RockinChaos" target="_blank" rel="noopener noreferrer">@RockinChaos</a>, or just want to chat about servers and plugins?
                    </p>
                </b-notification>
                <div class="columns">
                    <div class="column is-two-thirds">
                        <div class="content">
                            <h2>Join the CraftationGaming community on Discord</h2>
                            <p>
                                You can get support for any of @RockinChaos resources including ItemJoin,
                                plus chat to fellow server owners and plugin developers. We're always happy to welcome new members and provide support where we can.
                                <br/>
                                We can quickly respond to your requests on our <a href="https://discord.gg/D5FnJ7C" target="_blank" rel="noopener noreferrer">Discord</a>.
                            </p>
                            <h2>Contribute on GitHub</h2>
                            <p>
                                Want to report a bug, request a feature or contribute to any of @RockinChaos resources?
                                <br/>
                                You can join in the discussion on <a href="https://github.com/RockinChaos" target="_blank" rel="noopener noreferrer">GitHub.</a>
                            </p>
                            <h2>Support the Development</h2>
                            <p>
                                Enjoy our resources and are feeling generous?
                                <br/>
                                You can support the development of these Resources by supporting us as a
                                <a href="https://github.com/sponsors/RockinChaos" target="_blank" rel="noopener noreferrer">GitHub Sponsor</a> or on
                                <a href="https://ko-fi.com/RockinChaos" target="_blank" rel="noopener noreferrer">Ko-Fi</a>.
                            </p>
                        </div>
                    </div>
                    <div class="column">
                        <Discord />
                        <Github />
                        <Sponsor />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Discord from "../../components/SocialDiscord";
import Sponsor from "../../components/SocialSponsor";
import Github from "../../components/SocialGithub";

export const attributes = {
    title: "Community"
};

export default {
    components: {
        Discord,
        Github,
        Sponsor,
    }
};
</script>
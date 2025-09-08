import Vue from "vue";
import axios from "axios";

const pluginsDefaults = {
    itemjoin: {
        name: "ItemJoin",
        description: "Get custom items on join",
        downloadUrl: null,
        git: "RockinChaos/ItemJoin",
        commits: null,
        lastCommits: null,
        build: null,
        version: null,
        timestamp: null,
        downloads: ['https://img.shields.io/curseforge/dt/89257.json', 'https://img.shields.io/github/downloads/RockinChaos/ItemJoin/total.json', 'https://img.shields.io/spiget/downloads/12661.json', 'https://img.shields.io/modrinth/dt/8OiYKudu.json'],
        tags: [{ text: 'PLUGIN', color: 'info' }, { text: 'MINECRAFT', color: 'light' }]
    },
    fakecreative: {
        name: "FakeCreative",
        description: "A creative mode emulation",
        downloadUrl: null,
        git: "RockinChaos/FakeCreative",
        premiumUrl: "https://www.spigotmc.org/resources/fakecreative.95959/",
        commits: null,
        lastCommits: null,
        build: null,
        version: null,
        timestamp: null,
        premium: true,
        downloads: ['https://img.shields.io/spiget/downloads/95959.json'],
        tags: [{ text: 'PLUGIN', color: 'info' }, { text: 'PREMIUM', color: 'danger' }, { text: 'MINECRAFT', color: 'light' }]
    },
    cloudsync: {
        name: "CloudSync",
        description: "A spigot-bungee handshake",
        downloadUrl: null,
        git: "RockinChaos/CloudSync",
        premiumUrl: "https://www.spigotmc.org/resources/cloudsync.93382/",
        commits: null,
        lastCommits: null,
        build: null,
        version: null,
        timestamp: null,
        premium: false,
        downloads: ['https://img.shields.io/github/downloads/RockinChaos/CloudSync/total.json', 'https://img.shields.io/spiget/downloads/93382.json'],
        tags: [{ text: 'PLUGIN', color: 'info' }, { text: 'MINECRAFT', color: 'light' }]
    },
    chaoscore: {
        name: "ChaosCore",
        description: "A shaded core utility",
        downloadUrl: null,
        git: "RockinChaos/ChaosCore",
        commits: null,
        lastCommits: null,
        build: null,
        version: null,
        timestamp: null,
        downloads: ['https://img.shields.io/github/downloads/RockinChaos/ChaosCore/total.json'],
        tags: [{ text: 'LIBRARY', color: 'warning' }, { text: 'MINECRAFT', color: 'light' }]
    }
};

const state = Vue.observable({
    github: {
        stars: null,
        forks: null,
    },
    discord: {
        members: null,
    },
    static: {
        year: new Date().getFullYear(),
    },
    builds: {
        dev: {
            plugins: {
                itemjoin: { ...pluginsDefaults.itemjoin },
                fakecreative: { ...pluginsDefaults.fakecreative },
                cloudsync: { ...pluginsDefaults.cloudsync },
                chaoscore: { ...pluginsDefaults.chaoscore }
            },
            loading: true,
            error: null
        },
        stable: {
            plugins: {
                itemjoin: { ...pluginsDefaults.itemjoin },
                fakecreative: { ...pluginsDefaults.fakecreative },
                cloudsync: { ...pluginsDefaults.cloudsync },
                chaoscore: { ...pluginsDefaults.chaoscore }
            },
            loading: true,
            error: null
        }
    },
    downloads: 200000
});

export default {
    data() {
        return {
            external: state
        }
    },
    methods: {
        refreshDownloads() {
            getDescription();
            getJenkins();
            getLatestRelease();
        }
    }
}

function parseDownloads(message) {
    if (!message) return 0;
    message = message.toLowerCase().replace(/,/g, "").trim();
    if (message.endsWith("k")) return Math.round(parseFloat(message) * 1_000);
    if (message.endsWith("m")) return Math.round(parseFloat(message) * 1_000_000);
    if (message.endsWith("b")) return Math.round(parseFloat(message) * 1_000_000_000);
    return parseInt(message, 10) || 0;
}

async function getDownloadValue(url, attempts = 3, delay = 500) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
            return await res.json();
        } catch (err) {
            lastErr = err
            if (i < attempts - 1) await new Promise(r => setTimeout(r, delay));
        }
    }
    throw lastErr;
}

async function getDownloads() {
    let total = 0;
    for (const pluginKey in pluginsDefaults) {
        const plugin = pluginsDefaults[pluginKey];
        if (!plugin.downloads) continue;
        for (const url of plugin.downloads) {
            try {
                const data = await getDownloadValue(url, 3, 500);
                let value = parseDownloads(data.message);
                if (isNaN(value)) value = 0;
                total += value;
            } catch (err) {
                console.warn(`Failed to fetch downloads from ${url}`, err);
            }
        }
    }
    state.downloads = total;
    return total;
}

async function getProjects() {
    let count = 0;
    for (const name in pluginsDefaults) {
        count++;
    }
    state.projects = count;
}

async function getMembers() {
    let members = 0;
    try {
        let response = await axios.get("https://canary.discord.com/api/guilds/291764091239006208/widget.json");
        members = response.data.presence_count;
    } catch (e) { }

    state.discord.members = members;
}

async function getStars() {
    let stars = 0;
    let forks = 0;

    for (const name in pluginsDefaults) {
        try {
            let response = await axios.get('https://api.github.com/repos/' + state.builds.stable.plugins[name].git);
            stars += response.data.stargazers_count;
            forks += response.data.forks_count;
        } catch (e) { }
    }

    state.github.stars = stars;
    state.github.forks = forks;
}

function getVersionFromArtifact(name, fileName) {
    const match = new RegExp(versionRegex.replace("job_id", name)).exec(fileName);
    return match ? 'v' + match[1] : null;
}

function parseCommitMessage(commitId, comment) {
    const lines = comment.split('\u000a');
    const firstLine = lines[0];
    const typeMatch = firstLine.match(/^(fix|feat|chg|rmvd|chore|bump|bmp|ignore|ign):/);
    const commitType = typeMatch ? typeMatch[1].replace("chg", "change").replace("feat", "added").replace("fix", "fixed").replace("rmvd", "removed") + ':' : 'other:';
    const commitName = typeMatch ? firstLine.split(':')[1].trim() : firstLine.trim();
    const commitDescription = lines.slice(1).join(' ').trim();
    return (commitName.match(/-RELEASE|-SNAPSHOT/) || commitType.match(/^(bump|bmp|ignore|ign):/))
        ? null
        : { commitId, commitType: commitType.charAt(0).toUpperCase() + commitType.slice(1), commitName, commitDescription };
}

async function getCommits(currentCI, name, buildNumber, lastResponse) {
    let releaseFound = state.builds.stable.plugins[name].premium
        ? lastResponse.data.changeSet.items.some(item => item.comment.includes('-RELEASE'))
        : lastResponse.data.artifacts.some(artifact => artifact.fileName.includes('RELEASE'));
    lastResponse.data.changeSet.items.forEach(item => {
        if (item.commitId) {
            const commits = parseCommitMessage(item.commitId, item.comment);
            if (commits) {
                state.builds.dev.plugins[name].lastCommits.push(commits);
                const stateCommits = releaseFound
                    ? state.builds.stable.plugins[name].commits
                    : state.builds.dev.plugins[name].commits;
                stateCommits.push(commits);
            }
        }
    });
    let stop = false;
    while (!stop && buildNumber) {
        try {
            let response = await axios.get(`${currentCI}${buildNumber}/api/json`);
            const isReleaseArtifact = state.builds.stable.plugins[name].premium
                ? response.data.changeSet.items.some(item => item.comment.includes('-RELEASE'))
                : response.data.artifacts.some(artifact => artifact.fileName.includes('RELEASE'));
            if (isReleaseArtifact) {
                releaseFound ? stop = true : releaseFound = true;
            }
            if (!stop) {
                const stateCommits = releaseFound ? state.builds.stable.plugins[name].commits : state.builds.dev.plugins[name].commits;
                response.data.changeSet.items.forEach(item => {
                    if (item.commitId) {
                        const commits = parseCommitMessage(item.commitId, item.comment);
                        if (commits) {
                            stateCommits.push(commits);
                        }
                    }
                });
            }
            buildNumber = response.data.id - 1;
        } catch (e) {
            if (e.response && e.response.status === 404) {
                buildNumber -= 1;
            } else {
                break;
            }
        }
    }
}

const mainCI = "https://ci-dev.craftationgaming.com/job/job_id/";
const versionRegex = "job_id[a-zA-Z]*-([0-9.]+?(?:-(?:RELEASE|SNAPSHOT|BETA|ALPHA|EXPERIMENTAL)-[a-zA-Z][0-9]+)?(?:-([0-9a-fA-F]+?))?).jar";

async function getJenkins() {
    try {
        state.builds.dev.loading = true;
        state.builds.stable.loading = true;

        for (const name in pluginsDefaults) {
            let currentCI = mainCI.replace("job_id", name);
            state.builds.dev.plugins[name].commits = [];
            state.builds.dev.plugins[name].lastCommits = [];
            state.builds.stable.plugins[name].commits = [];

            let response = await axios.get(`${currentCI}lastSuccessfulBuild/api/json`);
            state.builds.dev.plugins[name].build = response.data.id;
            state.builds.dev.plugins[name].timestamp = response.data.timestamp;
            state.builds.dev.plugins[name].version = getVersionFromArtifact(state.builds.dev.plugins[name].name, response.data.artifacts[0].displayPath);
            state.builds.dev.plugins[name].downloadUrl = `${currentCI}lastSuccessfulBuild/artifact/${response.data.artifacts[0].relativePath}`;
            getCommits(currentCI, name, (response.data.id - 1), response);
            state.builds.dev.error = null;
            state.builds.stable.error = null;
        }
    } catch (e) {
        state.builds.dev.error = e.response ? e.response.data : e.message;
        state.builds.stable.error = e.response ? e.response.data : e.message;
    } finally {
        state.builds.dev.loading = false;
        state.builds.stable.loading = false;
    }
}

async function getLatestRelease() {
    try {
        state.builds.stable.loading = true;
        for (const name in pluginsDefaults) {
            const { data } = await axios.get('https://api.github.com/repos/' + state.builds.stable.plugins[name].git + '/releases');
            state.builds.stable.plugins[name].version = data[0].tag_name + "-RELEASE";
            state.builds.stable.plugins[name].timestamp = data[0].created_at;
            state.builds.stable.error = null;
            data[0].assets.forEach(asset => {
                state.builds.stable.plugins[name].downloadUrl = asset.browser_download_url;
            });
        }
    } catch (e) {
        state.builds.stable.error = e.response ? e.response.data : e.message;
    }
    state.builds.stable.loading = false;
}

async function getDescription() {
    for (const name in pluginsDefaults) {
        let currentCI = mainCI.replace("job_id", name);

        let response = await axios.get(`${currentCI}api/json`);
        let description = response.data.description.split('ci-import">')[1].split('<div class="ci-no-import"')[0];
        let devParts = description.split('<ul class="release-versions"')
        state.builds.dev.plugins[name].description = devParts[0] + '<ul class="snapshot-versions"' + devParts[1].split('<ul class="legacy-versions"')[1];

        let releaseParts = description.split('<ul class="snapshot-versions"')
        state.builds.stable.plugins[name].description = releaseParts[0] + '<ul class="release-versions"' + releaseParts[1].split('<ul class="release-versions"')[1];
    }
}

getDescription();
getJenkins();
getLatestRelease();
getMembers();
getStars();
getDownloads();
getProjects();
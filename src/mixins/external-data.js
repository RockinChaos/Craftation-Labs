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
        landingUrl: "https://www.spigotmc.org/resources/fakecreative.95959/",
        git: "RockinChaos/FakeCreative",
        commits: null,
        lastCommits: null,
        build: null,
        version: null,
        timestamp: null,
        downloads: ['https://img.shields.io/spiget/downloads/95959.json'],
        tags: [{ text: 'PLUGIN', color: 'info' }, { text: 'PREMIUM', color: 'danger' }, { text: 'MINECRAFT', color: 'light' }]
    },
    cloudsync: {
        name: "CloudSync",
        description: "A spigot-bungee handshake",
        downloadUrl: null,
        git: "RockinChaos/CloudSync",
        commits: null,
        lastCommits: null,
        build: null,
        version: null,
        timestamp: null,
        downloads: ['https://img.shields.io/github/downloads/RockinChaos/CloudSync/total.json', 'https://img.shields.io/spiget/downloads/93382.json'],
        tags: [{ text: 'PLUGIN', color: 'info' }, { text: 'MINECRAFT', color: 'light' }]
    },
    shiru: {
        name: "Shiru",
        description: `🐾 The ultimate torrent-based anime player — lightweight, powerful, and paws-itively fast 🐾<br>
                      BitTorrent streaming software with no paws in the way—watch anime in real-time, no waiting for downloads!<br><br>
                      Shiru enhances the anime streaming experience with a feature-rich environment and full mobile support. It blends the power of BitTorrent streaming with the convenience of traditional streaming platforms. This allows you to stream anime in real-time with no waiting for downloads, combining the advantages of high-speed torrents, great video quality, and fast releases — all without ads or tracking.`,
        downloadUrl: null,
        landingUrl: "https://github.com/RockinChaos/Shiru/releases/latest",
        git: "RockinChaos/Shiru",
        gitOnly: true,
        commits: null,
        lastCommits: null,
        build: null,
        version: null,
        timestamp: null,
        downloads: ['https://img.shields.io/github/downloads/RockinChaos/Shiru/total.json'],
        tags: [{ text: 'APPLICATION', color: 'app' }, { text: 'WINDOWS', color: 'light' }, { text: 'LINUX', color: 'light' }, { text: 'MACOS', color: 'light' }, { text: 'ANDROID', color: 'light' }]
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
        stars: JSON.parse(getLocalStorage('gitStats'))?.stars || 400,
        forks: JSON.parse(getLocalStorage('gitStats'))?.forks || 15,
    },
    discord: {
        members: JSON.parse(getLocalStorage('discordMembers'))?.members || 404,
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
                shiru: { ...pluginsDefaults.shiru },
                chaoscore: { ...pluginsDefaults.chaoscore }
            },
            loading: true,
            error: null
        }
    },
    projects: Object.keys(pluginsDefaults).length,
    downloads: JSON.parse(getLocalStorage('downloads'))?.downloads || 200000
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
    const now = Date.now();
    const cachedDownloads = JSON.parse(getLocalStorage('downloads'));
    if (cachedDownloads?.timestamp && (now - cachedDownloads.timestamp < 60 * 60_000)) return cachedDownloads.downloads;
    let total = 0;
    let cache = true;
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
                cache = false;
                console.warn(`Failed to fetch downloads from ${url}`, err);
            }
        }
    }
    state.downloads = cache ? total : (cachedDownloads?.downloads || total);
    if (cache) setLocalStorage('downloads', JSON.stringify({ downloads: total, timestamp: now }));
    return total;
}

async function getMembers() {
    const now = Date.now();
    const cachedMembers = JSON.parse(getLocalStorage('discordMembers'));
    if (cachedMembers?.timestamp && (now - cachedMembers.timestamp < 5 * 60_000)) return;
    let members = 0;
    let cache = true;
    try {
        let response = await axios.get("https://canary.discord.com/api/guilds/291764091239006208/widget.json");
        members = response.data.presence_count;
    } catch (e) {
        cache = false;
    }

    state.discord.members = members;
    if (cache) setLocalStorage('discordMembers', JSON.stringify({ members, timestamp: now }));
}

async function getStars() {
    const now = Date.now();
    const cachedStats = JSON.parse(getLocalStorage('gitStats'));
    if (cachedStats?.timestamp && (now - cachedStats.timestamp < 360 * 60_000)) return;
    let stars = 0;
    let forks = 0;
    let cache = true;

    for (const name in pluginsDefaults) {
        try {
            let response = await axios.get('https://api.github.com/repos/' + state.builds.stable.plugins[name].git);
            stars += response.data.stargazers_count;
            forks += response.data.forks_count;
        } catch (e) {
            cache = false;
        }
    }

    state.github.stars = cache ? stars : (cachedStats?.stars || stars);
    state.github.forks = cache ? forks : (cachedStats?.forks || forks);
    if (cache) setLocalStorage('gitStats', JSON.stringify({ stars, forks, timestamp: now }));
}

function getVersionFromArtifact(name, fileName) {
    const match = new RegExp(versionRegex.replace("job_id", name)).exec(fileName);
    return match ? 'v' + match[1] : null;
}

function parseCommitMessage(commitId, comment) {
    const lines = comment.trim().split(/\u000a/)
    const firstLine = lines[0];
    const typeMatch = firstLine.match(/^(fix|feat|chg|rmvd|chore|bump|bmp|ignore|ign):/);
    const commitType = typeMatch ? typeMatch[1].replace("chg", "change").replace("feat", "added").replace("fix", "fixed").replace("rmvd", "removed") + ':' : 'other:';
    const commitName = typeMatch ? firstLine.split(':')[1].trim() : firstLine.trim();
    const commitDescription = lines.slice(1).join(' ').trim();
    return (commitName.match(/-RELEASE|-SNAPSHOT/) || commitType.match(/^(bump|bmp|ignore|ign):/)) ? null : { commitId, commitType: commitType.charAt(0).toUpperCase() + commitType.slice(1), commitName, commitDescription };
}

async function getCommits(currentCI, name, buildNumber, lastResponse) {
    const now = Date.now();
    let releaseFound = state.builds.stable.plugins[name].landingUrl
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
    let iterations = 0;
    const MAX_ITERATIONS = 500;
    while (!stop && buildNumber) {
        iterations++;
        if (iterations > MAX_ITERATIONS) {
            console.error("Runaway loop detected, breaking at build:", buildNumber);
            break;
        }
        const currentBuild = buildNumber;
        const cachedCommits = JSON.parse(getLocalStorage(`commits${currentCI}${currentBuild}`));
        try {
            let response;
            let cache = true;
            if (cachedCommits?.timestamp && (now - cachedCommits.timestamp < 60 * 60_000)) {
                response = cachedCommits.response;
                cache = false;
            } else response = await axios.get(`${currentCI}${currentBuild}/api/json`);
            const isReleaseArtifact = state.builds.stable.plugins[name].landingUrl
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
            if (cache) setLocalStorage(`commits${currentCI}${currentBuild}`, JSON.stringify({ response, timestamp: now }));
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
        const now = Date.now();
        state.builds.dev.loading = true;
        state.builds.stable.loading = true;

        for (const name in Object.fromEntries(Object.entries(pluginsDefaults).filter(([_, plugin]) => !plugin.gitOnly))) {
            let currentCI = mainCI.replace("job_id", name);
            state.builds.dev.plugins[name].commits = [];
            state.builds.dev.plugins[name].lastCommits = [];
            state.builds.stable.plugins[name].commits = [];

            const cachedJenkins = JSON.parse(getLocalStorage(`jenkins${pluginsDefaults[name].name}`));
            let response;
            let cache = true;
            if (cachedJenkins?.timestamp && (now - cachedJenkins.timestamp < 60_000)) {
                response = cachedJenkins.response;
                cache = false;
            } else response = await axios.get(`${currentCI}lastSuccessfulBuild/api/json`);
            state.builds.dev.plugins[name].build = response.data.id;
            state.builds.dev.plugins[name].timestamp = String(response.data.timestamp);
            state.builds.dev.plugins[name].version = getVersionFromArtifact(state.builds.dev.plugins[name].name, response.data.artifacts[0].displayPath);
            state.builds.dev.plugins[name].downloadUrl = `${currentCI}lastSuccessfulBuild/artifact/${response.data.artifacts[0].relativePath}`;
            getCommits(currentCI, name, (response.data.id - 1), response);
            state.builds.dev.error = null;
            state.builds.stable.error = null;
            if (cache) setLocalStorage(`jenkins${pluginsDefaults[name].name}`, JSON.stringify({ response, timestamp: now }));
        }
    } catch (e) {
        state.builds.dev.error = e.response ? e.response.data : e.message;
        state.builds.stable.error = e.response ? e.response.data : e.message;
    } finally {
        state.builds.dev.loading = false;
        state.builds.stable.loading = false;
    }
}

function parseBodyCommits(body) {
    const lines = body.split(/\r?\n/);
    const firstCommitIndex = lines.findIndex(line => line.match(/^\s*[\*\-]\s*(fix|feat|chg|rmvd|chore|bump|bmp|ignore|ign):/));
    if (firstCommitIndex === -1) return null;
    const commitLines = lines.slice(firstCommitIndex).join('\n');
    const entries = commitLines.split(/\r?\n[\*\-]\s+/).filter(Boolean);
    return entries.map(entry => parseCommitMessage(null, entry.replace(/^\s*[\*\-]\s*/gm, '\u000a'))).filter(Boolean);
}

async function getLatestRelease() {
    try {
        state.builds.stable.loading = true;
        const now = Date.now();
        for (const name in pluginsDefaults) {
            const cachedReleases = JSON.parse(getLocalStorage(`releases${pluginsDefaults[name].name}`));
            let data;
            let cache = true;
            if (cachedReleases?.timestamp && (now - cachedReleases.timestamp < 5 * 60_000)) {
                data = cachedReleases.data;
                cache = false;
            } else data = (await axios.get('https://api.github.com/repos/' + state.builds.stable.plugins[name].git + '/releases'))?.data;
            if (pluginsDefaults[name].gitOnly) state.builds.stable.plugins[name].commits = parseBodyCommits(data[0].body);
            state.builds.stable.plugins[name].version = data[0].tag_name + "-RELEASE";
            state.builds.stable.plugins[name].timestamp = String(data[0].created_at);
            state.builds.stable.error = null;
            data[0].assets.forEach(asset => state.builds.stable.plugins[name].downloadUrl = asset.browser_download_url);
            if (cache) setLocalStorage(`releases${pluginsDefaults[name].name}`, JSON.stringify({ data, timestamp: now }));
        }
    } catch (e) {
        state.builds.stable.error = e.response ? e.response.data : e.message;
    }
    state.builds.stable.loading = false;
}

async function getDescription() {
    const now = Date.now();
    for (const name in Object.fromEntries(Object.entries(pluginsDefaults).filter(([_, plugin]) => !plugin.gitOnly))) {
        const cachedDescription = JSON.parse(getLocalStorage(`description${pluginsDefaults[name].name}`))
        if (cachedDescription?.timestamp && (now - cachedDescription.timestamp < 5 * 60_000)) {
            state.builds.dev.plugins[name].description = cachedDescription.devDescription;
            state.builds.stable.plugins[name].description = cachedDescription.releaseDescription;
            continue;
        }
        let currentCI = mainCI.replace("job_id", name);

        let response = await axios.get(`${currentCI}api/json`);
        let description = response.data.description.split('ci-import">')[1].split('<div class="ci-no-import"')[0];
        let devParts = description.split('<ul class="release-versions"')
        const devDescription = devParts[0] + '<ul class="snapshot-versions"' + devParts[1].split('<ul class="legacy-versions"')[1];
        state.builds.dev.plugins[name].description = devDescription;

        let releaseParts = description.split('<ul class="snapshot-versions"')
        const releaseDescription = releaseParts[0] + '<ul class="release-versions"' + releaseParts[1].split('<ul class="release-versions"')[1];
        state.builds.stable.plugins[name].description = releaseDescription;
        setLocalStorage(`description${pluginsDefaults[name].name}`, JSON.stringify({ devDescription, releaseDescription, timestamp: now }));
    }
}

function getLocalStorage(key) {
    if (typeof window !== 'undefined' && window.localStorage) return localStorage.getItem(key);
    return null;
}

function setLocalStorage(key, value) {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
    }
}

getDescription();
getJenkins();
getLatestRelease();
getMembers();
getStars();
getDownloads();
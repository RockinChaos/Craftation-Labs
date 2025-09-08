import Vue from "vue";
import Buefy from "buefy";

import "./style/main.scss";

import { library } from "@fortawesome/fontawesome-svg-core"
import { faSync, faExternalLinkSquareAlt, faDownload, faChevronDown, faChevronUp, faUsers, faFileAlt, faFileArchive, faClipboard, faCheckCircle, faTools, faSun, faMoon, faArrowUp, faArrowDown, faAngleRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faDiscord, faJava, faGitSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import KonamiCode from "vue-konami-code";

import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/styles/stackoverflow-dark.css'

hljs.registerLanguage('yaml', yaml);

import ExternalData from "./mixins/external-data";

library.add(faSync, faUsers, faExternalLinkSquareAlt, faChevronDown, faChevronUp, faGithub, faFileAlt, faFileArchive, faClipboard, faDiscord, faJava, faDownload, faGitSquare, faCheckCircle, faTools, faSun, faMoon, faArrowUp, faArrowDown, faAngleRight, faSearch);
Vue.component('fa-icon', FontAwesomeIcon);

Vue.use(Buefy, {
    defaultIconComponent: 'fa-icon',
    defaultIconPack: "fas"
});

Vue.use(hljsVuePlugin);

// build process workaround
if (typeof document !== "undefined") {
    Vue.use(KonamiCode, {
        callback: function () {
            if (document.body.classList.contains("konami")) {
                document.body.classList.remove("konami");
            } else {
                document.body.classList.add("konami");
            }
        }
    });
}

Vue.mixin(ExternalData);

export default ({ setHead }) => {
  setHead({
    meta: [
        {
            name: "description",
            content: "Craftation Labs for development builds and official releases"
        }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:'https://craftationgaming.com/api/images/integration_favicon.ico'
      }
    ],
  });
}

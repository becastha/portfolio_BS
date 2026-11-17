// Profile View: renders the cover page.

import { Attr, LinkRel, LinkTarget, Tag } from '../../../shared/constants/html.js';
import { StringKey } from '../../../shared/localization/string-keys.js';
import { byId, createElement } from '../../../shared/ui/dom.js';
import { createIcon, IconStyle } from '../../../shared/ui/icons.js';
import { bindLoadable } from '../../../shared/ui/loadable-view.js';
import { createBuildStage } from './cover-build-animation.js';
import {
    PROFILE_CONTAINER_ID,
    ProfileCssClass,
    ProfileIcon,
    SocialNetworkIcon,
} from '../profile-constants.js';

export class ProfileView {
    #viewModel;

    /** @param {import('../viewmodel/profile-viewmodel.js').ProfileViewModel} viewModel */
    constructor(viewModel) {
        this.#viewModel = viewModel;
    }

    start() {
        bindLoadable(byId(PROFILE_CONTAINER_ID), this.#viewModel, renderProfile, StringKey.PROFILE_ERROR);
    }
}

function renderProfile(profile) {
    return [
        createBuildStage(profile),
        createElement(Tag.DIV, {
            className: ProfileCssClass.ICON,
            children: [createIcon(IconStyle.SOLID, ProfileIcon.COVER)],
        }),
        createElement(Tag.P, {
            className: ProfileCssClass.LOCATION,
            children: [createIcon(IconStyle.SOLID, ProfileIcon.LOCATION), ` ${profile.location}`],
        }),
        createElement(Tag.DIV, {
            className: ProfileCssClass.SOCIAL_LINKS,
            children: profile.links.filter(link => SocialNetworkIcon[link.network]).map(renderSocialLink),
        }),
    ];
}

function renderSocialLink(link) {
    return createElement(Tag.ANCHOR, {
        attributes: {
            [Attr.HREF]: link.url,
            [Attr.TARGET]: LinkTarget.NEW_TAB,
            [Attr.REL]: LinkRel.EXTERNAL,
        },
        children: [createIcon(IconStyle.BRAND, SocialNetworkIcon[link.network])],
    });
}

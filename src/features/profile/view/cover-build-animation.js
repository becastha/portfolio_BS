// Cover animation: the name appears letter by letter, then each role of the title in turn;
// a role is knocked down to make way for the next, and the last one stays.

import { Tag } from '../../../shared/constants/html.js';
import { createElement, setChildren } from '../../../shared/ui/dom.js';
import {
    BuildCssClass,
    BuildCssVariable,
    BuildTiming,
    deg,
    em,
    LETTER_ATTRIBUTE,
    ProfileCssClass,
    REDUCED_MOTION_QUERY,
    Smash,
    WORD_SEPARATOR,
} from '../profile-constants.js';

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const randomBetween = (min, max) => min + Math.random() * (max - min);

/**
 * Builds the name and title of the cover and starts the animation once they are in the page.
 * @param {import('../model/profile-repository.js').Profile} profile
 */
export function createBuildStage(profile) {
    const nameWords = profile.name.split(WORD_SEPARATOR).map(word => createWord(word, true));
    const prefixWords = profile.titlePrefix.split(WORD_SEPARATOR).filter(Boolean).map(word => createWord(word));
    const roleWord = createWord(profile.roles[0] ?? '');

    const stage = createElement(Tag.DIV, {
        className: BuildCssClass.STAGE,
        children: [
            createElement(Tag.H1, { className: ProfileCssClass.TITLE, children: spaced(nameWords) }),
            createElement(Tag.P, { className: ProfileCssClass.SUBTITLE, children: spaced([...prefixWords, roleWord]) }),
        ],
    });

    const play = async () => {
        if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
            showFinished([...nameWords, ...prefixWords], roleWord, profile.roles);
            return;
        }

        await delay(BuildTiming.START_DELAY_MS);
        for (const word of nameWords) await buildWord(word, 1);
        for (const word of prefixWords) await buildWord(word, BuildTiming.TITLE_SPEED);

        for (const [index, role] of profile.roles.entries()) {
            if (index > 0) {
                await delay(BuildTiming.ROLE_HOLD_MS);
                await smashWord(roleWord);
                setChildren(roleWord, createLetters(role));
            }
            await buildWord(roleWord, BuildTiming.TITLE_SPEED);
        }
    };
    queueMicrotask(play);

    return stage;
}

function createLetters(word, wooden = false) {
    const className = wooden ? `${BuildCssClass.LETTER} ${BuildCssClass.WOOD}` : BuildCssClass.LETTER;
    return [...word].map(letter =>
        createElement(Tag.SPAN, { className, text: letter, attributes: { [LETTER_ATTRIBUTE]: letter } }),
    );
}

function createWord(word, wooden = false) {
    return createElement(Tag.SPAN, { className: BuildCssClass.WORD, children: createLetters(word, wooden) });
}

/** Puts a breakable space between words. */
function spaced(words) {
    return words.flatMap((word, index) => (index === 0 ? [word] : [WORD_SEPARATOR, word]));
}

function showFinished(words, roleWord, roles) {
    if (roles.length > 0) setChildren(roleWord, createLetters(roles.at(-1)));
    [...words, roleWord].forEach(word => {
        [...word.children].forEach(letter => letter.classList.add(BuildCssClass.PLACED));
    });
}

async function buildWord(word, speed) {
    for (const letter of word.children) {
        await delay(BuildTiming.LETTER_MS * speed);
        letter.classList.add(BuildCssClass.PLACED);
    }
    await delay(BuildTiming.WORD_PAUSE_MS * speed);
}

/** The letters of the word fly apart and drop. */
async function smashWord(word) {
    [...word.children].forEach(letter => {
        letter.style.setProperty(BuildCssVariable.SMASH_X, em(randomBetween(-Smash.SPREAD_EM, Smash.SPREAD_EM)));
        letter.style.setProperty(BuildCssVariable.SMASH_TURN, deg(randomBetween(-Smash.TURN_DEG, Smash.TURN_DEG)));
        letter.classList.add(BuildCssClass.SMASHED);
    });
    await delay(BuildTiming.SMASH_MS);
}

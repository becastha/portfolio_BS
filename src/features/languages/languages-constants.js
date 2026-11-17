// Constants of the (spoken) languages feature.

export const LANGUAGES_DATA_URL = new URL('./data/languages.json', import.meta.url);

export const LANGUAGES_CONTAINER_ID = 'languages-container';

export const LanguagesCssClass = Object.freeze({
    ITEM: 'lang-item',
    NAME: 'lang-name',
    PROFICIENCY: 'lang-prof',
});

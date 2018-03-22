export const PATH_BASE = 'https://api.themoviedb.org/3';
export const IMG_PATH_BASE = 'https://image.tmdb.org/t/p';
export const PATH_DISCOVER = '/discover';
export const PATH_MOVIE = '/movie';
export const PARAM_API_KEY = 'api_key';
export const PARAM_LANGUAGE = 'language';
export const PARAM_SORT_BY = 'sort_by';
export const PARAM_WITH_GENRES = 'with_genres';
export const PARAM_PRIMARY_RELEASE_DATE = 'primary_release_date';
export const PARAM_VOTE_AVERAGE = 'vote_average';
export const PARAM_WITH_RUNTIME = 'with_runtime';
export const PARAM_INCLUDE_ADULT = 'include_adult';
export const PARAM_INCLUDE_VIDEO = 'include_video';
export const PARAM_PAGE = 'page';
export const MODIFIER_GREATER_THAN = 'gte';
export const MODIFIER_LESS_THAN = 'lte';
export const MODIFIER_FALSE = 'false';
export const DEFAULT_LANGUAGE = 'en-US';
export const DEFAULT_SORT_BY = 'popularity.desc';
export const DEFAULT_PAGE = '1';
export const DEFAULT_IMG_FILE_SIZE = 'w342';
export const DEFAULT_URL = `${PATH_BASE}${PATH_DISCOVER}${PATH_MOVIE}?${PARAM_API_KEY}=
${process.env.REACT_APP_TMDB_API_KEY}&${PARAM_LANGUAGE}=${DEFAULT_LANGUAGE}&
${PARAM_SORT_BY}=${DEFAULT_SORT_BY}&${PARAM_INCLUDE_ADULT}=${MODIFIER_FALSE}&
${PARAM_INCLUDE_VIDEO}=${MODIFIER_FALSE}&${PARAM_PAGE}=${DEFAULT_PAGE}`;

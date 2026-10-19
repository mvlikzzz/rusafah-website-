/** Keep the visible title and picture together until the requested image loads. */
export type HeroSlideState = {
  active: string | null;
  requested: string | null;
  ready: string[];
  failed: string | null;
};

export const initialHeroSlideState: HeroSlideState = {
  active: null,
  requested: null,
  ready: [],
  failed: null,
};

type Action =
  | { type: "select"; slug: string | null }
  | { type: "ready"; slug: string }
  | { type: "failed"; slug: string };

export function heroSlideReducer(state: HeroSlideState, action: Action): HeroSlideState {
  switch (action.type) {
    case "select":
      return {
        ...state,
        requested: action.slug,
        active: action.slug === null || state.ready.includes(action.slug)
          ? action.slug
          : state.active,
        failed: null,
      };
    case "ready":
      return {
        ...state,
        ready: state.ready.includes(action.slug) ? state.ready : [...state.ready, action.slug],
        active: state.requested === action.slug ? action.slug : state.active,
      };
    case "failed":
      // A late error from a preload must not interrupt the selected slide.
      return state.requested === action.slug
        ? { ...state, requested: state.active, failed: action.slug }
        : state;
  }
}

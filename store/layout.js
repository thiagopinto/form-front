export const state = () => ({
  title: 'CIATEN'
});

export const mutations = {
  CHANGE_NAV_TITLE (state, title) {
    state.title = title;
  }
};

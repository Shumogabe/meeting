import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "badge",
  initialState: {
    badge_all: "",
    badge_tiepnhan: "",
    badge_pheduyet: "",
    badge_bangiao: "",
  },
  reducers: {
    getCountBadge: (state, action) => {
      state.badge_all = action?.payload?.badge_all;
      state.badge_tiepnhan = action?.payload?.badge_tiepnhan;
      state.badge_pheduyet = action?.payload?.badge_pheduyet;
      state.badge_bangiao = action?.payload?.badge_bangiao;
    },
  },
});

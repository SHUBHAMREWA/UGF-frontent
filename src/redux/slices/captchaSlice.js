import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deviceId: null,
  captchaRequired: false,
  captchaToken: null,
  captchaVerified: false,
  blocked: false,
};

const captchaSlice = createSlice({
  name: "security",
  initialState,
  reducers: {
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },

    setCaptchaRequired: (state) => {
      state.captchaRequired = true;
      state.blocked = true;
    },

    setCaptchaToken: (state, action) => {
      state.captchaToken = action.payload;
    },

    captchaSuccess: (state) => {
      state.captchaVerified = true;
      state.captchaRequired = false;
      state.blocked = false;
      state.captchaToken = null;
    },

    captchaFailed: (state) => {
      state.captchaVerified = false;
      state.blocked = true;
       state.captchaRequired = true;
    },

    resetSecurity: () => {
      return initialState;
    },
  },
});

export const {
  setDeviceId,
  setCaptchaRequired,
  setCaptchaToken,
  captchaSuccess,
  captchaFailed,
  resetSecurity,
} = captchaSlice.actions;

export default captchaSlice.reducer;

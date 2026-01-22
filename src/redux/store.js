import { configureStore } from '@reduxjs/toolkit' ;
import captchaReducer from "./slices/captchaSlice.js"


export const Store = configureStore({
    reducer : {
         
          captcha : captchaReducer

    }
})



export default Store ;
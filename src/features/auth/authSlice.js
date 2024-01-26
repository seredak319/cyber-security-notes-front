import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setSuccessfulLogin: (state, action) => {
            let retrievedAccessToken = action.payload.accessToken
            let retrievedRefreshToken = action.payload.refreshToken
            state.isAuthenticated = true
            state.accessToken = retrievedAccessToken
            state.refreshToken = retrievedRefreshToken
            console.log("retrievedAccessToken" + retrievedAccessToken)
        },
        setLogout: (state, action) => {
            state.isAuthenticated = false
            state.accessToken = null
            state.expireDate = null
        }
    }
});

export const {setSuccessfulLogin, setLogout} = authSlice.actions;

export default authSlice.reducer;

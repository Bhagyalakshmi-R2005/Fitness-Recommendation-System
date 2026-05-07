import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: (() => {
            try {
                const user = localStorage.getItem("user");
                return user ? JSON.parse(user) : null;
            } catch {
                return null;
            }
        })(),
        token: localStorage.getItem("token") || null,
        userid: localStorage.getItem("userid") || null
    },
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.userid = action.payload.user.sub;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("userid", action.payload.user.sub);
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.userid = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
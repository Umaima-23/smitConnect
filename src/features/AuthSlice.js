import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../services/supabase';

export const syncAuthState = createAsyncThunk('auth/sync', async (_, { rejectWithValue }) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return { session, role: profile?.role };
    }
    
    return { session: null, role: null };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, role: null, loading: true, error: null },
  reducers: { logout: (state) => { state.user = null; state.role = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(syncAuthState.pending, (state) => { state.loading = true; })
      .addCase(syncAuthState.fulfilled, (state, action) => {
        state.user = action.payload.session?.user ?? null;
        state.role = action.payload.role;
        state.loading = false;
      });
  }
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
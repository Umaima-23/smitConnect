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

export const signupUser = createAsyncThunk('auth/signup', async (formData, { rejectWithValue }) => {
  try {
    const { data: allowed, error: checkError } = await supabase
      .from('students_allowed')
      .select('*')
      .eq('roll_number', formData.rollNumber)
      .eq('cnic', formData.cnic)
      .single();

    if (!allowed || checkError) return rejectWithValue("Not allowed by Admin");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (error) throw error;

    await supabase.from('profiles').insert([
      { id: data.user.id, role: 'student', cnic: formData.cnic, roll_number: formData.rollNumber }
    ]);

    return { user: data.user, role: 'student' };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    return { user: data.user, role: profile?.role };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, role: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      supabase.auth.signOut();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncAuthState.fulfilled, (state, action) => {
        state.user = action.payload.session?.user ?? null;
        state.role = action.payload.role;
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (action.payload.user) {
            state.user = action.payload.user;
            state.role = action.payload.role;
          }
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
// client/src/store/slices/bookmarkSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { BookmarkState, IBookmark } from '@/src/types';
import {
  addBookmark,
  fetchAllBookmarks,
  updateBookmarkNote,
  removeBookmark,
} from '../thunks/bookmark.thunk';

const initialState: BookmarkState = {
  bookmarks: [],
  loading: false,
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // add
      .addCase(addBookmark.pending, (state: any) => { state.loading = true; })
      .addCase(addBookmark.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.bookmarks.unshift(action.payload.data);
      })
      .addCase(addBookmark.rejected, (state: any) => { state.loading = false; })

      // fetchAll
      .addCase(fetchAllBookmarks.pending, (state: any) => { state.loading = true; })
      .addCase(fetchAllBookmarks.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.bookmarks = action.payload.data;
      })
      .addCase(fetchAllBookmarks.rejected, (state: any) => { state.loading = false; })

      // updateNote
      .addCase(updateBookmarkNote.fulfilled, (state: any, action: any) => {
        const idx = state.bookmarks.findIndex(
          (b: IBookmark) => b.bookmarkId === action.payload.data.bookmarkId
        );
        if (idx !== -1) state.bookmarks[idx] = action.payload.data;
      })

      // remove
      .addCase(removeBookmark.fulfilled, (state: any, action: any) => {
        state.bookmarks = state.bookmarks.filter(
          (b: IBookmark) => b.bookmarkId !== action.payload
        );
      });
  },
});

export default bookmarkSlice.reducer;
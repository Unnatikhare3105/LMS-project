// client/src/store/thunks/bookmark.thunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { bookmarkService } from '@/src/services/bookmark.service';

export const addBookmark = createAsyncThunk(
  'bookmark/add',
  async (data: { syllabusId: string; note?: string }, { rejectWithValue }) => {
    try {
      const res = await bookmarkService.add(data.syllabusId, data.note);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add bookmark.');
    }
  }
);

export const fetchAllBookmarks = createAsyncThunk(
  'bookmark/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await bookmarkService.getAll();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookmarks.');
    }
  }
);

export const updateBookmarkNote = createAsyncThunk(
  'bookmark/updateNote',
  async (data: { bookmarkId: string; note: string }, { rejectWithValue }) => {
    try {
      const res = await bookmarkService.updateNote(data.bookmarkId, data.note);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update note.');
    }
  }
);

export const removeBookmark = createAsyncThunk(
  'bookmark/remove',
  async (bookmarkId: string, { rejectWithValue }) => {
    try {
      await bookmarkService.remove(bookmarkId);
      return bookmarkId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove bookmark.');
    }
  }
);
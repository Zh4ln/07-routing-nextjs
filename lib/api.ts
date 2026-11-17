import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const API_URL = "https://notehub-public.goit.study/api";

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

function getHeaders() {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "NoteHub token is missing. Add NEXT_PUBLIC_NOTEHUB_TOKEN to .env.local.",
    );
  }
  return { Authorization: `Bearer ${token}` };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function fetchNotes({
  page,
  perPage,
  search = "",
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await axios.get<unknown>(`${API_URL}/notes`, {
    headers: getHeaders(),
    params: {
      page,
      perPage,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  const record = isRecord(data) ? data : null;
  const wrapped = record && record.data !== undefined ? record.data : data;
  const content = isRecord(wrapped) ? wrapped : null;
  const notes = Array.isArray(wrapped)
    ? wrapped
    : (content?.notes ?? content?.items ?? content?.results);

  if (!Array.isArray(notes)) {
    throw new Error(
      "Unexpected response from NoteHub: notes array was not found.",
    );
  }

  const pagination =
    content && isRecord(content.pagination) ? content.pagination : null;
  const totalPagesValue =
    content?.totalPages ?? record?.totalPages ?? pagination?.totalPages;
  const totalCountValue = content?.total ?? record?.total ?? pagination?.total;
  const totalPages =
    typeof totalPagesValue === "number" && Number.isFinite(totalPagesValue)
      ? totalPagesValue
      : typeof totalCountValue === "number" && Number.isFinite(totalCountValue)
        ? Math.ceil(totalCountValue / perPage)
        : 1;

  return { notes: notes as Note[], totalPages: Math.max(1, totalPages) };
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const { data } = await axios.get<unknown>(
    `${API_URL}/notes/${encodeURIComponent(id)}`,
    {
      headers: getHeaders(),
    },
  );

  const record = isRecord(data) ? data : null;
  const maybeNote = record?.note ?? record?.data ?? data;
  if (!isRecord(maybeNote) || typeof maybeNote.id !== "string") {
    throw new Error("Could not load note details.");
  }
  return maybeNote as unknown as Note;
}

export async function createNote(note: CreateNoteParams): Promise<Note> {
  const { data } = await axios.post<Note>(`${API_URL}/notes`, note, {
    headers: getHeaders(),
  });
  return data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
  const { data } = await axios.delete<Note>(
    `${API_URL}/notes/${encodeURIComponent(id)}`,
    {
      headers: getHeaders(),
    },
  );
  return data;
}

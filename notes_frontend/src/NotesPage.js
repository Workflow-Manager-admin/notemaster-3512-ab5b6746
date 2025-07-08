import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./api";
import NoteModal from "./NoteModal";

function NotesPage() {
  const { token, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [error, setError] = useState("");

  async function loadNotes() {
    setLoading(true);
    try {
      const result = await fetchNotes(token);
      setNotes(result);
      setError("");
    } catch (e) {
      setError("Could not load notes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, [token]);

  const handleCreate = () => {
    setEditNote(null);
    setModalOpen(true);
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setModalOpen(true);
  };

  const handleDelete = async (note) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(token, note.id);
      setNotes((n) => n.filter((x) => x.id !== note.id));
    } catch (e) {
      setError("Could not delete note.");
    }
  };

  const handleSave = async (noteData) => {
    try {
      if (editNote) {
        const updated = await updateNote(token, editNote.id, noteData);
        setNotes((n) =>
          n.map((x) => (x.id === updated.id ? updated : x))
        );
      } else {
        const created = await createNote(token, noteData);
        setNotes((n) => [created, ...n]);
      }
      setModalOpen(false);
    } catch (e) {
      setError("Could not save note.");
    }
  };

  return (
    <div className="notes-page">
      <aside className="sidebar">
        {/* Place for categories/folders if needed */}
        <h3>All Notes</h3>
        <button className="btn btn-accent" onClick={handleCreate} style={{ marginTop: "1em" }}>
          + New Note
        </button>
      </aside>
      <section className="notes-list">
        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="empty">No notes yet.</div>
        ) : (
          notes.map((note) => (
            <article className="note-card" key={note.id}>
              <header className="note-header">
                <h4 className="note-title">{note.title}</h4>
                <span className="note-timestamp">
                  {new Date(note.updated_at).toLocaleString()}
                </span>
              </header>
              <p className="note-content">{note.content}</p>
              <footer>
                <button
                  className="btn btn-sm"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => handleDelete(note)}
                >
                  Delete
                </button>
              </footer>
            </article>
          ))
        )}
        {error && <div className="error">{error}</div>}
      </section>
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        note={editNote}
      />
    </div>
  );
}

export default NotesPage;

import React, { useState, useEffect } from "react";

function NoteModal({ isOpen, onClose, onSave, note }) {
  const [fields, setFields] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (note) setFields({ title: note.title, content: note.content });
    else setFields({ title: "", content: "" });
    setError("");
  }, [note, isOpen]);

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fields.title.trim()) {
      setError("Title required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(fields);
      setFields({ title: "", content: "" });
    } catch (err) {
      setError("Could not save note.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <h3>{note ? "Edit Note" : "New Note"}</h3>
          <label>
            Title
            <input
              name="title"
              value={fields.title}
              onChange={handleChange}
              autoFocus
              required
              maxLength={100}
              disabled={saving}
            />
          </label>
          <label>
            Content
            <textarea
              name="content"
              value={fields.content}
              onChange={handleChange}
              rows={6}
              disabled={saving}
              style={{ resize: "vertical" }}
            />
          </label>
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="btn btn-cancel"
              onClick={onClose}
              type="button"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;

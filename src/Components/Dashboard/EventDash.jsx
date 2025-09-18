import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import './EventDash.css';

const EventDash = () => {
  const [eventDescription, setEventDescription] = useState('');
  const [eventFile, setEventFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setEventDescription('');
    setEventFile(null);
    setSelectedImage(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
      return;
    }

    setEvents(data); // image_url is now already public
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setEventFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSaveEvent = async () => {
    if (!eventFile || !eventDescription) {
      alert('Please select an image and add a description.');
      return;
    }

    setLoading(true);
    try {
      const fileName = `${Date.now()}-${eventFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, eventFile);

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName).publicUrl;

      const { error: insertError } = await supabase
        .from('events')
        .insert([{ image_url: publicUrl, description: eventDescription }]);

      if (insertError) throw insertError;

      alert('✅ Event saved successfully!');
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error('Save error:', err.message);
      alert('❌ Failed to save event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = event => {
    setEditingId(event.id);
    setEventDescription(event.description);
    setSelectedImage(event.image_url);
  };

  const handleUpdateEvent = async () => {
    if (!eventDescription) {
      alert('Description cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({ description: eventDescription })
        .eq('id', editingId);

      if (error) throw error;

      alert('✅ Event updated.');
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error('Update error:', err.message);
      alert('❌ Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async id => {
    if (!window.confirm('Delete this event?')) return;

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error.message);
      alert('❌ Failed to delete event.');
    } else {
      alert('✅ Event deleted.');
      fetchEvents();
    }
  };

  return (
    <div className="dashboard-section">
      <div className="card-event">
        <h2>{editingId ? 'Edit Event' : 'Create Event'}</h2>
        <div className="event-box">
          <img
            src={selectedImage || 'https://placehold.co/120x120?text=+'}
            alt="preview"
            className="event-image"
            onClick={handleImageClick}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <textarea
            placeholder="Event description..."
            value={eventDescription}
            onChange={e => setEventDescription(e.target.value)}
            className="event-textarea"
          />
        </div>
        <button
          className="btn"
          onClick={editingId ? handleUpdateEvent : handleSaveEvent}
          disabled={loading}
        >
          {loading ? 'Processing...' : editingId ? 'Update Event' : 'Save Event'}
        </button>
      </div>

      <div className="event-list">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="event-card">
              <img
                src={event.image_url || 'https://placehold.co/120x120?text=+'}
                alt="event"
                className="event-img"
              />
              <p>{event.description}</p>
              <div className="event-actions">
                <button className="btn small" onClick={() => handleEditEvent(event)}>Edit</button>
                <button className="btn small danger" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No events yet.</p>
        )}
      </div>
    </div>
  );
};

export default EventDash;
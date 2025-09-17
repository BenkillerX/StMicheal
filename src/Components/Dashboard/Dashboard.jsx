// src/Components/Dashboard/Dashboard.jsx
import React, { useRef, useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import './Dashboard.css'

const Dashboard = () => {
  // Events state
  const [selectedImage, setSelectedImage] = useState(null)
  const [eventFile, setEventFile] = useState(null)
  const [eventDescription, setEventDescription] = useState('')
  const [events, setEvents] = useState([])
  const [editingId, setEditingId] = useState(null)

  // Announcements state
  const [announcementText, setAnnouncementText] = useState('')
  const [announcementList, setAnnouncementList] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchEvents()
    fetchAnnouncements()
  }, [])

  // ======== Events functions ========
const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  if (!data) return

  const eventsWithUrls = data.map((event) => ({
    ...event,
    image_url: event.image_path
      ? supabase.storage.from('event-images').getPublicUrl(event.image_path).publicUrl
      : "https://placehold.co/120x120?text=No+Image"
  }))

  setEvents(eventsWithUrls)
}


  const handleImageClick = () => fileInputRef.current.click()
  const resetEventForm = () => {
    setSelectedImage(null)
    setEventFile(null)
    setEventDescription('')
    fileInputRef.current.value = null
  }

 const handleSaveEvent = async () => {
  if (!eventFile || !eventDescription) {
    alert('⚠️ Please select an image and add a description.')
    return
  }

  setLoading(true)
  try {
    // 1. Generate a unique file name
    const fileName = `${Date.now()}-${eventFile.name}`

    // 2. Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(fileName, eventFile)

    if (uploadError) throw uploadError

    // 3. Insert event record in DB (store only file name)
    const { data, error: insertError } = await supabase
      .from('events')
      .insert([{ image_path: fileName, description: eventDescription }])
      .select()

    if (insertError) throw insertError

    // 4. Dynamically generate public URL for immediate display
    const newEvent = {
      ...data[0],
      image_url: supabase.storage.from('event-images').getPublicUrl(fileName).publicUrl
    }

    setEvents([newEvent, ...events])
    resetEventForm()
  } catch (err) {
    console.error(err)
    alert('❌ Failed to save event: ' + err.message)
  } finally {
    setLoading(false)
  }
}


  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return

    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) alert('❌ Delete failed: ' + error.message)
    else {
      alert('✅ Event deleted')
      fetchEvents()
    }
  }

  const handleEditEvent = (event) => {
    setEditingId(event.id)
    setEventDescription(event.description)
    setSelectedImage(event.image_url)
  }

  const handleUpdateEvent = async () => {
    if (!eventDescription) return alert('⚠️ Description cannot be empty.')
    setLoading(true)
    const { error } = await supabase
      .from('events')
      .update({ description: eventDescription })
      .eq('id', editingId)
    if (error) alert('❌ Update failed: ' + error.message)
    else {
      alert('✅ Event updated')
      setEditingId(null)
      resetEventForm()
      fetchEvents()
    }
    setLoading(false)
  }

  // ======== Announcements functions ========
  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setAnnouncements(data)
  }

  const handleAddAnnouncement = () => {
    if (!announcementText.trim()) return
    setAnnouncementList([...announcementList, announcementText.trim()])
    setAnnouncementText('')
  }

  const handleUploadAnnouncements = async () => {
  if (announcementList.length === 0) {
    alert('⚠️ No announcements to upload.');
    return;
  }

  setLoading(true); // show loading

  try {
    // 1. Prepare the data in the format Supabase expects
    const insertData = announcementList.map((text) => ({ text }));

    // 2. Insert all announcements into the 'announcements' table
    const { data, error } = await supabase
      .from('announcements')
      .insert(insertData)  // send the array
      .select();           // return the inserted rows

    if (error) throw error;

    // 3. Update your state: add newly uploaded announcements to dashboard list
    setAnnouncements([...data, ...announcements]);

    // 4. Clear local preview list
    setAnnouncementList([]);

    alert('✅ Announcements uploaded successfully!');
  } catch (err) {
    console.error(err);
    alert('❌ Failed to upload announcements: ' + err.message);
  } finally {
    setLoading(false);
  }
};


  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) alert('❌ Delete failed: ' + error.message)
    else {
      alert('✅ Announcement deleted')
      fetchAnnouncements()
    }
  }

  const handleEditAnnouncement = async (announcement) => {
    const newText = prompt('Edit announcement:', announcement.text)
    if (!newText) return
    const { error } = await supabase
      .from('announcements')
      .update({ text: newText })
      .eq('id', announcement.id)
    if (error) alert('❌ Update failed: ' + error.message)
    else fetchAnnouncements()
  }
const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    setEventFile(file)
    setSelectedImage(URL.createObjectURL(file)) // show preview image immediately
  }
}

  return (
    <div className="dashboard-wrapper">
      {/* Events Section */}
      <section className="dashboard-section">
        <div className="card">
          <h1 className="card-title">{editingId ? 'Edit Event' : 'Upload an Event'}</h1>
          <div className="event-box">
            <img
              src={selectedImage || "https://placehold.co/120x120?text=+"}
              alt="event"
              className="event-image"
              onClick={handleImageClick}
            />
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
            <textarea
              className="event-textarea"
              placeholder="Add event description..."
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>
          {editingId ? (
            <button className="btn" onClick={handleUpdateEvent} disabled={loading}>
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          ) : (
            <button className="btn" onClick={handleSaveEvent} disabled={loading}>
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          )}
        </div>

        <div className="event-list">
          {events.length > 0 ? events.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image_url} alt="event" className="event-img" />
              <p className="event-desc">{event.description}</p>
              <div className="event-actions">
                <button className="btn small" onClick={() => handleEditEvent(event)}>Edit</button>
                <button className="btn small danger" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
              </div>
            </div>
          )) : <p>No events yet.</p>}
        </div>
      </section>

      {/* Announcements Section */}
<section className="dashboard-section">
  <div className="card">
    <h1 className="card-title">Announcements</h1>

    <input
      type="text"
      placeholder="Type announcement..."
      value={announcementText}
      onChange={(e) => setAnnouncementText(e.target.value)}
      className="announcement-input"
    />
    <button className="btn" onClick={handleAddAnnouncement}>Add</button>

    {/* Preview list with buttons */}
    {announcementList.length > 0 && (
      <ul className="announcement-preview">
        {announcementList.map((text, i) => (
          <li key={i}>
            <span className="announcement-text">{text}</span>
            <div className="announcement-actions">
              {/* Edit will allow changing the text in the input */}
              <button
                className="btn-smallS"
                onClick={() => {
                  setAnnouncementText(text)
                  setAnnouncementList(announcementList.filter((_, index) => index !== i))
                }}
              >
                Edit
              </button>
              <button
                className="btn-smallS-danger"
                onClick={() => setAnnouncementList(announcementList.filter((_, index) => index !== i))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}

    <button className="btn upload-btn" onClick={handleUploadAnnouncements} disabled={loading}>
      {loading ? 'Uploading...' : 'Upload All'}
    </button>

    {/* Existing Announcements on Dashboard */}
    <h2>All Announcements</h2>
    <ul className="announcement-list">
      {announcements.map((ann) => (
        <li key={ann.id}>
          <span className="announcement-text">{ann.text}</span>
          <div className="announcement-actions">
            <button className="btn-smallS" onClick={() => handleEditAnnouncement(ann)}>Edit</button>
            <button className="btn-smallS-danger" onClick={() => handleDeleteAnnouncement(ann.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>

    </div>
  )
}

export default Dashboard

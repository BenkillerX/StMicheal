import { supabase } from '../../supabaseClient'
import  { useState, useEffect } from 'react'
import './AnnouncementDash.css'

const AnnouncementDash = () => {
    const [announcementText, setAnnouncementText] = useState('')
  const [announcementList, setAnnouncementList] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const [loading, setLoading] = useState(false)


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

    const { data, error } = await supabase
      .from('announcements')
      .insert(insertData)  // send the array
      .select();           // return the inserted rows

    if (error) throw error;
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

  useEffect(() => {
  fetchAnnouncements();
}, []);

  return (
    <div className='dashboard-section'>
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

export default AnnouncementDash
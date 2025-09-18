import { supabase } from '../../supabaseClient'
import './Dashboard.css'
import EventDash from './EventDash'
import AnnouncementDash from './AnnouncementDash'

const Dashboard = () => {

  return (
    <div className="dashboard-wrapper">
     <EventDash />
     <AnnouncementDash />
    </div>
  )
}

export default Dashboard

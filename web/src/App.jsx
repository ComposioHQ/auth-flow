import { useState, useEffect } from 'react'
import './App.css'
import AppCard from './components/AppCard'
import Nav from './components/Nav'
import appData from './assets/appData.json'

function App() {
  const initialUserId = localStorage.getItem("user_id") || "";
  const [user_id, setUserId] = useState(initialUserId);
  useEffect(() => {
  }, [user_id]);

  return (
    <>
      <Nav user_id={user_id} setUserId={setUserId} />
      <div className="flex flex-row gap-6 mx-auto h-[80vh] justify-center items-center">
        {appData.apps.map((app, index) => (
          <AppCard
            key={index}
            appName={app.appName}
            logo={app.logo}
            auth_type={app.auth_type}
            user_id={user_id}
            integration_id={app.integration_id}
          />
        ))}
      </div>
    </>
  )
}

export default App


import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CreateMeeting from "./CreateMeeting"
import Login from "./Login"
import Signup from "./Signup"
import Showmeetdetail from "./Showmeetdetail"
import Userdashboard from "./Userdashboard"
import ScoketChat from "./ScoketChat"
import Contactsanket from "./Contactsanket"
import NotFound from "./Notfound"

import LandingPage from "./Landingpage";
import AppIntro from "./AppIntro";

function PageWrapper({ children }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  function AnimatedRoutes() {
    const location = useLocation();
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><AppIntro/></PageWrapper>} />
        <Route path="/landingpage" element={<PageWrapper><LandingPage/></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Userdashboard/></PageWrapper>} />
          <Route path="/newmeet" element={<PageWrapper><CreateMeeting/></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/meetdetail" element={<PageWrapper><Showmeetdetail /></PageWrapper>} />
          <Route path="/chatdetail" element={<PageWrapper><Showchatdetail /></PageWrapper>} />
          <Route path="/socketchat" element={<PageWrapper><ScoketChat /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contactsanket /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
  
        </Routes>
      </AnimatePresence>
    );
  }
function Home(){
  return (
  <div>
    <AnimatedRoutes/>
  </div>
  )
}
export default Home;
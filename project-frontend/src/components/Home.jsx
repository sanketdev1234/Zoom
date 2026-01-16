
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CreateMeeting from "./Meet/CreateMeeting"
import Login from "./Auth/Login"
import Signup from "./Auth/Signup"
import Showmeetdetail from "./Meet/Showmeetdetail"
import Userdashboard from "./Userdashboard"
import ScoketChat from "./Chat/ScoketChat"
// import VideoChat from "./VideoChat"
import Contactsanket from "./Contactsanket"
import Joinmeeting from "./Meet/Joinmeet";
import NotFound from "./Notfound"
import ProfileCreation from "./profile/profilecreate";
import DisplayProfile from "./profile/profileview";
import UpdateProfile from "./profile/updateprofile";
import CreatePost from "./post/createpost"
import LandingPage from "./Landingpage";
import SeeAllPosts from "./post/seeallpost";
import EditPost from "./post/editpost"
import SeeAllPostsUser from "./post/seespecificpost";
import ShowmyConnections from "./connections/showmyconnections"
import Showincomingrequest from "./connections/incomingrequests"
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
        <Route path="/" element={<PageWrapper><LandingPage/></PageWrapper>} />
        <Route path="/landingpage" element={<PageWrapper><LandingPage/></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Userdashboard/></PageWrapper>} />
          <Route path="/newmeet" element={<PageWrapper><CreateMeeting/></PageWrapper>} />
          <Route path="/joinmeet" element={<PageWrapper><Joinmeeting/></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/meet/:id/detail" element={<PageWrapper><Showmeetdetail /></PageWrapper>} />
          <Route path="/ongoingmeet/:meetid/:joinid" element={<PageWrapper><ScoketChat /></PageWrapper>} />
          {/* <Route path="/videomeet/:meetid/:joinid" element={<PageWrapper><VideoChat /></PageWrapper>} /> */}
          <Route path="/contact" element={<PageWrapper><Contactsanket /></PageWrapper>} />
          <Route path="/createprofile" element={<PageWrapper><ProfileCreation /></PageWrapper>} />
          <Route path="/getprofile/:wantid" element={<PageWrapper><DisplayProfile /></PageWrapper>} />
          <Route path="/updateprofile/:wantid/:profileId" element={<PageWrapper><UpdateProfile /></PageWrapper>} />
          <Route path="/createpost" element={<PageWrapper><CreatePost /></PageWrapper>} />
          <Route path="/editpost/:postId" element={<PageWrapper><EditPost /></PageWrapper>} />
          <Route path="/feed" element={<PageWrapper><SeeAllPosts /></PageWrapper>} />
          <Route path="/feed/:full_name" element={<PageWrapper><SeeAllPostsUser /></PageWrapper>} />
          <Route path="/myconnections" element={<PageWrapper><ShowmyConnections /></PageWrapper>} />
          <Route path="/incomingrequests" element={<PageWrapper><Showincomingrequest /></PageWrapper>} />
          <Route path="/*" element={<PageWrapper><NotFound /></PageWrapper>} />
  
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
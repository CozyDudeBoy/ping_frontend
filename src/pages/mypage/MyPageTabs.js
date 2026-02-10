import { NavLink } from 'react-router-dom';

const MyPageTabs = () => {
  return (
    <div className="mypage-tabs">
      <NavLink
        to="/mypage"
        end
        className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
      >
        My Designs
      </NavLink>

      <NavLink
        to="/mypage/pins"
        className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
      > 
        My Pins
      </NavLink>

      <NavLink
        to="/mypage/feedback"
        className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
      >
        My Feedback
      </NavLink>

      <NavLink
        to="/mypage/profile"
        className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
      >
        My Profile
      </NavLink>
      <NavLink
        to="/mypage/alarm"
        className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
      >
        Alarm
      </NavLink>
    </div>
  );
};

export default MyPageTabs;


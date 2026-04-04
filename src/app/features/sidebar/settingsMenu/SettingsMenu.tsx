'use client';

import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Switch,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import AnimationIcon from "@mui/icons-material/Animation";
import BugReportIcon from "@mui/icons-material/BugReport";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { useSidebarContext } from "@/app/hooks/useSidebarContext";

import { FriendRequests } from "../friends/FriendRequests";

type SettingItem = {
  label: string;
  icon?: React.ReactNode;
  type?: "switch";
  value?: boolean;
  onClick?: () => void;
};

export default function SettingsMenu() {

  const { activeMenuView, setActiveMenuView, setQuery, handleMenuClose, anchorEl } = useSidebarContext();

  const settings: SettingItem[] = [
    { 
      label: "Friend Requests", 
      icon: false ? <MarkEmailUnreadIcon /> : <EmailIcon />,
      onClick: () => {
        setQuery('')
        // setShowFriendsRequests((prev: boolean) => !prev);
        setActiveMenuView('FriendRequest')
        handleMenuClose();
      }
    },
    { label: "Add Account", icon: <AccountCircleIcon /> },
    { label: "My Profile", icon: <PersonIcon /> },
    { label: "Saved Messages", icon: <BookmarkIcon /> },
    { label: "Contacts", icon: <GroupIcon /> },
    { label: "Settings", icon: <SettingsIcon /> },
    { label: "Night Mode", icon: <Brightness2Icon />, type: "switch", value: true },
    { label: "Animations", icon: <AnimationIcon />, type: "switch", value: false },
    { label: "Telegram Features", icon: <HelpOutlineIcon /> },
    { label: "Report a Bug", icon: <BugReportIcon /> },
    { label: "Install App", icon: <InstallMobileIcon /> },
  ];

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: "rgba(30, 30, 30, 0.5)", 
            backdropFilter: "blur(12px)", 
            WebkitBackdropFilter: "blur(12px)", 
            color: "white",
            borderRadius: 2,
            minWidth: 240,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          },
        }}
      >
        
        {settings.map((setting, idx) => (
          <MenuItem
            key={idx}
            className={'SettingMenu'}
            onClick={setting.type !== "switch" ? setting.onClick : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mx: 1,
              my: 1,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.03)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5}}>
              {setting.icon}
              <Typography variant="body1">{setting.label}</Typography>
            </Box>
            {setting.type === "switch" && (
              <Switch
                size="small"
                checked={setting.value}
                onChange={() => {}}
                color="secondary"
              />
            )}
          </MenuItem>
        ))}
        
      </Menu>

      { activeMenuView === 'FriendRequest' && (
        <FriendRequests />
      )}

    </>
  );
}

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

import { useContext } from "react";

import { SidebarContext } from "@/app/features/sidebar/Sidebar";
import { FriendRequests } from "../friends/FriendRequests";

type SettingItem = {
  label: string;
  icon?: React.ReactNode;
  type?: "switch";
  value?: boolean;
  onClick?: () => void;
};

export default function SettingsMenu({
  anchorEl,
  open,
  onClose,
}: {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}) {

  const context = useContext(SidebarContext);
  if (!context) throw new Error("No MenuContext provided");
  const { showFriendsRequests, setShowFriendsRequests, setQuery } = context;

  const settings: SettingItem[] = [
    { 
      label: "Friend Requests", 
      icon: false ? <MarkEmailUnreadIcon /> : <EmailIcon />,
      onClick: () => {
        setQuery('')
        onClose();
        setShowFriendsRequests((prev: boolean) => !prev);
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
        open={open}
        onClose={onClose}
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

      {showFriendsRequests && (

        <FriendRequests />

      )}
    </>
  );
}

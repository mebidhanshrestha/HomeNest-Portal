import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import { SectionCard } from "../ui/SectionCard";

type PropertyInsightsProps = {
  totalProperties: number;
  favouriteCount: number;
  cityCount: number;
  averagePriceLabel: string;
};

export const PropertyInsights = ({
  totalProperties,
  favouriteCount,
  cityCount,
  averagePriceLabel,
}: PropertyInsightsProps) => (
  <SectionCard
    title="Portfolio snapshot"
    description="A quick summary of the catalogue and your shortlist."
  >
    <List disablePadding sx={{ display: "grid", gap: 1 }}>
      <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <HomeOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={`${totalProperties} total listings`}
          secondary="Everything currently available in the buyer dashboard."
        />
      </ListItem>
      <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <TurnedInNotOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={`${favouriteCount} saved homes`}
          secondary="A focused shortlist helps you compare faster."
        />
      </ListItem>
      <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <LocationCityOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={`${cityCount} active cities`}
          secondary="Use city filters to reduce visual noise while browsing."
        />
      </ListItem>
      <ListItem disableGutters>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <PriceCheckOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={`Average price ${averagePriceLabel}`}
          secondary="Pricing context across the visible catalogue."
        />
      </ListItem>
    </List>
  </SectionCard>
);

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";

function renderRow({ index, style, data }: ListChildComponentProps) {
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        {/* reverse accessing user in list */}
        <ListItemText primary={data[data.length - (index + 1)]} />
      </ListItemButton>
    </ListItem>
  );
}

interface ResultsProps {
  users: Set<string>;
}

export default function VirtualizedList({ users }: ResultsProps) {
  return (
    
    <Box
      sx={{
        width: "100%",
        height: 400,
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={users.size}
        itemData={Array.from(users)}
        overscanCount={5}
      >
        {/* Displays table of users' data */}
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}

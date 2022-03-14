import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

/**
 * Copyright notice at the bottem of the page
 * @returns
 */
export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      {/* Links to our teams' members GitHub pages */}
      <MuiLink color="inherit" href="https://github.com/Huskydog9988">
        Huskydog9988
      </MuiLink>
      {" & "}
      <MuiLink color="inherit" href="https://github.com/SilentS100">
        Lucas Sadoulet
      </MuiLink>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

import Link from "./Link";
import Button from "@mui/material/Button";

interface ButtonLinkProps {
  link: string;
  variant?: "text" | "contained";
  // newTab: boolean;
  children?: React.ReactNode;
}
//Sub Class of button which links to new page
/**
 * A button thats a link
 * @description Uses mui button component with next router to propery link to different pages
 * @param Options
 * @returns
 */
export default function ButtonLink({
  link,
  variant = "text",
  children,
}: ButtonLinkProps) {
  return (
    <Link href={link} underline="none">
      <Button variant={variant}>{children}</Button>
    </Link>
  );
}

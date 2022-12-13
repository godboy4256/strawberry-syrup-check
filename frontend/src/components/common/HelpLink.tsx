import IMGHelpIcon from "../../assets/image/new/help_icon.svg";
import { Link } from "react-router-dom";

const HelpLink = ({
  text,
  link,
  direction,
  className,
}: {
  text: string;
  link: string;
  direction: "l" | "r";
  className?: string;
}) => {
  return (
    <Link
      className={`help_link ${className ? className : ""} ${
        direction === "l" ? "flex_left" : "flex_right"
      }`}
      to={link}
    >
      <img src={IMGHelpIcon} alt="help icon" />
      <span className="fs_12">{text}</span>
    </Link>
  );
};

export default HelpLink;

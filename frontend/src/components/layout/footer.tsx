import "../../styles/footer.css";
import IMGLawyLandLogo from "../../assets/image/lawyland_logo.svg";

const Footer = () => {
  return (
    <footer id="footer_container">
      <img src={IMGLawyLandLogo} alt="LawyLand Logo" />
      <div id="footer_copyright" className="fs_10">
        ⓒ 2022. Byuckchon All right reserved.
      </div>
    </footer>
  );
};

export default Footer;

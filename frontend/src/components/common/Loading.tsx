import IMGLoading01 from "../../assets/image/gif/loading01.gif";
import IMGLoading02 from "../../assets/image/gif/loading02.gif";
import "../../styles/loading.css";

const Loading = () => {
  const loading_random_all_num = 1;
  const loading_random_value_num = Math.round(
    loading_random_all_num * Math.random()
  );
  return (
    <div id="loading_container">
      <img
        src={
          loading_random_value_num === 0
            ? IMGLoading01
            : loading_random_value_num === 1
            ? IMGLoading02
            : ""
        }
        alt="loading img"
      />
    </div>
  );
};

export default Loading;

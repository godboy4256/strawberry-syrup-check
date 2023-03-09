import { ChangeEvent, useState } from "react";
import IMGDown from "../../assets/image/new/select_icon_normal.svg";
import "../../styles/numberupdown.css";
import { CreatePopup } from "../common/popup";

const NumberUpDown = ({
  label,
  params,
  callBack,
  unit,
  label_unit,
  max_num,
  updown_unit,
  typing = true,
}: {
  label?: string;
  params: string;
  callBack: CallableFunction;
  unit?: string;
  label_unit?: string;
  max_num?: number;
  updown_unit?: number;
  typing?: boolean;
}) => {
  const [count, setCount] = useState<number | "">(0);
  const onClickCount = (is_updown: boolean) => {
    if (count === "") {
      setCount(0);
    }
    if (typeof count !== "number") return;
    if (is_updown) {
      if (max_num && max_num - 1 < count) return;
      setCount((prev: number | "") => {
        if (prev === 100) return 100;
        if (updown_unit) {
          return typeof prev === "number" ? prev + updown_unit : "";
        } else {
          return typeof prev === "number" ? prev + 1 : "";
        }
      });
    } else {
      setCount((prev: number | "") => {
        if (prev === 0) return 0;
        if (updown_unit) {
          return typeof prev === "number" ? prev - updown_unit : "";
        } else {
          return typeof prev === "number" ? prev - 1 : "";
        }
      });
    }

    callBack(params, count + 1);
  };
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!typing) return;
    if (isNaN(Number(e.currentTarget.value))) return;
    if (max_num && Number(e.currentTarget.value) > max_num) {
      CreatePopup(
        undefined,
        `${max_num} 이상 입력할 수 없습니다.`,
        "only_check"
      );
      return;
    }
    callBack(params, Number(e.currentTarget.value));
    setCount(Number(e.currentTarget.value));
  };
  return (
    <>
      {label && (
        <label className="write_label fs_16">
          {label}
          <span className="label_unit"> / {label_unit}</span>
        </label>
      )}
      <div className={`num_updowun_container ${count !== 0 ? "active" : ""}`}>
        <button
          onClick={() => onClickCount(false)}
          className={`number_down ${count !== 0 ? "active" : ""}`}
        >
          <img src={IMGDown} alt="number down" />
        </button>
        <div
          className={`num_updown_unitbox fs_14 ${count !== 0 ? "active" : ""}`}
        >
          <input
            type="text"
            onFocus={() => {
              if (!typing) return;
              setCount("");
            }}
            disabled={!typing ? true : false}
            onChange={onChangeInput}
            value={count}
            className={`fs_14 ${count !== 0 ? "active" : ""}`}
          />
          <div className="fs_14">{unit}</div>
        </div>
        <button
          onClick={() => onClickCount(true)}
          className={`number_up ${count !== 0 ? "active" : ""}`}
        >
          <img src={IMGDown} alt="number up" />
        </button>
      </div>
    </>
  );
};

export default NumberUpDown;

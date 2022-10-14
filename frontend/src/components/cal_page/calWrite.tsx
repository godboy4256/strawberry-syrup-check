import React from "react";
import Button from "../inputs/button";

const CalWrite = ({
  write_list,
  start_cal,
}: {
  write_list: string[];
  start_cal: () => void;
}) => {
  return (
    <div>
      <Button text="계산하기" type="bottom" click_func={() => {}} />
    </div>
  );
};

export default CalWrite;

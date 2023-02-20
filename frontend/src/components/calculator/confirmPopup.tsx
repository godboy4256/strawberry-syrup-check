import {
  jobCates,
  retire_reason_standard,
  work_cate2,
} from "../../assets/data/worktype_data";
import { GetDateArr } from "../../utils/date";
import IMGPrev from "../../assets/image/new/i_date_prev.svg";
import IMGNext from "../../assets/image/new/i_date_next.svg";
import { useEffect, useRef, useState } from "react";

export const DetailConfirmPopup = (confirm_data: any) => {
  const years =
    confirm_data?.sumWorkDay && Math.floor(confirm_data?.sumWorkDay / 12);
  const remainingMonths = confirm_data?.sumWorkDay
    ? Math.floor(confirm_data?.sumWorkDay) % 12
    : "";
  const sumWorkDayFormatted = confirm_data?.sumWorkDay
    ? `${years ? years + "년 " : ""}${
        remainingMonths ? `${remainingMonths}개월` : ""
      }`
    : "";
  return (
    <div id="detail_confirm_popup">
      <div className="confirm_title_row_bar fs_14">
        근로형태
        <div className="fs_14">{work_cate2[confirm_data?.workCate]}</div>
      </div>
      {retire_reason_standard[confirm_data?.retireReason] && (
        <div className="confirm_title_row_bar fs_14">
          퇴직사유
          <div className="fs_14">
            {/* {retire_reason_standard[confirm_data?.retireReason]} */}
          </div>
        </div>
      )}
      {(confirm_data?.workCate !== 8 ||
        confirm_data?.cal_state !== "multi") && (
        <>
          <div className="confirm_title_row_bar fs_14">
            연령 : <div className="fs_14">만 {confirm_data?.age}세</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            장애유무 :
            <div className="fs_14">
              {confirm_data?.disabled ? "장애인" : "비장애인"}{" "}
            </div>
          </div>
        </>
      )}

      {(confirm_data?.workCate === 0 || confirm_data?.workCate === 1) && (
        // 정규직 / 기간제
        <>
          <div className="confirm_title_row_bar fs_14">
            입사일<div className="fs_14">{confirm_data?.enterDay}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            퇴사일<div className="fs_14">{confirm_data?.retiredDay}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            근무시간
            <div className="fs_14">{confirm_data?.dayWorkTime}시간</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            월 급여 (세전)
            <div className="fs_14">
              {confirm_data?.salary?.[0]?.toLocaleString()}원
            </div>
          </div>
        </>
      )}
      {(confirm_data?.workCate === 2 || confirm_data?.workCate === 3) && (
        // 예술인 / 특고
        <>
          <div className="confirm_title_row_bar fs_14">
            고용보험 가입일
            <div className="fs_14">{confirm_data?.enterDay}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            고용보험 종료일
            <div className="fs_14">{confirm_data?.retiredDay}</div>
          </div>
          {confirm_data?.workCate === 3 && (
            <div className="confirm_title_row_bar fs_14">
              직종
              <div className="fs_14">{jobCates[confirm_data?.jobCate]}</div>
            </div>
          )}
          <div className="confirm_title_row_bar fs_14">
            퇴직 전 12개월
            <br /> 급여 총액
            <div className="fs_14">
              {confirm_data?.sumTwelveMonthSalary?.toLocaleString()}원
            </div>
          </div>
        </>
      )}
      {(confirm_data?.workCate === 4 || confirm_data?.workCate === 5) && (
        // 단기 예술인 / 단기 특고
        <>
          <>
            <div className="confirm_title_row_bar fs_14">
              마지막 근무일
              <div className="fs_14">{confirm_data?.lastWorkDay}</div>
            </div>
            <div className="confirm_title_row_bar fs_14">
              고용보험 총 기간
              <div className="fs_14">{sumWorkDayFormatted}</div>
            </div>
            <div className="confirm_title_row_bar fs_14">
              퇴직 전 12개월
              <br /> 급여 총액
              <div className="fs_14">
                {confirm_data?.sumOneYearPay?.toLocaleString()} 원
              </div>
            </div>
          </>
        </>
      )}
      {confirm_data?.workCate === 6 && (
        // 일용직
        <>
          <div className="confirm_title_row_bar fs_14">
            특수
            <div className="fs_14">
              {confirm_data?.isSpecial ? "건설일용직" : "해당 없음"}{" "}
            </div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            고용보험 총 기간<div className="fs_14">{sumWorkDayFormatted}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            마지막 근무일
            <div className="fs_14">{confirm_data?.lastWorkDay}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            마지막 근무시간
            <div className="fs_14">주 {confirm_data?.dayWorkTime} 시간</div>
          </div>
          {/* <div>
            1일 평균임금 : <div>{confirm_data?.datAvgPay}</div>
          </div> */}
        </>
      )}
      {confirm_data?.workCate === 7 && (
        // 초단 시간
        <>
          <div className="confirm_title_row_bar fs_14">
            입사일<div className="fs_14">{confirm_data?.enterDay}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            퇴사일<div className="fs_14">{confirm_data?.retiredDay}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            주 근무시간
            <div className="fs_14">주 {confirm_data?.weekWorkTime}시간</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            주 근무일수
            <div className="fs_14">주 {confirm_data?.weekDay?.length}일</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            월 급여 (세전)
            <div className="fs_14">
              {confirm_data?.salary?.[0]?.toLocaleString()}원
            </div>
          </div>
        </>
      )}
      {confirm_data?.workCate === 8 && (
        // 자영업
        <>
          <div className="confirm_title_row_bar fs_14">
            고용보험 가입일
            <div className="fs_14">{confirm_data?.enterDay}</div>
          </div>
          <div className="confirm_title_row_bar fs_14">
            고용보험 종료일
            <div className="fs_14">{confirm_data?.retiredDay}</div>
          </div>
          <div className="confirm_popup_table_container">
            <div className="confirm_title_row_bar fs_14">등급</div>
            <div className="confirm_popup_table">
              {Object.keys(confirm_data?.insuranceGrade).map((el) => {
                return (
                  <div>
                    <div className="fs_14">{el} 년</div>
                    <div className="fs_14">
                      {confirm_data?.insuranceGrade[el]} 등급
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const _SummaryMultiConfirmList = ({
  data,
  mainId,
}: {
  data: any;
  mainId: number;
}) => {
  if (data) {
    return (
      <div
        className="multi_list_container"
        key={JSON.stringify(data.workCate) + Date.now() + String(data.id)}
      >
        <div className="multi_popup_retiredday fs_12">
          {String(GetDateArr(data.retiredDay)[0]).slice(0, 2)}.
          {String(GetDateArr(data.retiredDay)[1]).padStart(2, "0")}.
          {String(GetDateArr(data.retiredDay)[2]).padStart(2, "0")}
          {mainId === data.id && " (실업급여 신청)"}
        </div>
        {DetailConfirmPopup(data)}
      </div>
    );
  } else return <></>;
};

export const MultiConfirmPopup = ({
  confirm_data_arr,
  mainData,
}: {
  confirm_data_arr: any;
  mainData: any;
}) => {
  const addData = confirm_data_arr.filter((el: any) => {
    return mainData.id !== el.id;
  });
  const refPrev: any = useRef<HTMLInputElement>(null);
  const refNext: any = useRef<HTMLInputElement>(null);
  const [confirmState, setState] = useState(1);
  const sortConfirmDataArr = [
    mainData,
    addData[0] ? addData[0] : null,
    addData[1] ? addData[1] : null,
    addData[2] ? addData[2] : null,
    addData[3] ? addData[3] : null,
  ];

  useEffect(() => {
    if (confirm_data_arr.length > 2) refPrev.current.style.display = "none";
  }, []);
  return (
    <div className="multi_container">
      {confirmState === 1 && (
        <>
          <_SummaryMultiConfirmList
            data={sortConfirmDataArr[0]}
            mainId={mainData.id}
          />
          <_SummaryMultiConfirmList
            data={sortConfirmDataArr[1]}
            mainId={mainData.id}
          />
        </>
      )}
      {confirmState === 2 && (
        <>
          <_SummaryMultiConfirmList
            data={sortConfirmDataArr[2]}
            mainId={mainData.id}
          />
          <_SummaryMultiConfirmList
            data={sortConfirmDataArr[3]}
            mainId={mainData.id}
          />
        </>
      )}
      {confirmState === 3 && (
        <_SummaryMultiConfirmList
          data={sortConfirmDataArr[4]}
          mainId={mainData.id}
        />
      )}
      {confirm_data_arr.length > 2 && (
        <>
          <button
            ref={refNext}
            className="multi_confirm date_indiviual_next"
            onClick={() => {
              refPrev.current.style.display = "block";
              if (confirm_data_arr.length === 5) {
                if (confirmState < 3) {
                  setState((prev) => prev + 1);
                }
                if (confirmState >= 2) {
                  refNext.current.style.display = "none";
                }
              } else {
                if (confirmState < 2) {
                  refNext.current.style.display = "none";
                  setState((prev) => prev + 1);
                }
                if (confirmState >= 1) {
                  refNext.current.style.display = "none";
                }
              }
            }}
          >
            <img src={IMGNext} alt="next button" />
          </button>
          <button
            ref={refPrev}
            className="multi_confirm date_indiviual_prev"
            onClick={() => {
              refNext.current.style.display = "block";
              if (confirmState > 1) {
                setState((prev) => prev - 1);
              }
              if (confirmState <= 2) {
                refPrev.current.style.display = "none";
              }
            }}
          >
            <img src={IMGPrev} alt="prev button" />
          </button>
        </>
      )}
    </div>
  );
};

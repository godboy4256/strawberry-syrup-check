import { jobCates, retire_reason, work_cate2 } from "./WorkTypes";

export const DetailConfirmPopup = (confirm_data: any) => {
  return (
    <div id="detail_confirm_popup">
      <div>
        근로형태 : <div>{work_cate2[confirm_data?.workCate]}</div>
      </div>
      {retire_reason[confirm_data?.retireReason] && (
        <div>
          퇴직사유 : <div>{retire_reason[confirm_data?.retireReason]}</div>
        </div>
      )}
      <div>
        연령 : <div>만 {confirm_data?.age}세</div>
      </div>
      <div>
        장애유무 :<div>{confirm_data?.disabled ? "장애인" : "비장애인"} </div>
      </div>
      {(confirm_data?.workCate === 0 || confirm_data?.workCate === 1) && (
        // 정규직 / 기간제
        <>
          <div>
            입사일 : <div>{confirm_data?.enterDay}</div>
          </div>
          <div>
            퇴사일 : <div>{confirm_data?.retiredDay}</div>
          </div>
          <div>
            근무시간 : <div>{confirm_data?.dayWorkTime}시간</div>
          </div>
          <div>
            월 급여(세전) :
            <div>{confirm_data?.salary?.[0]?.toLocaleString()}원</div>
          </div>
        </>
      )}
      {(confirm_data?.workCate === 2 || confirm_data?.workCate === 3) && (
        // 예술인 / 특고
        <>
          <div>
            고용보험 가입일 : <div>{confirm_data?.enterDay}</div>
          </div>
          <div>
            고용보험 종료일 : <div>{confirm_data?.retiredDay}</div>
          </div>
          {confirm_data?.workCate === 3 && (
            <div>
              직종 : <div>{jobCates[confirm_data?.jobCate]}</div>
            </div>
          )}
          <div>
            퇴직 12개월 전 급여 총액 :
            <div>{confirm_data?.sumTwelveMonthSalary?.toLocaleString()}원</div>
          </div>
        </>
      )}
      {(confirm_data?.workCate === 4 || confirm_data?.workCate === 5) && (
        // 단기 예술인 / 단기 특고
        <>
          <>
            <div>
              마지막 근무일 : <div>{confirm_data?.lastWorkDay}</div>
            </div>
            <div>
              고용보험 총 기간 : <div>{confirm_data?.sumWorkDay}</div>
            </div>
            <div>
              퇴직 전 12개월 급여 총액 :
              <div>{confirm_data?.sumOneYearPay?.toLocaleString()} 원</div>
            </div>
          </>
        </>
      )}
      {confirm_data?.workCate === 6 && (
        // 일용직
        <>
          <div>
            특수 :
            <div>{confirm_data?.isSpecial ? "건설일용직" : "해당 없음"} </div>
          </div>
          <div>
            고용보험 총 기간 : <div>{confirm_data?.sumWorkDay}</div>
          </div>
          <div>
            마지막 근무일: <div>{confirm_data?.lastWorkDay}</div>
          </div>
          <div>
            마지막 근무시간 : <div>{confirm_data?.dayWorkTime}</div>
          </div>
          <div>1일 평균임금 : {}</div>
        </>
      )}
      {confirm_data?.workCate === 7 && (
        // 초단 시간
        <>
          <div>
            입사일 : <div>{confirm_data?.enterDay}</div>
          </div>
          <div>
            퇴사일 : <div>{confirm_data?.retiredDay}</div>
          </div>
          <div>
            주 근무시간 : <div>주 {confirm_data?.weekWorkTime}시간</div>
          </div>
          <div>
            주 근무일수 : <div>주 {confirm_data?.weekDay?.length}일</div>
          </div>
          <div>
            월 급여(세전) :{" "}
            <div>{confirm_data?.salary?.[0]?.toLocaleString()}원</div>
          </div>
        </>
      )}
      {confirm_data?.workCate === 8 && (
        // 자영업
        <>
          <div>
            고용보험 가입일 : <div>{confirm_data?.enterDay}</div>
          </div>
          <div>
            고용보험 종료일 : <div>{confirm_data?.retiredDay}</div>
          </div>
          {/* <div>
            등급 :<table>{Object.keys(confirm_to_server?.insuranceGrade)}</table>
            {confirm_to_server?.salary?.[0]}
          </div> */}
        </>
      )}
    </div>
  );
};

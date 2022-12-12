export const money_korean = (targetValue: string) => {
  const arrNumberWord: string[] = new Array(
    "",
    "일",
    "이",
    "삼",
    "사",
    "오",
    "육",
    "칠",
    "팔",
    "구"
  );
  const arrDigitWord: string[] = new Array("", "십", "백", "천");
  const arrManWord: string[] = new Array("", "만", "억", "조");
  let num_length = targetValue.split(",").join("").length;
  let han_value = "";
  let man_count = 0;
  for (let i = 0; i < num_length; i++) {
    let strTextWord =
      arrNumberWord[Number(targetValue.split(",").join("").charAt(i))];
    if (strTextWord != "") {
      man_count++;
      strTextWord += arrDigitWord[(num_length - (i + 1)) % 4];
    }
    if (man_count != 0 && (num_length - (i + 1)) % 4 == 0) {
      man_count = 0;
      strTextWord = strTextWord + arrManWord[(num_length - (i + 1)) / 4];
    }
    han_value += strTextWord;
  }

  return han_value;
};

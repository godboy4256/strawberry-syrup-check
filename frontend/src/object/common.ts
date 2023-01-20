export const DetailPathCal = (workCate: number) => {
  console.log(workCate);
  if (workCate === 0 || workCate === 1) return "/detail/standard";
  else if (workCate === 2 || workCate === 3) return "/detail/art";
  else if (workCate === 4 || workCate === 5) return "/detail/art/short";
  else if (workCate === 6) return "/detail/dayjob";
  else if (workCate === 7) return "/detail/veryShort";
  else if (workCate === 8) return "/detail/employer";
};

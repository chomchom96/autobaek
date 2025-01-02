function getLevelColor(level: number) {
  let levelName: string = "";
  let bgColor: string = "";

  if (level >= 1 && level <= 5) {
    levelName = `Bronze ${6 - level}`;
    bgColor = "bg-bronze"; // 브론즈 색상 클래스
  } else if (level >= 6 && level <= 10) {
    levelName = `Silver ${11 - level}`; // 6 -> 실버 5, 10 -> 실버 1
    bgColor = "bg-silver"; // 실버 색상 클래스
  } else if (level >= 11 && level <= 15) {
    levelName = `Gold ${16 - level}`; // 11 -> 골드 5, 15 -> 골드 1
    bgColor = "bg-gold"; // 골드 색상 클래스
  } else if (level >= 16 && level <= 20) {
    levelName = `Platinum ${21 - level}`; // 16 -> 플래티넘 5, 20 -> 플래티넘 1
    bgColor = "bg-platinum"; // 플래티넘 색상 클래스
  } else if (level >= 21 && level <= 25) {
    levelName = `Diamond ${26 - level}`; // 21 -> 다이아 5, 25 -> 다이아 1
    bgColor = "bg-diamond"; // 다이아 색상 클래스
  } else if (level >= 26 && level <= 30) {
    levelName = `Ruby ${31 - level}`; // 26 -> 루비 5, 30 -> 루비 1
    bgColor = "bg-ruby"; // 루비 색상 클래스
  } else {
    levelName = "Master"; // 잘못된 레벨 입력
    bgColor = "bg-sky-500"; // 기본 색상
  }

  return {
    levelName,
    bgColor,
  };
}

export default getLevelColor;

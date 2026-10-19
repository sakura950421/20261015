
/* =========================================================
   測驗程式 sketch.js
   功能：
   1. 優先讀取 Google 試算表 CSV
   2. 線上讀取失敗時，改讀 questions.csv
   3. 每次隨機抽出五題
   4. 題目太長時自動換行
   5. 保留原本的畫面、答題互動、彩帶、震動與分數
   ========================================================= */

// Google 試算表發布到網路後的 CSV 網址
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSC4bR1OkMW3lTuh-cCk6CWPeoiPKJ20gaCmdlXRh3mpQF4rDKtrAoqvz4MvE4zwWKZReOeOsG2oQlK/pub?output=csv";

// 儲存本次測驗隨機抽出的五題
let questions = [];

// 儲存完整題庫
let questionBank = [];

// 儲存題庫讀取錯誤訊息
let loadError = "";

// 記錄目前作答的題目編號
let currentQuestion = 0;

// 記錄目前分數
let score = 0;

// 記錄目前題目是否已作答
let answered = false;

// 記錄玩家選擇的答案
let selectedAnswer = -1;

// 記錄是否顯示答題結果
let showResult = false;

// 記錄測驗是否全部結束
let gameFinished = false;

// 記錄畫面是否正在震動
let shaking = false;

// 記錄畫面震動開始時間
let shakeStart = 0;

// 儲存彩帶粒子
let confetti = [];

// =========================================================
// 讀取題庫
// =========================================================

// 優先讀取 Google 試算表；失敗時改讀本機 CSV
async function loadQuestionBank() {
  try {
    // 向 Google 試算表發出讀取請求
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: "no-store"
    });

    // 檢查伺服器是否正常回應
    if (!response.ok) {
      throw new Error("Google 試算表回應錯誤：" + response.status);
    }

    // 取得 CSV 文字內容
    const csvText = await response.text();

    // 將 CSV 文字轉換成題目陣列
    const onlineQuestions = parseCSVQuestions(csvText);

    // 線上題庫至少需要五題
    if (onlineQuestions.length < 5) {
      throw new Error("Google 試算表有效題目少於五題");
    }

    // 使用線上題庫
    questionBank = onlineQuestions;

    // 在 Console 顯示成功訊息
    console.log(
      "已使用 Google 試算表題庫，共 " +
      questionBank.length +
      " 題"
    );

  } catch (onlineError) {
    // 線上題庫讀取失敗時顯示警告
    console.warn(
      "Google 試算表讀取失敗，改用 questions.csv：",
      onlineError
    );

    try {
      // 讀取與 sketch.js 位於同一資料夾的 CSV
      const response = await fetch("questions.csv", {
        cache: "no-store"
      });

      // 檢查本機 CSV 是否成功回應
      if (!response.ok) {
        throw new Error("questions.csv 回應錯誤：" + response.status);
      }

      // 取得本機 CSV 文字
      const csvText = await response.text();

      // 解析本機 CSV
      questionBank = parseCSVQuestions(csvText);

      // 檢查備用題庫是否足夠
      if (questionBank.length < 5) {
        throw new Error("備用 CSV 的有效題目少於五題");
      }

      // 顯示目前使用備用題庫
      console.warn(
        "目前使用本機 questions.csv，共 " +
        questionBank.length +
        " 題"
      );

    } catch (csvError) {
      // 兩種來源都失敗時，記錄錯誤
      console.error(
        "Google 試算表與 questions.csv 都無法讀取：",
        csvError
      );

      // 設定畫面顯示的錯誤訊息
      loadError =
        "題庫讀取失敗，請確認 Google 試算表網址及 questions.csv。";

      // 結束讀取流程
      return;
    }
  }

  // 題庫讀取成功後，隨機抽出五題
  drawRandomQuestions();
}

// =========================================================
// 解析 CSV
// =========================================================

// 將 CSV 文字轉換成程式可以使用的題目陣列
function parseCSVQuestions(csvText) {
  // 儲存所有資料列
  let rows = [];

  // 儲存目前正在讀取的資料列
  let row = [];

  // 儲存目前正在讀取的欄位
  let field = "";

  // 記錄目前是否位於雙引號內
  let insideQuotes = false;

  // 移除 CSV 開頭可能存在的 BOM 字元
  const text = csvText.replace(/^\uFEFF/, "");

  // 逐字讀取 CSV
  for (let i = 0; i < text.length; i++) {
    let ch = text[i];

    // 遇到雙引號時進行判斷
    if (ch === '"') {
      // 引號內連續兩個雙引號代表一個雙引號
      if (insideQuotes && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        // 切換是否位於雙引號內的狀態
        insideQuotes = !insideQuotes;
      }

    // 雙引號外的逗號代表欄位結束
    } else if (ch === "," && !insideQuotes) {
      row.push(field.trim());
      field = "";

    // 雙引號外的換行代表資料列結束
    } else if (
      (ch === "\n" || ch === "\r") &&
      !insideQuotes
    ) {
      // 跳過 Windows 換行符號中的第二個字元
      if (ch === "\r" && text[i + 1] === "\n") {
        i++;
      }

      // 加入目前資料列最後一個欄位
      row.push(field.trim());

      // 忽略完全空白的資料列
      if (row.some(value => value !== "")) {
        rows.push(row);
      }

      // 清空資料列與欄位
      row = [];
      field = "";

    } else {
      // 一般字元加入目前欄位
      field += ch;
    }
  }

  // 加入最後一列的最後一個欄位
  row.push(field.trim());

  // 如果最後一列不是空白，就加入資料列
  if (row.some(value => value !== "")) {
    rows.push(row);
  }

  // 至少要有標題列與一筆題目
  if (rows.length < 2) {
    return [];
  }

  // 第一列作為欄位名稱
  const headers = rows[0].map(
    value => value.trim().toLowerCase()
  );

  // 取得指定欄位的位置
  const column = name => headers.indexOf(name);

  // 題庫必須具備的六個欄位
  const required = [
    "question",
    "option1",
    "option2",
    "option3",
    "option4",
    "answer"
  ];

  // 檢查是否缺少必要欄位
  if (required.some(name => column(name) < 0)) {
    throw new Error(
      "CSV 欄位必須是 question, option1, option2, option3, option4, answer"
    );
  }

  // 儲存有效題目
  let result = [];

  // 從第二列開始讀取題目
  for (let i = 1; i < rows.length; i++) {
    let values = rows[i];

    // 讀取題目文字
    let questionText =
      (values[column("question")] || "").trim();

    // 讀取四個選項
    let options = [
      "option1",
      "option2",
      "option3",
      "option4"
    ].map(name => (values[column(name)] || "").trim());

    // 讀取正確答案，格式應為 1 到 4
    let answerNumber = Number(
      (values[column("answer")] || "").trim()
    );

    // 檢查題目、選項與答案格式
    if (
      !questionText ||
      options.some(option => !option) ||
      !Number.isInteger(answerNumber) ||
      answerNumber < 1 ||
      answerNumber > 4
    ) {
      // 格式錯誤的資料列會被略過
      console.warn("忽略格式錯誤的題目：", values);
      continue;
    }

    // 將有效題目加入題庫
    result.push({
      question: questionText,
      options: options,

      // 將答案由 1～4 轉成程式使用的 0～3
      answer: answerNumber - 1
    });
  }

  // 回傳有效題目
  return result;
}

// =========================================================
// 隨機抽題
// =========================================================

// 從完整題庫中隨機抽出五題
function drawRandomQuestions() {
  // 複製題庫並隨機打亂順序
  let shuffledQuestions = shuffle(questionBank, true);

  // 取出前五題
  questions = shuffledQuestions.slice(0, 5);

  // 回到第一題
  currentQuestion = 0;

  // 分數歸零
  score = 0;

  // 重置作答狀態
  answered = false;

  // 清除選擇
  selectedAnswer = -1;

  // 關閉答題結果
  showResult = false;

  // 關閉完成狀態
  gameFinished = false;

  // 關閉震動
  shaking = false;

  // 重置震動時間
  shakeStart = 0;

  // 清除彩帶
  confetti = [];
}

// =========================================================
// 初始化畫面
// =========================================================

// p5.js 初始化函式
function setup() {
  // 建立符合瀏覽器視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定預設中文字型
  textFont("Noto Sans HK");

  // 矩形使用中心點定位
  rectMode(CENTER);

  // 文字預設水平與垂直置中
  textAlign(CENTER, CENTER);

  // 開始讀取題庫
  loadQuestionBank();
}

// =========================================================
// 計算中英文混合文字的寬度
// =========================================================

// 計算文字在目前字型大小下的實際寬度
function getMixedTextWidth(content) {
  // 將文字拆成單一字元
  let characters = Array.from(String(content));

  // 儲存不同字型的文字片段
  let segments = [];

  // 逐字判斷字型
  for (let character of characters) {
    // 英文與 ASCII 字元使用手寫字型
    // 中文及其他字元使用 Noto Sans HK
    let fontName = /^[\x00-\x7F]$/.test(character)
      ? "Dancing Script"
      : "Noto Sans HK";

    // 如果需要建立新的字型片段
    if (
      segments.length === 0 ||
      segments[segments.length - 1].font !== fontName
    ) {
      segments.push({
        text: character,
        font: fontName
      });
    } else {
      // 將字元接到相同字型的片段
      segments[segments.length - 1].text += character;
    }
  }

  // 儲存文字總寬度
  let totalWidth = 0;

  // 計算各文字片段的寬度
  for (let segment of segments) {
    textFont(segment.font);
    totalWidth += textWidth(segment.text);
  }

  // 回傳整段文字的寬度
  return totalWidth;
}

// =========================================================
// 自動換行
// =========================================================

// 將題目依照最大寬度分成多行
function wrapQuestionText(content, maxWidth) {
  // 將題目拆成單一字元
  let characters = Array.from(String(content));

  // 儲存每一行文字
  let lines = [];

  // 儲存目前正在組合的文字
  let currentLine = "";

  // 逐字檢查是否超出寬度
  for (let character of characters) {
    // 測試加入新字元後的文字
    let testLine = currentLine + character;

    // 計算測試文字的寬度
    let testWidth = getMixedTextWidth(testLine);

    // 超出寬度時，將目前文字存成一行
    if (testWidth > maxWidth && currentLine !== "") {
      lines.push(currentLine);

      // 新的一行從目前字元開始
      currentLine = character;
    } else {
      // 尚未超出寬度，繼續加入字元
      currentLine = testLine;
    }
  }

  // 加入最後一行
  if (currentLine !== "") {
    lines.push(currentLine);
  }

  // 回傳分行結果
  return lines;
}

// =========================================================
// 繪製中英文混合文字
// =========================================================

// 依照文字內容分別使用中文與英文數字字型
function drawMixedText(content, x, y) {
  // 將文字拆成單一字元
  let characters = Array.from(String(content));

  // 儲存不同字型的文字片段
  let segments = [];

  // 逐字檢查字型
  for (let character of characters) {
    // 英文與 ASCII 字元使用 Dancing Script
    // 其餘字元使用 Noto Sans HK
    let fontName = /^[\x00-\x7F]$/.test(character)
      ? "Dancing Script"
      : "Noto Sans HK";

    // 建立新的字型片段或接到上一段
    if (
      segments.length === 0 ||
      segments[segments.length - 1].font !== fontName
    ) {
      segments.push({
        text: character,
        font: fontName
      });
    } else {
      segments[segments.length - 1].text += character;
    }
  }

  // 計算整段文字的總寬度
  let totalWidth = 0;

  for (let segment of segments) {
    textFont(segment.font);
    segment.width = textWidth(segment.text);
    totalWidth += segment.width;
  }

  // 儲存目前畫布狀態
  push();

  // 讓各文字片段從左側開始繪製
  textAlign(LEFT, CENTER);

  // 計算置中後的起始位置
  let currentX = x - totalWidth / 2;

  // 逐一繪製文字片段
  for (let segment of segments) {
    textFont(segment.font);
    text(segment.text, currentX, y);
    currentX += segment.width;
  }

  // 恢復原本畫布狀態
  pop();
}

// =========================================================
// 每一幀的畫面更新
// =========================================================

// p5.js 每一幀都會執行
function draw() {
  // 設定原本的藍色背景
  background("#A9DEF9");

  // 題庫讀取失敗時顯示錯誤訊息
  if (loadError !== "") {
    drawLoadError();
    return;
  }

  // 題庫尚未讀取完成時顯示載入畫面
  if (questionBank.length === 0 || questions.length === 0) {
    drawLoading();
    return;
  }

  // 設定畫面震動的水平位移
  let offsetX = 0;

  // 設定畫面震動的垂直位移
  let offsetY = 0;

  // 如果正在震動畫面
  if (shaking) {
    // 計算已經震動的時間
    let elapsed = millis() - shakeStart;

    // 震動持續 350 毫秒
    if (elapsed < 350) {
      offsetX = random(-12, 12);
      offsetY = random(-12, 12);
    } else {
      shaking = false;
    }
  }

  // 儲存畫布狀態
  push();

  // 套用震動位移
  translate(offsetX, offsetY);

  // 顯示目前題目或最後成績
  if (gameFinished) {
    drawFinalScreen();
  } else {
    drawQuestion();
  }

  // 恢復畫布狀態
  pop();

  // 更新並繪製彩帶
  drawConfetti();
}

// =========================================================
// 題庫載入畫面
// =========================================================

// 繪製載入中的畫面
function drawLoading() {
  fill("#333333");
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text("正在讀取題庫...", width / 2, height / 2);
}

// 繪製題庫讀取錯誤畫面
function drawLoadError() {
  fill("#D62828");
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);

  // 讓錯誤訊息在畫面中央顯示
  text(
    loadError,
    width / 2,
    height / 2,
    width * 0.8,
    height * 0.6
  );
}

// =========================================================
// 題目畫面
// =========================================================

// 繪製目前題目、選項與提示
function drawQuestion() {
  // 取得目前題目的資料
  let q = questions[currentQuestion];

  // 顯示題號
  fill("#FFFFFF");
  noStroke();
  textSize(min(width * 0.035, 24));

  drawMixedText(
    "第 " + (currentQuestion + 1) + " 題 / 5",
    width / 2,
    height * 0.12
  );

  // 設定題目文字顏色
  fill("#333333");
  noStroke();

  // 設定題目字體大小
  let questionFontSize = min(width * 0.035, 34);
  textSize(questionFontSize);

  // 設定題目左右兩側的留白
  let questionMaxWidth = width * 0.8;

  // 設定每行題目文字的高度
  let questionLineHeight = questionFontSize * 1.5;

  // 將題目依照畫面寬度自動換行
  let questionLines = wrapQuestionText(
    q.question,
    questionMaxWidth
  );

  // 計算題目整段文字的高度
  let questionTotalHeight =
    questionLines.length * questionLineHeight;

  // 計算第一行的位置，讓整段題目垂直置中於原本題目區域
  let questionStartY =
    height * 0.24 -
    questionTotalHeight / 2 +
    questionLineHeight / 2;

  // 逐行繪製題目
  for (let i = 0; i < questionLines.length; i++) {
    drawMixedText(
      questionLines[i],
      width / 2,
      questionStartY + i * questionLineHeight
    );
  }

  // 設定選項框寬度
  let boxWidth = min(width * 0.65, 600);

  // 設定選項框高度
  let boxHeight = 65;

  // 設定選項之間的垂直距離
  let gap = 85;

  // 設定第一個選項的垂直位置
  let startY = height * 0.38;

  // 依序繪製四個選項
  for (let i = 0; i < 4; i++) {
    // 設定選項的水平位置
    let x = width / 2;

    // 計算選項原始垂直位置
    let baseY = startY + i * gap;

    // 儲存選項目前的垂直位置
    let y = baseY;

    // 答錯時讓正確答案上下晃動
    if (
      answered &&
      i === q.answer &&
      selectedAnswer !== q.answer
    ) {
      y += sin(frameCount * 0.12) * 8;
    }

    // 預設選項為白色
    let optionColor = "#FFFFFF";

    // 玩家選錯的選項顯示粉紅色
    if (
      answered &&
      i === selectedAnswer &&
      selectedAnswer !== q.answer
    ) {
      optionColor = "#FF5D8F";
    }

    // 正確答案顯示綠色
    if (answered && i === q.answer) {
      optionColor = "#AACC00";
    }

    // 設定選項框顏色
    fill(optionColor);

    // 設定白色外框
    stroke("#FFFFFF");

    // 設定外框粗細
    strokeWeight(3);

    // 繪製圓角選項框
    rect(x, y, boxWidth, boxHeight, 18);

    // 設定選項文字顏色
    fill("#333333");
    noStroke();

    // 設定選項字體大小
    textSize(min(width * 0.032, 24));

    // 顯示選項文字
    drawMixedText(q.options[i], x, y);
  }

  // 如果玩家已經作答，就顯示下一步提示
  if (answered) {
    // 最後一題顯示看分數按鈕
    if (currentQuestion === questions.length - 1) {
      fill("#FFFFFF");
      stroke("#FFFFFF");
      strokeWeight(3);

      // 繪製看分數按鈕
      rect(width / 2, height * 0.91, 230, 60, 18);

      fill("#333333");
      noStroke();
      textSize(min(width * 0.03, 22));

      // 顯示按鈕文字
      drawMixedText("看分數", width / 2, height * 0.91);

    } else {
      // 非最後一題顯示下一題提示
      fill("#333333");
      noStroke();
      textSize(min(width * 0.03, 22));

      drawMixedText(
        "點擊空白處進入下一題",
        width / 2,
        height * 0.91
      );
    }
  }
}

// =========================================================
// 最後成績畫面
// =========================================================

// 顯示測驗完成後的總分與重新測驗按鈕
function drawFinalScreen() {
  fill("#333333");
  noStroke();

  // 顯示完成標題
  textSize(min(width * 0.07, 70));
  drawMixedText("測驗完成！", width / 2, height * 0.28);

  // 顯示總分
  textSize(min(width * 0.055, 55));
  drawMixedText(
    "你的總分：" + score + " / 5",
    width / 2,
    height * 0.42
  );

  // 顯示重新測驗提示
  textSize(min(width * 0.035, 26));
  drawMixedText(
    "要再測驗一次嗎？",
    width / 2,
    height * 0.58
  );

  // 繪製重新測驗按鈕
  fill("#FFFFFF");
  stroke("#FFFFFF");
  strokeWeight(3);
  rect(width / 2, height * 0.70, 230, 70, 20);

  // 顯示重新測驗按鈕文字
  fill("#333333");
  noStroke();
  textSize(min(width * 0.034, 25));

  drawMixedText(
    "再測驗一次",
    width / 2,
    height * 0.70
  );
}

// =========================================================
// 滑鼠點擊與答題互動
// =========================================================

// 當滑鼠被按下時執行
function mousePressed() {
  // 題庫未載入或讀取失敗時，不處理點擊
  if (
    loadError !== "" ||
    questionBank.length === 0 ||
    questions.length === 0
  ) {
    return;
  }

  // 如果目前在成績畫面
  if (gameFinished) {
    // 點擊重新測驗按鈕時重新開始
    if (
      dist(
        mouseX,
        mouseY,
        width / 2,
        height * 0.70
      ) < 120
    ) {
      restartGame();
    }

    return;
  }

  // 取得目前題目
  let q = questions[currentQuestion];

  // 設定選項框尺寸
  let boxWidth = min(width * 0.65, 600);
  let boxHeight = 65;
  let gap = 85;
  let startY = height * 0.38;

  // 如果目前尚未作答
  if (!answered) {
    // 檢查玩家點擊了哪一個選項
    for (let i = 0; i < 4; i++) {
      let y = startY + i * gap;

      // 判斷滑鼠是否位於選項框內
      if (
        mouseX > width / 2 - boxWidth / 2 &&
        mouseX < width / 2 + boxWidth / 2 &&
        mouseY > y - boxHeight / 2 &&
        mouseY < y + boxHeight / 2
      ) {
        // 記錄玩家選擇
        selectedAnswer = i;

        // 標記題目已作答
        answered = true;

        // 開啟答題結果
        showResult = true;

        // 判斷答案是否正確
        if (selectedAnswer === q.answer) {
          // 答對加一分
          score++;

          // 產生彩帶
          createConfetti();
        } else {
          // 答錯時開啟畫面震動
          shaking = true;

          // 記錄震動開始時間
          shakeStart = millis();
        }

        // 選擇完成後結束函式
        return;
      }
    }

  } else {
    // 如果已作答且目前是最後一題
    if (currentQuestion === questions.length - 1) {
      // 判斷是否點擊看分數按鈕
      if (
        mouseX > width / 2 - 115 &&
        mouseX < width / 2 + 115 &&
        mouseY > height * 0.91 - 30 &&
        mouseY < height * 0.91 + 30
      ) {
        nextQuestion();
      }

    } else {
      // 設定下一題點擊區域的上界
      let blankAreaTop = height * 0.82;

      // 設定下一題點擊區域的下界
      let blankAreaBottom = height;

      // 點擊下方空白處進入下一題
      if (
        mouseY > blankAreaTop &&
        mouseY < blankAreaBottom
      ) {
        nextQuestion();
      }
    }
  }
}

// =========================================================
// 切換下一題
// =========================================================

// 進入下一題，或在最後一題顯示成績
function nextQuestion() {
  // 如果還有下一題
  if (currentQuestion < questions.length - 1) {
    // 題目編號加一
    currentQuestion++;

    // 重置作答狀態
    answered = false;

    // 清除選擇
    selectedAnswer = -1;

    // 關閉結果顯示
    showResult = false;

  } else {
    // 所有題目完成後顯示成績畫面
    gameFinished = true;
  }
}

// =========================================================
// 彩帶效果
// =========================================================

// 建立彩帶粒子
function createConfetti() {
  // 每次答對產生 70 個彩帶
  for (let i = 0; i < 70; i++) {
    // 建立單個彩帶物件
    let piece = {
      x: random(width * 0.25, width * 0.75),
      y: -random(20, 150),
      size: random(7, 14),
      speedY: random(2, 5),
      speedX: random(-2, 2),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.08, 0.08),

      // 隨機選擇彩帶顏色
      color: random([
        "#FF5D8F",
        "#AACC00",
        "#FFFFFF",
        "#FFCF56",
        "#7B61FF",
        "#FF8C42"
      ])
    };

    // 將彩帶加入陣列
    confetti.push(piece);
  }
}

// 更新並繪製彩帶
function drawConfetti() {
  // 從陣列最後一個彩帶開始處理
  for (let i = confetti.length - 1; i >= 0; i--) {
    // 取得目前彩帶
    let c = confetti[i];

    // 更新水平位置
    c.x += c.speedX;

    // 更新垂直位置
    c.y += c.speedY;

    // 模擬重力
    c.speedY += 0.04;

    // 更新旋轉角度
    c.rotation += c.rotationSpeed;

    // 儲存畫布狀態
    push();

    // 移動到彩帶位置
    translate(c.x, c.y);

    // 旋轉彩帶
    rotate(c.rotation);

    // 設定彩帶顏色
    fill(c.color);

    // 移除外框
    noStroke();

    // 繪製彩帶
    rect(0, 0, c.size, c.size * 1.8);

    // 恢復畫布狀態
    pop();

    // 彩帶離開畫面後刪除
    if (c.y > height + 30) {
      confetti.splice(i, 1);
    }
  }
}

// =========================================================
// 重新測驗
// =========================================================

// 重新開始測驗
function restartGame() {
  // 從完整題庫重新隨機抽出五題
  drawRandomQuestions();

  // 回到第一題
  currentQuestion = 0;

  // 分數歸零
  score = 0;

  // 重置作答狀態
  answered = false;

  // 清除答案選擇
  selectedAnswer = -1;

  // 關閉答題結果
  showResult = false;

  // 關閉測驗完成狀態
  gameFinished = false;

  // 關閉畫面震動
  shaking = false;

  // 重置震動時間
  shakeStart = 0;

  // 清除所有彩帶
  confetti = [];
}

// =========================================================
// 瀏覽器視窗大小改變
// =========================================================

// 當瀏覽器視窗大小改變時執行
function windowResized() {
  // 讓畫布重新符合視窗大小
  resizeCanvas(windowWidth, windowHeight);
}

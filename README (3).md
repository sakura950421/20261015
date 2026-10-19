---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：415730844　姓名：凃喻婕
> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

答對
![動畫](https://hackmd.io/_uploads/rkXDb6VsMx.gif)
答錯
![動畫-2](https://hackmd.io/_uploads/Hkms-6EiMe.gif)

### 第一次問 AI

```tex!
利用p5.js撰寫一個網頁，只要sketch.js，每一行指令都幫我加上中文註解。 做一個網頁，一次出現一個四個選擇一個正確答案的選擇題。題目設定為五題，內容為二元一次測試題。答完會顯示對錯，答錯整個畫面會震動一下，答對會跑出彩帶。答錯時，選擇答案呈現ff5d8f，正確答案呈現aacc00並上下晃動。背景顏色呈現a9def9。最後會出現總分，請採用全螢幕。最後顯示答案時詢問是否要在測驗一次
```

### 第二次問 AI

```tex!
利用p5.js撰寫一個網頁，只要sketch.js，每一行指令都幫我加上中文註解。 做一個網頁，一次出現一個四個選擇一個正確答案的選擇題。題目設定為五題，內容為二元一次測試題。答完會顯示對錯，答錯整個畫面會震動一下，答對會跑出彩帶。答錯時，選擇答案呈現ff5d8f，正確答案呈現aacc00並上下晃動(包含底)。背景顏色呈現a9def9。最後會出現總分，請採用全螢幕。最後顯示答案時詢問是否要在測驗一次?每題答完後顯示一行字典及空白處進入下一題，是按下空白的地方喔。彩帶不用很多，就一批灑完掉到最下面不見就好。一次多一點。選項有白色長方形框，四腳圓弧，其餘的直接上字就好，我不要按空白鍵進入下一題，我要按空白處
```



### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript=
let questions = [ // 建立五題題目的陣列
  { // 第一題資料
    question: "若 2x + y = 11，且 x + y = 7，則 x = ?", // 設定第一題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 2 // 設定正確答案為第三個選項，x = 4
  }, // 第一題結束
  { // 第二題資料
    question: "若 x + y = 10，且 2x - y = 5，則 x = ?", // 設定第二題題目
    options: ["3", "4", "5", "6"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 5
  }, // 第二題結束
  { // 第三題資料
    question: "若 3x + y = 13，且 x + y = 7，則 x = ?", // 設定第三題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 3
  }, // 第三題結束
  { // 第四題資料
    question: "若 2x + 3y = 16，且 x + y = 6，則 y = ?", // 設定第四題題目
    options: ["1", "2", "3", "4"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，y = 2
  }, // 第四題結束
  { // 第五題資料
    question: "若 3x - y = 7，且 x + y = 5，則 x = ?", // 設定第五題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 3
  } // 第五題結束
]; // 結束題目陣列

let currentQuestion = 0; // 記錄目前正在作答的題目編號
let score = 0; // 記錄目前得到的分數
let answered = false; // 記錄目前題目是否已經作答
let selectedAnswer = -1; // 記錄玩家選擇的答案
let showResult = false; // 記錄是否顯示答題結果
let gameFinished = false; // 記錄測驗是否全部結束
let shaking = false; // 記錄畫面是否正在震動
let shakeStart = 0; // 記錄畫面震動開始的時間
let confetti = []; // 建立彩帶粒子的陣列

function setup() { // p5.js 初始化函式
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布
  textFont("Arial"); // 設定文字使用 Arial 字型
  rectMode(CENTER); // 設定矩形以中心點作為定位
  textAlign(CENTER, CENTER); // 設定文字水平與垂直置中
} // setup 函式結束

function draw() { // p5.js 每一幀都會執行的函式
  background("#A9DEF9"); // 設定整個畫面的背景顏色

  let offsetX = 0; // 設定畫面水平震動位移
  let offsetY = 0; // 設定畫面垂直震動位移

  if (shaking) { // 如果目前正在震動畫面
    let elapsed = millis() - shakeStart; // 計算震動已經持續多久
    if (elapsed < 350) { // 如果震動時間還不到 350 毫秒
      offsetX = random(-12, 12); // 隨機產生水平震動
      offsetY = random(-12, 12); // 隨機產生垂直震動
    } else { // 如果震動已經結束
      shaking = false; // 關閉震動狀態
    } // 結束震動時間判斷
  } // 結束震動判斷

  push(); // 儲存目前畫布狀態
  translate(offsetX, offsetY); // 將整個內容套用震動位移

  if (gameFinished) { // 如果五題都已經完成
    drawFinalScreen(); // 顯示最後的成績畫面
  } else { // 如果測驗還沒有結束
    drawQuestion(); // 顯示目前的題目
  } // 結束畫面判斷

  pop(); // 恢復畫布狀態

  drawConfetti(); // 更新並繪製彩帶
} // draw 函式結束

function drawQuestion() { // 繪製題目畫面
  let q = questions[currentQuestion]; // 取得目前題目的資料

  fill("#FFFFFF"); // 設定題號文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.035, 24)); // 根據螢幕寬度適度縮小題號文字
  text("第 " + (currentQuestion + 1) + " 題 / 5", width / 2, height * 0.12); // 顯示目前題號

  fill("#333333"); // 設定題目文字顏色
  textSize(min(width * 0.035, 34)); // 根據螢幕寬度適度縮小題目文字
  text(q.question, width / 2, height * 0.24); // 顯示題目內容

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的垂直距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  for (let i = 0; i < 4; i++) { // 依序繪製四個選項
    let x = width / 2; // 設定選項水平位置
    let baseY = startY + i * gap; // 計算選項的原始垂直位置
    let y = baseY; // 儲存目前選項的垂直位置

    if (answered && i === q.answer && selectedAnswer !== q.answer) { // 如果答錯且目前是正確答案
      y += sin(frameCount * 0.12) * 8; // 讓正確答案上下晃動
    } // 結束正確答案晃動判斷

    let optionColor = "#FFFFFF"; // 預設選項為白色

    if (answered && i === selectedAnswer && selectedAnswer !== q.answer) { // 如果這是玩家選錯的答案
      optionColor = "#FF5D8F"; // 將錯誤答案設定成粉紅色
    } // 結束錯誤答案顏色判斷

    if (answered && i === q.answer) { // 如果這是正確答案
      optionColor = "#AACC00"; // 將正確答案設定成綠色
    } // 結束正確答案顏色判斷

    fill(optionColor); // 設定選項框顏色
    stroke("#FFFFFF"); // 設定選項框白色外框
    strokeWeight(3); // 設定選項框外框粗細
    rect(x, y, boxWidth, boxHeight, 18); // 繪製四角圓弧的選項框

    fill("#333333"); // 設定選項文字顏色
    noStroke(); // 移除文字外框
    textSize(min(width * 0.032, 24)); // 根據螢幕寬度適度縮小選項文字
    text(q.options[i], x, y); // 顯示選項內容
  } // 結束四個選項的迴圈

  if (answered) { // 如果玩家已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      fill("#FFFFFF"); // 設定看分數按鈕顏色
      stroke("#FFFFFF"); // 設定按鈕外框顏色
      strokeWeight(3); // 設定按鈕外框粗細
      rect(width / 2, height * 0.91, 230, 60, 18); // 繪製看分數按鈕

      fill("#333333"); // 設定按鈕文字顏色
      noStroke(); // 移除文字外框
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小按鈕文字
      text("看分數", width / 2, height * 0.91); // 顯示看分數文字
    } else { // 如果不是最後一題
      fill("#333333"); // 設定提示文字顏色
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小提示文字
      text("點擊空白處進入下一題", width / 2, height * 0.91); // 顯示點擊空白處的提示
    } // 結束最後一題判斷
  } // 結束作答後提示判斷
} // drawQuestion 函式結束

function drawFinalScreen() { // 繪製最後成績畫面
  fill("#333333"); // 設定標題文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.07, 70)); // 根據螢幕寬度適度縮小標題文字
  text("測驗完成！", width / 2, height * 0.28); // 顯示測驗完成文字

  textSize(min(width * 0.055, 55)); // 根據螢幕寬度適度縮小分數文字
  text("你的總分：" + score + " / 5", width / 2, height * 0.42); // 顯示玩家總分

  textSize(min(width * 0.035, 26)); // 根據螢幕寬度適度縮小重新測驗提示
  text("要再測驗一次嗎？", width / 2, height * 0.58); // 顯示重新測驗詢問

  fill("#FFFFFF"); // 設定重新測驗按鈕顏色
  stroke("#FFFFFF"); // 設定按鈕外框顏色
  strokeWeight(3); // 設定按鈕外框粗細
  rect(width / 2, height * 0.70, 230, 70, 20); // 繪製重新測驗按鈕

  fill("#333333"); // 設定按鈕文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.034, 25)); // 根據螢幕寬度適度縮小按鈕文字
  text("再測驗一次", width / 2, height * 0.70); // 顯示重新測驗文字
} // drawFinalScreen 函式結束

function mousePressed() { // 當滑鼠被按下時執行
  if (gameFinished) { // 如果目前位於最後成績畫面
    if (dist(mouseX, mouseY, width / 2, height * 0.70) < 120) { // 判斷是否點擊重新測驗按鈕
      restartGame(); // 重新開始測驗
    } // 結束重新測驗按鈕判斷
    return; // 結束這次滑鼠事件
  } // 結束測驗完成判斷

  let q = questions[currentQuestion]; // 取得目前題目的資料

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  if (!answered) { // 如果目前還沒有作答
    for (let i = 0; i < 4; i++) { // 檢查四個選項
      let y = startY + i * gap; // 計算目前選項的垂直位置

      if (mouseX > width / 2 - boxWidth / 2 && mouseX < width / 2 + boxWidth / 2 && mouseY > y - boxHeight / 2 && mouseY < y + boxHeight / 2) { // 判斷是否點擊選項
        selectedAnswer = i; // 記錄玩家選擇的答案
        answered = true; // 將題目設定成已作答
        showResult = true; // 開啟答題結果顯示

        if (selectedAnswer === q.answer) { // 如果玩家答對
          score++; // 分數增加一分
          createConfetti(); // 產生一批彩帶
        } else { // 如果玩家答錯
          shaking = true; // 開啟畫面震動
          shakeStart = millis(); // 記錄震動開始時間
        } // 結束答案判斷

        return; // 完成點擊選項後結束函式
      } // 結束選項碰撞判斷
    } // 結束四個選項的迴圈
  } else { // 如果目前已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      if (mouseX > width / 2 - 115 && mouseX < width / 2 + 115 && mouseY > height * 0.91 - 30 && mouseY < height * 0.91 + 30) { // 判斷是否點擊看分數按鈕
        nextQuestion(); // 顯示最後分數
      } // 結束看分數按鈕判斷
    } else { // 如果不是最後一題
      let blankAreaTop = height * 0.82; // 設定空白區域的上界
      let blankAreaBottom = height; // 設定空白區域的下界

      if (mouseY > blankAreaTop && mouseY < blankAreaBottom) { // 判斷是否點擊下方空白區域
        nextQuestion(); // 進入下一題
      } // 結束空白區域判斷
    } // 結束最後一題判斷
  } // 結束是否已作答判斷
} // mousePressed 函式結束

function nextQuestion() { // 進入下一題或顯示分數的函式
  if (currentQuestion < questions.length - 1) { // 如果還有下一題
    currentQuestion++; // 題目編號增加一
    answered = false; // 重置作答狀態
    selectedAnswer = -1; // 清除上一題選擇
    showResult = false; // 關閉答題結果
  } else { // 如果已經完成最後一題
    gameFinished = true; // 開啟測驗完成狀態
  } // 結束題目判斷
} // nextQuestion 函式結束

function createConfetti() { // 建立彩帶的函式
  for (let i = 0; i < 70; i++) { // 一次產生 70 個彩帶
    let piece = { // 建立單個彩帶物件
      x: random(width * 0.25, width * 0.75), // 設定彩帶隨機水平位置
      y: -random(20, 150), // 設定彩帶從畫面上方開始
      size: random(7, 14), // 設定彩帶大小
      speedY: random(2, 5), // 設定彩帶下落速度
      speedX: random(-2, 2), // 設定彩帶水平速度
      rotation: random(TWO_PI), // 設定彩帶初始旋轉角度
      rotationSpeed: random(-0.08, 0.08), // 設定彩帶旋轉速度
      color: random(["#FF5D8F", "#AACC00", "#FFFFFF", "#FFCF56", "#7B61FF", "#FF8C42"]) // 隨機設定彩帶顏色
    }; // 結束彩帶物件
    confetti.push(piece); // 將彩帶加入彩帶陣列
  } // 結束彩帶產生迴圈
} // createConfetti 函式結束

function drawConfetti() { // 更新並繪製彩帶
  for (let i = confetti.length - 1; i >= 0; i--) { // 從最後一個彩帶開始處理
    let c = confetti[i]; // 取得目前彩帶

    c.x += c.speedX; // 更新彩帶水平位置
    c.y += c.speedY; // 更新彩帶垂直位置
    c.speedY += 0.04; // 模擬重力讓彩帶越掉越快
    c.rotation += c.rotationSpeed; // 更新彩帶旋轉角度

    push(); // 儲存目前畫布狀態
    translate(c.x, c.y); // 移動到彩帶位置
    rotate(c.rotation); // 旋轉彩帶
    fill(c.color); // 設定彩帶顏色
    noStroke(); // 移除彩帶外框
    rect(0, 0, c.size, c.size * 1.8); // 繪製彩帶
    pop(); // 恢復畫布狀態

    if (c.y > height + 30) { // 如果彩帶已經掉到畫面最下面
      confetti.splice(i, 1); // 將彩帶從陣列中刪除
    } // 結束彩帶刪除判斷
  } // 結束彩帶迴圈
} // drawConfetti 函式結束

function restartGame() { // 重新開始遊戲的函式
  currentQuestion = 0; // 將題目回到第一題
  score = 0; // 將分數歸零
  answered = false; // 重置作答狀態
  selectedAnswer = -1; // 清除答案選擇
  showResult = false; // 關閉結果顯示
  gameFinished = false; // 關閉測驗完成狀態
  shaking = false; // 關閉畫面震動
  confetti = []; // 清除畫面上剩餘的彩帶
} // restartGame 函式結束

function windowResized() { // 當瀏覽器視窗大小改變時執行
  resizeCanvas(windowWidth, windowHeight); // 讓畫布跟著視窗大小重新調整
} // windowResized 函式結束

```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

![動畫-3](https://hackmd.io/_uploads/rkoIzaVofx.gif)


### 第一次問 AI

```tex!
第一題的程式碼已經可以達成這個效果，故沒有詢問，僅貼上能夠執行這項要求的那部分程式碼
```



### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
//let questions = [ // 建立五題題目的陣列
  { // 第一題資料
    question: "若 2x + y = 11，且 x + y = 7，則 x = ?", // 設定第一題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 2 // 設定正確答案為第三個選項，x = 4
  }, // 第一題結束
  { // 第二題資料
    question: "若 x + y = 10，且 2x - y = 5，則 x = ?", // 設定第二題題目
    options: ["3", "4", "5", "6"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 5
  }, // 第二題結束
  { // 第三題資料
    question: "若 3x + y = 13，且 x + y = 7，則 x = ?", // 設定第三題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 3
  }, // 第三題結束
  { // 第四題資料
    question: "若 2x + 3y = 16，且 x + y = 6，則 y = ?", // 設定第四題題目
    options: ["1", "2", "3", "4"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，y = 2
  }, // 第四題結束
  { // 第五題資料
    question: "若 3x - y = 7，且 x + y = 5，則 x = ?", // 設定第五題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 3
  } // 第五題結束
]; // 結束題目陣列

let currentQuestion = 0; // 記錄目前正在作答的題目編號
let score = 0; // 記錄目前得到的分數
let answered = false; // 記錄目前題目是否已經作答
let selectedAnswer = -1; // 記錄玩家選擇的答案
let showResult = false; // 記錄是否顯示答題結果
let gameFinished = false; // 記錄測驗是否全部結束
let shaking = false; // 記錄畫面是否正在震動
let shakeStart = 0; // 記錄畫面震動開始的時間
let confetti = []; // 建立彩帶粒子的陣列

function setup() { // p5.js 初始化函式
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布
  textFont("Arial"); // 設定文字使用 Arial 字型
  rectMode(CENTER); // 設定矩形以中心點作為定位
  textAlign(CENTER, CENTER); // 設定文字水平與垂直置中
} // setup 函式結束

function draw() { // p5.js 每一幀都會執行的函式
  background("#A9DEF9"); // 設定整個畫面的背景顏色

  let offsetX = 0; // 設定畫面水平震動位移
  let offsetY = 0; // 設定畫面垂直震動位移

  if (shaking) { // 如果目前正在震動畫面
    let elapsed = millis() - shakeStart; // 計算震動已經持續多久
    if (elapsed < 350) { // 如果震動時間還不到 350 毫秒
      offsetX = random(-12, 12); // 隨機產生水平震動
      offsetY = random(-12, 12); // 隨機產生垂直震動
    } else { // 如果震動已經結束
      shaking = false; // 關閉震動狀態
    } // 結束震動時間判斷
  } // 結束震動判斷

  push(); // 儲存目前畫布狀態
  translate(offsetX, offsetY); // 將整個內容套用震動位移

  if (gameFinished) { // 如果五題都已經完成
    drawFinalScreen(); // 顯示最後的成績畫面
  } else { // 如果測驗還沒有結束
    drawQuestion(); // 顯示目前的題目
  } // 結束畫面判斷

  pop(); // 恢復畫布狀態

  drawConfetti(); // 更新並繪製彩帶
} // draw 函式結束

function drawQuestion() { // 繪製題目畫面
  let q = questions[currentQuestion]; // 取得目前題目的資料

  fill("#FFFFFF"); // 設定題號文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.035, 24)); // 根據螢幕寬度適度縮小題號文字
  text("第 " + (currentQuestion + 1) + " 題 / 5", width / 2, height * 0.12); // 顯示目前題號

  fill("#333333"); // 設定題目文字顏色
  textSize(min(width * 0.035, 34)); // 根據螢幕寬度適度縮小題目文字
  text(q.question, width / 2, height * 0.24); // 顯示題目內容

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的垂直距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  for (let i = 0; i < 4; i++) { // 依序繪製四個選項
    let x = width / 2; // 設定選項水平位置
    let baseY = startY + i * gap; // 計算選項的原始垂直位置
    let y = baseY; // 儲存目前選項的垂直位置

    if (answered && i === q.answer && selectedAnswer !== q.answer) { // 如果答錯且目前是正確答案
      y += sin(frameCount * 0.12) * 8; // 讓正確答案上下晃動
    } // 結束正確答案晃動判斷

    let optionColor = "#FFFFFF"; // 預設選項為白色

    if (answered && i === selectedAnswer && selectedAnswer !== q.answer) { // 如果這是玩家選錯的答案
      optionColor = "#FF5D8F"; // 將錯誤答案設定成粉紅色
    } // 結束錯誤答案顏色判斷

    if (answered && i === q.answer) { // 如果這是正確答案
      optionColor = "#AACC00"; // 將正確答案設定成綠色
    } // 結束正確答案顏色判斷

    fill(optionColor); // 設定選項框顏色
    stroke("#FFFFFF"); // 設定選項框白色外框
    strokeWeight(3); // 設定選項框外框粗細
    rect(x, y, boxWidth, boxHeight, 18); // 繪製四角圓弧的選項框

    fill("#333333"); // 設定選項文字顏色
    noStroke(); // 移除文字外框
    textSize(min(width * 0.032, 24)); // 根據螢幕寬度適度縮小選項文字
    text(q.options[i], x, y); // 顯示選項內容
  } // 結束四個選項的迴圈

  if (answered) { // 如果玩家已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      fill("#FFFFFF"); // 設定看分數按鈕顏色
      stroke("#FFFFFF"); // 設定按鈕外框顏色
      strokeWeight(3); // 設定按鈕外框粗細
      rect(width / 2, height * 0.91, 230, 60, 18); // 繪製看分數按鈕

      fill("#333333"); // 設定按鈕文字顏色
      noStroke(); // 移除文字外框
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小按鈕文字
      text("看分數", width / 2, height * 0.91); // 顯示看分數文字
    } else { // 如果不是最後一題
      fill("#333333"); // 設定提示文字顏色
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小提示文字
      text("點擊空白處進入下一題", width / 2, height * 0.91); // 顯示點擊空白處的提示
    } // 結束最後一題判斷
  } // 結束作答後提示判斷
} // drawQuestion 函式結束

function drawFinalScreen() { // 繪製最後成績畫面
  fill("#333333"); // 設定標題文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.07, 70)); // 根據螢幕寬度適度縮小標題文字
  text("測驗完成！", width / 2, height * 0.28); // 顯示測驗完成文字

  textSize(min(width * 0.055, 55)); // 根據螢幕寬度適度縮小分數文字
  text("你的總分：" + score + " / 5", width / 2, height * 0.42); // 顯示玩家總分

  textSize(min(width * 0.035, 26)); // 根據螢幕寬度適度縮小重新測驗提示
  text("要再測驗一次嗎？", width / 2, height * 0.58); // 顯示重新測驗詢問

  fill("#FFFFFF"); // 設定重新測驗按鈕顏色
  stroke("#FFFFFF"); // 設定按鈕外框顏色
  strokeWeight(3); // 設定按鈕外框粗細
  rect(width / 2, height * 0.70, 230, 70, 20); // 繪製重新測驗按鈕

  fill("#333333"); // 設定按鈕文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.034, 25)); // 根據螢幕寬度適度縮小按鈕文字
  text("再測驗一次", width / 2, height * 0.70); // 顯示重新測驗文字
} // drawFinalScreen 函式結束

function mousePressed() { // 當滑鼠被按下時執行
  if (gameFinished) { // 如果目前位於最後成績畫面
    if (dist(mouseX, mouseY, width / 2, height * 0.70) < 120) { // 判斷是否點擊重新測驗按鈕
      restartGame(); // 重新開始測驗
    } // 結束重新測驗按鈕判斷
    return; // 結束這次滑鼠事件
  } // 結束測驗完成判斷

  let q = questions[currentQuestion]; // 取得目前題目的資料

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  if (!answered) { // 如果目前還沒有作答
    for (let i = 0; i < 4; i++) { // 檢查四個選項
      let y = startY + i * gap; // 計算目前選項的垂直位置

      if (mouseX > width / 2 - boxWidth / 2 && mouseX < width / 2 + boxWidth / 2 && mouseY > y - boxHeight / 2 && mouseY < y + boxHeight / 2) { // 判斷是否點擊選項
        selectedAnswer = i; // 記錄玩家選擇的答案
        answered = true; // 將題目設定成已作答
        showResult = true; // 開啟答題結果顯示

        if (selectedAnswer === q.answer) { // 如果玩家答對
          score++; // 分數增加一分
          createConfetti(); // 產生一批彩帶
        } else { // 如果玩家答錯
          shaking = true; // 開啟畫面震動
          shakeStart = millis(); // 記錄震動開始時間
        } // 結束答案判斷

        return; // 完成點擊選項後結束函式
      } // 結束選項碰撞判斷
    } // 結束四個選項的迴圈
  } else { // 如果目前已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      if (mouseX > width / 2 - 115 && mouseX < width / 2 + 115 && mouseY > height * 0.91 - 30 && mouseY < height * 0.91 + 30) { // 判斷是否點擊看分數按鈕
        nextQuestion(); // 顯示最後分數
      } // 結束看分數按鈕判斷
    } else { // 如果不是最後一題
      let blankAreaTop = height * 0.82; // 設定空白區域的上界
      let blankAreaBottom = height; // 設定空白區域的下界

      if (mouseY > blankAreaTop && mouseY < blankAreaBottom) { // 判斷是否點擊下方空白區域
        nextQuestion(); // 進入下一題
      } // 結束空白區域判斷
    } // 結束最後一題判斷
  } // 結束是否已作答判斷
} // mousePressed 函式結束

function nextQuestion() { // 進入下一題或顯示分數的函式
  if (currentQuestion < questions.length - 1) { // 如果還有下一題
    currentQuestion++; // 題目編號增加一
    answered = false; // 重置作答狀態
    selectedAnswer = -1; // 清除上一題選擇
    showResult = false; // 關閉答題結果
  } else { // 如果已經完成最後一題
    gameFinished = true; // 開啟測驗完成狀態
  } // 結束題目判斷
} // nextQuestion 函式結束

function createConfetti() { // 建立彩帶的函式
  for (let i = 0; i < 70; i++) { // 一次產生 70 個彩帶
    let piece = { // 建立單個彩帶物件
      x: random(width * 0.25, width * 0.75), // 設定彩帶隨機水平位置
      y: -random(20, 150), // 設定彩帶從畫面上方開始
      size: random(7, 14), // 設定彩帶大小
      speedY: random(2, 5), // 設定彩帶下落速度
      speedX: random(-2, 2), // 設定彩帶水平速度
      rotation: random(TWO_PI), // 設定彩帶初始旋轉角度
      rotationSpeed: random(-0.08, 0.08), // 設定彩帶旋轉速度
      color: random(["#FF5D8F", "#AACC00", "#FFFFFF", "#FFCF56", "#7B61FF", "#FF8C42"]) // 隨機設定彩帶顏色
    }; // 結束彩帶物件
    confetti.push(piece); // 將彩帶加入彩帶陣列
  } // 結束彩帶產生迴圈
} // createConfetti 函式結束

function drawConfetti() { // 更新並繪製彩帶
  for (let i = confetti.length - 1; i >= 0; i--) { // 從最後一個彩帶開始處理
    let c = confetti[i]; // 取得目前彩帶

    c.x += c.speedX; // 更新彩帶水平位置
    c.y += c.speedY; // 更新彩帶垂直位置
    c.speedY += 0.04; // 模擬重力讓彩帶越掉越快
    c.rotation += c.rotationSpeed; // 更新彩帶旋轉角度

    push(); // 儲存目前畫布狀態
    translate(c.x, c.y); // 移動到彩帶位置
    rotate(c.rotation); // 旋轉彩帶
    fill(c.color); // 設定彩帶顏色
    noStroke(); // 移除彩帶外框
    rect(0, 0, c.size, c.size * 1.8); // 繪製彩帶
    pop(); // 恢復畫布狀態

    if (c.y > height + 30) { // 如果彩帶已經掉到畫面最下面
      confetti.splice(i, 1); // 將彩帶從陣列中刪除
    } // 結束彩帶刪除判斷
  } // 結束彩帶迴圈
} // drawConfetti 函式結束

function restartGame() { // 重新開始遊戲的函式
  currentQuestion = 0; // 將題目回到第一題
  score = 0; // 將分數歸零
  answered = false; // 重置作答狀態
  selectedAnswer = -1; // 清除答案選擇
  showResult = false; // 關閉結果顯示
  gameFinished = false; // 關閉測驗完成狀態
  shaking = false; // 關閉畫面震動
  confetti = []; // 清除畫面上剩餘的彩帶
} // restartGame 函式結束

function windowResized() { // 當瀏覽器視窗大小改變時執行
  resizeCanvas(windowWidth, windowHeight); // 讓畫布跟著視窗大小重新調整
} // windowResized 函式結束


```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![{70BAB738-7FC8-410E-B529-480F4FE22522}](https://hackmd.io/_uploads/H1g6NTNoMe.png)


### 第一次問 AI

```tex!
我要更換字型
這些我應該如何加入程式

中文：
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@100..900&display=swap" rel="stylesheet">

英文：
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Noto+Sans+HK:wght@100..900&display=swap" rel="stylesheet">

```



### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```HTML=

<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>數學測驗</title>

  <!-- 載入 Google Fonts 的連線 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- 載入中文黑體與英文手寫字體 -->
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Noto+Sans+HK:wght@100..900&display=swap" rel="stylesheet">

  <!-- 設定網頁畫布的基本樣式 -->
  <style>
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    canvas {
      display: block;
    }
  </style>

  <!-- 載入 p5.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/p5.min.js"></script>

  <!-- 載入測驗程式 -->
  <script src="sketch.js"></script>
</head>

<body>
</body>
</html>

```
:::
:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=

let questions = [ // 建立五題題目的陣列
  { // 第一題資料
    question: "若 2x + y = 11，且 x + y = 7，則 x = ?", // 設定第一題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 2 // 設定正確答案為第三個選項，x = 4
  }, // 第一題結束
  { // 第二題資料
    question: "若 x + y = 10，且 2x - y = 5，則 x = ?", // 設定第二題題目
    options: ["3", "4", "5", "6"], // 設定四個選項
    answer: 2 // 設定正確答案為第三個選項，x = 5
  }, // 第二題結束
  { // 第三題資料
    question: "若 3x + y = 13，且 x + y = 7，則 x = ?", // 設定第三題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 3
  }, // 第三題結束
  { // 第四題資料
    question: "若 2x + 3y = 16，且 x + y = 6，則 y = ?", // 設定第四題題目
    options: ["1", "2", "3", "4"], // 設定四個選項
    answer: 3 // 設定正確答案為第四個選項，y = 4
  }, // 第四題結束
  { // 第五題資料
    question: "若 3x - y = 7，且 x + y = 5，則 x = ?", // 設定第五題題目
    options: ["2", "3", "4", "5"], // 設定四個選項
    answer: 1 // 設定正確答案為第二個選項，x = 3
  } // 第五題結束
]; // 結束題目陣列

let currentQuestion = 0; // 記錄目前正在作答的題目編號
let score = 0; // 記錄目前得到的分數
let answered = false; // 記錄目前題目是否已經作答
let selectedAnswer = -1; // 記錄玩家選擇的答案
let showResult = false; // 記錄是否顯示答題結果
let gameFinished = false; // 記錄測驗是否全部結束
let shaking = false; // 記錄畫面是否正在震動
let shakeStart = 0; // 記錄畫面震動開始的時間
let confetti = []; // 建立彩帶粒子的陣列

function setup() { // p5.js 初始化函式
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布
  textFont("Noto Sans HK"); // 設定預設中文文字使用 Noto Sans HK 字型
  rectMode(CENTER); // 設定矩形以中心點作為定位
  textAlign(CENTER, CENTER); // 設定文字水平與垂直置中
} // setup 函式結束

function drawMixedText(content, x, y) { // 依照文字內容分別使用中文與英文數字字型
  let characters = Array.from(String(content)); // 將文字拆成單一字元
  let segments = []; // 建立儲存不同字型文字片段的陣列

  for (let character of characters) { // 逐一檢查每個字元
    let fontName = /^[\x00-\x7F]$/.test(character) ? "Dancing Script" : "Noto Sans HK"; // ASCII 字元使用手寫體，其餘字元使用中文黑體

    if (segments.length === 0 || segments[segments.length - 1].font !== fontName) { // 如果沒有片段或字型與上一段不同
      segments.push({ text: character, font: fontName }); // 建立新的字型片段
    } else { // 如果字型與上一段相同
      segments[segments.length - 1].text += character; // 將字元接到上一個片段
    } // 結束字型片段判斷
  } // 結束逐字檢查

  let totalWidth = 0; // 記錄整段文字的總寬度

  for (let segment of segments) { // 逐一計算各文字片段的寬度
    textFont(segment.font); // 設定目前片段的字型
    segment.width = textWidth(segment.text); // 計算目前片段的實際寬度
    totalWidth += segment.width; // 累加整段文字的寬度
  } // 結束文字寬度計算

  push(); // 儲存目前畫布的文字設定
  textAlign(LEFT, CENTER); // 設定片段從左側開始繪製
  let currentX = x - totalWidth / 2; // 計算整段文字置中後的起始位置

  for (let segment of segments) { // 逐一繪製各文字片段
    textFont(segment.font); // 設定目前片段的字型
    text(segment.text, currentX, y); // 繪製目前片段
    currentX += segment.width; // 移動到下一個片段的起始位置
  } // 結束文字片段繪製

  pop(); // 恢復原本的文字設定
} // 混合字型繪製函式結束

function draw() { // p5.js 每一幀都會執行的函式
  background("#A9DEF9"); // 設定整個畫面的背景顏色

  let offsetX = 0; // 設定畫面水平震動位移
  let offsetY = 0; // 設定畫面垂直震動位移

  if (shaking) { // 如果目前正在震動畫面
    let elapsed = millis() - shakeStart; // 計算震動已經持續多久
    if (elapsed < 350) { // 如果震動時間還不到 350 毫秒
      offsetX = random(-12, 12); // 隨機產生水平震動
      offsetY = random(-12, 12); // 隨機產生垂直震動
    } else { // 如果震動已經結束
      shaking = false; // 關閉震動狀態
    } // 結束震動時間判斷
  } // 結束震動判斷

  push(); // 儲存目前畫布狀態
  translate(offsetX, offsetY); // 將整個內容套用震動位移

  if (gameFinished) { // 如果五題都已經完成
    drawFinalScreen(); // 顯示最後的成績畫面
  } else { // 如果測驗還沒有結束
    drawQuestion(); // 顯示目前的題目
  } // 結束畫面判斷

  pop(); // 恢復畫布狀態

  drawConfetti(); // 更新並繪製彩帶
} // draw 函式結束

function drawQuestion() { // 繪製題目畫面
  let q = questions[currentQuestion]; // 取得目前題目的資料

  fill("#FFFFFF"); // 設定題號文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.035, 24)); // 根據螢幕寬度適度縮小題號文字
  drawMixedText("第 " + (currentQuestion + 1) + " 題 / 5", width / 2, height * 0.12); // 顯示目前題號並混合兩種字型

  fill("#333333"); // 設定題目文字顏色
  textSize(min(width * 0.035, 34)); // 根據螢幕寬度適度縮小題目文字
  drawMixedText(q.question, width / 2, height * 0.24); // 顯示題目並讓中文與數學式使用不同字型

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的垂直距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  for (let i = 0; i < 4; i++) { // 依序繪製四個選項
    let x = width / 2; // 設定選項水平位置
    let baseY = startY + i * gap; // 計算選項的原始垂直位置
    let y = baseY; // 儲存目前選項的垂直位置

    if (answered && i === q.answer && selectedAnswer !== q.answer) { // 如果答錯且目前是正確答案
      y += sin(frameCount * 0.12) * 8; // 讓正確答案上下晃動
    } // 結束正確答案晃動判斷

    let optionColor = "#FFFFFF"; // 預設選項為白色

    if (answered && i === selectedAnswer && selectedAnswer !== q.answer) { // 如果這是玩家選錯的答案
      optionColor = "#FF5D8F"; // 將錯誤答案設定成粉紅色
    } // 結束錯誤答案顏色判斷

    if (answered && i === q.answer) { // 如果這是正確答案
      optionColor = "#AACC00"; // 將正確答案設定成綠色
    } // 結束正確答案顏色判斷

    fill(optionColor); // 設定選項框顏色
    stroke("#FFFFFF"); // 設定選項框白色外框
    strokeWeight(3); // 設定選項框外框粗細
    rect(x, y, boxWidth, boxHeight, 18); // 繪製四角圓弧的選項框

    fill("#333333"); // 設定選項文字顏色
    noStroke(); // 移除文字外框
    textSize(min(width * 0.032, 24)); // 根據螢幕寬度適度縮小選項文字
    drawMixedText(q.options[i], x, y); // 顯示選項並使用 Dancing Script 字型
  } // 結束四個選項的迴圈

  if (answered) { // 如果玩家已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      fill("#FFFFFF"); // 設定看分數按鈕顏色
      stroke("#FFFFFF"); // 設定按鈕外框顏色
      strokeWeight(3); // 設定按鈕外框粗細
      rect(width / 2, height * 0.91, 230, 60, 18); // 繪製看分數按鈕

      fill("#333333"); // 設定按鈕文字顏色
      noStroke(); // 移除文字外框
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小按鈕文字
      drawMixedText("看分數", width / 2, height * 0.91); // 顯示看分數文字
    } else { // 如果不是最後一題
      fill("#333333"); // 設定提示文字顏色
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小提示文字
      drawMixedText("點擊空白處進入下一題", width / 2, height * 0.91); // 顯示點擊空白處的提示
    } // 結束最後一題判斷
  } // 結束作答後提示判斷
} // drawQuestion 函式結束

function drawFinalScreen() { // 繪製最後成績畫面
  fill("#333333"); // 設定標題文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.07, 70)); // 根據螢幕寬度適度縮小標題文字
  drawMixedText("測驗完成！", width / 2, height * 0.28); // 顯示測驗完成文字

  textSize(min(width * 0.055, 55)); // 根據螢幕寬度適度縮小分數文字
  drawMixedText("你的總分：" + score + " / 5", width / 2, height * 0.42); // 顯示玩家總分並混合兩種字型

  textSize(min(width * 0.035, 26)); // 根據螢幕寬度適度縮小重新測驗提示
  drawMixedText("要再測驗一次嗎？", width / 2, height * 0.58); // 顯示重新測驗詢問

  fill("#FFFFFF"); // 設定重新測驗按鈕顏色
  stroke("#FFFFFF"); // 設定按鈕外框顏色
  strokeWeight(3); // 設定按鈕外框粗細
  rect(width / 2, height * 0.70, 230, 70, 20); // 繪製重新測驗按鈕

  fill("#333333"); // 設定按鈕文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.034, 25)); // 根據螢幕寬度適度縮小按鈕文字
  drawMixedText("再測驗一次", width / 2, height * 0.70); // 顯示重新測驗文字
} // drawFinalScreen 函式結束

function mousePressed() { // 當滑鼠被按下時執行
  if (gameFinished) { // 如果目前位於最後成績畫面
    if (dist(mouseX, mouseY, width / 2, height * 0.70) < 120) { // 判斷是否點擊重新測驗按鈕
      restartGame(); // 重新開始測驗
    } // 結束重新測驗按鈕判斷
    return; // 結束這次滑鼠事件
  } // 結束測驗完成判斷

  let q = questions[currentQuestion]; // 取得目前題目的資料

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  if (!answered) { // 如果目前還沒有作答
    for (let i = 0; i < 4; i++) { // 檢查四個選項
      let y = startY + i * gap; // 計算目前選項的垂直位置

      if (mouseX > width / 2 - boxWidth / 2 && mouseX < width / 2 + boxWidth / 2 && mouseY > y - boxHeight / 2 && mouseY < y + boxHeight / 2) { // 判斷是否點擊選項
        selectedAnswer = i; // 記錄玩家選擇的答案
        answered = true; // 將題目設定成已作答
        showResult = true; // 開啟答題結果顯示

        if (selectedAnswer === q.answer) { // 如果玩家答對
          score++; // 分數增加一分
          createConfetti(); // 產生一批彩帶
        } else { // 如果玩家答錯
          shaking = true; // 開啟畫面震動
          shakeStart = millis(); // 記錄震動開始時間
        } // 結束答案判斷

        return; // 完成點擊選項後結束函式
      } // 結束選項碰撞判斷
    } // 結束四個選項的迴圈
  } else { // 如果目前已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      if (mouseX > width / 2 - 115 && mouseX < width / 2 + 115 && mouseY > height * 0.91 - 30 && mouseY < height * 0.91 + 30) { // 判斷是否點擊看分數按鈕
        nextQuestion(); // 顯示最後分數
      } // 結束看分數按鈕判斷
    } else { // 如果不是最後一題
      let blankAreaTop = height * 0.82; // 設定空白區域的上界
      let blankAreaBottom = height; // 設定空白區域的下界

      if (mouseY > blankAreaTop && mouseY < blankAreaBottom) { // 判斷是否點擊下方空白區域
        nextQuestion(); // 進入下一題
      } // 結束空白區域判斷
    } // 結束最後一題判斷
  } // 結束是否已作答判斷
} // mousePressed 函式結束

function nextQuestion() { // 進入下一題或顯示分數的函式
  if (currentQuestion < questions.length - 1) { // 如果還有下一題
    currentQuestion++; // 題目編號增加一
    answered = false; // 重置作答狀態
    selectedAnswer = -1; // 清除上一題選擇
    showResult = false; // 關閉答題結果
  } else { // 如果已經完成最後一題
    gameFinished = true; // 開啟測驗完成狀態
  } // 結束題目判斷
} // nextQuestion 函式結束

function createConfetti() { // 建立彩帶的函式
  for (let i = 0; i < 70; i++) { // 一次產生 70 個彩帶
    let piece = { // 建立單個彩帶物件
      x: random(width * 0.25, width * 0.75), // 設定彩帶隨機水平位置
      y: -random(20, 150), // 設定彩帶從畫面上方開始
      size: random(7, 14), // 設定彩帶大小
      speedY: random(2, 5), // 設定彩帶下落速度
      speedX: random(-2, 2), // 設定彩帶水平速度
      rotation: random(TWO_PI), // 設定彩帶初始旋轉角度
      rotationSpeed: random(-0.08, 0.08), // 設定彩帶旋轉速度
      color: random(["#FF5D8F", "#AACC00", "#FFFFFF", "#FFCF56", "#7B61FF", "#FF8C42"]) // 隨機設定彩帶顏色
    }; // 結束彩帶物件
    confetti.push(piece); // 將彩帶加入彩帶陣列
  } // 結束彩帶產生迴圈
} // createConfetti 函式結束

function drawConfetti() { // 更新並繪製彩帶
  for (let i = confetti.length - 1; i >= 0; i--) { // 從最後一個彩帶開始處理
    let c = confetti[i]; // 取得目前彩帶

    c.x += c.speedX; // 更新彩帶水平位置
    c.y += c.speedY; // 更新彩帶垂直位置
    c.speedY += 0.04; // 模擬重力讓彩帶越掉越快
    c.rotation += c.rotationSpeed; // 更新彩帶旋轉角度

    push(); // 儲存目前畫布狀態
    translate(c.x, c.y); // 移動到彩帶位置
    rotate(c.rotation); // 旋轉彩帶
    fill(c.color); // 設定彩帶顏色
    noStroke(); // 移除彩帶外框
    rect(0, 0, c.size, c.size * 1.8); // 繪製彩帶
    pop(); // 恢復畫布狀態

    if (c.y > height + 30) { // 如果彩帶已經掉到畫面最下面
      confetti.splice(i, 1); // 將彩帶從陣列中刪除
    } // 結束彩帶刪除判斷
  } // 結束彩帶迴圈
} // drawConfetti 函式結束

function restartGame() { // 重新開始遊戲的函式
  currentQuestion = 0; // 將題目回到第一題
  score = 0; // 將分數歸零
  answered = false; // 重置作答狀態
  selectedAnswer = -1; // 清除答案選擇
  showResult = false; // 關閉結果顯示
  gameFinished = false; // 關閉測驗完成狀態
  shaking = false; // 關閉畫面震動
  confetti = []; // 清除畫面上剩餘的彩帶
} // restartGame 函式結束

function windowResized() { // 當瀏覽器視窗大小改變時執行
  resizeCanvas(windowWidth, windowHeight); // 讓畫布跟著視窗大小重新調整
} // windowResized 函式結束



```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![image](https://hackmd.io/_uploads/rJ3yMNXnfx.png)
![image](https://hackmd.io/_uploads/SkoefVmhMg.png)


### 第一次問 AI

```tex!
設定題庫並抽題顯示題目網頁使用CSV 檔， 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。題庫內有15提，讀取後每次隨機抽出五題
```



### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
let questions = []; // 儲存本次測驗隨機抽出的五題
let questionBank = []; // 儲存從 questions.csv 讀取的完整題庫
let csvTable; // 儲存 CSV 題庫資料
let loadError = ""; // 記錄 CSV 載入錯誤訊息

let currentQuestion = 0; // 記錄目前正在作答的題目編號
let score = 0; // 記錄目前得到的分數
let answered = false; // 記錄目前題目是否已經作答
let selectedAnswer = -1; // 記錄玩家選擇的答案
let showResult = false; // 記錄是否顯示答題結果
let gameFinished = false; // 記錄測驗是否全部結束
let shaking = false; // 記錄畫面是否正在震動
let shakeStart = 0; // 記錄畫面震動開始的時間
let confetti = []; // 建立彩帶粒子的陣列

function preload() { // p5.js 在 setup 前執行，用來預先讀取 CSV 題庫
  csvTable = loadTable( // 讀取 questions.csv 檔案
    "questions.csv", // 設定要讀取的 CSV 檔案名稱
    "csv", // 設定檔案格式為 CSV
    "header", // 設定 CSV 第一列為欄位名稱
    loadQuestions, // CSV 成功讀取後執行 loadQuestions 函式
    csvLoadFailed // CSV 讀取失敗後執行 csvLoadFailed 函式
  ); // 結束 CSV 載入設定
} // preload 函式結束

function loadQuestions(table) { // 將 CSV 題庫資料轉換成程式使用的格式
  questionBank = []; // 清空完整題庫陣列

  for (let row of table.rows) { // 逐列讀取 CSV 題庫資料
    let questionText = row.getString("question").trim(); // 讀取題目文字

    let options = [ // 建立目前題目的四個選項
      row.getString("option1").trim(), // 讀取第一個選項
      row.getString("option2").trim(), // 讀取第二個選項
      row.getString("option3").trim(), // 讀取第三個選項
      row.getString("option4").trim() // 讀取第四個選項
    ]; // 結束四個選項設定

    let answerIndex = int(row.getString("answer")) - 1; // 將 CSV 的 1 到 4 轉成程式使用的 0 到 3

    if ( // 檢查目前資料是否格式正確
      questionText === "" || // 檢查題目是否為空白
      options.some(option => option === "") || // 檢查是否有選項為空白
      answerIndex < 0 || // 檢查答案是否小於 0
      answerIndex > 3 // 檢查答案是否大於 3
    ) { // 如果資料格式不正確
      console.warn("忽略格式錯誤的題目：", row.arr); // 在主控台顯示錯誤資料
      continue; // 跳過這一筆錯誤資料
    } // 結束資料格式檢查

    questionBank.push({ // 將正確的題目加入完整題庫
      question: questionText, // 儲存題目文字
      options: options, // 儲存四個選項
      answer: answerIndex // 儲存正確答案索引
    }); // 結束題目資料加入
  } // 結束 CSV 每一列讀取

  if (questionBank.length < 5) { // 如果完整題庫少於五題
    loadError = "題庫至少需要 5 題，目前只有 " + questionBank.length + " 題。"; // 設定錯誤訊息
    return; // 結束題庫讀取函式
  } // 結束題庫數量檢查

  drawRandomQuestions(); // 題庫讀取完成後隨機抽出五題
} // loadQuestions 函式結束

function csvLoadFailed(error) { // CSV 讀取失敗時執行的函式
  loadError = "無法讀取 questions.csv，請確認檔案名稱與檔案位置是否正確。"; // 設定錯誤訊息
  console.error(error); // 將詳細錯誤資訊顯示在主控台
} // csvLoadFailed 函式結束

function drawRandomQuestions() { // 從完整題庫中隨機抽出五題
  let shuffledQuestions = shuffle(questionBank, true); // 複製題庫後隨機打亂題目順序
  questions = shuffledQuestions.slice(0, 5); // 從打亂後的題庫取出前五題
} // drawRandomQuestions 函式結束

function setup() { // p5.js 初始化函式
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布
  textFont("Noto Sans HK"); // 設定預設中文文字使用 Noto Sans HK 字型
  rectMode(CENTER); // 設定矩形以中心點作為定位
  textAlign(CENTER, CENTER); // 設定文字水平與垂直置中
} // setup 函式結束

function drawMixedText(content, x, y) { // 依照文字內容分別使用中文與英文數字字型
  let characters = Array.from(String(content)); // 將文字拆成單一字元
  let segments = []; // 建立儲存不同字型文字片段的陣列

  for (let character of characters) { // 逐一檢查每個字元
    let fontName = /^[\x00-\x7F]$/.test(character) ? "Dancing Script" : "Noto Sans HK"; // ASCII 字元使用手寫體，其餘字元使用中文黑體

    if (segments.length === 0 || segments[segments.length - 1].font !== fontName) { // 如果沒有片段或字型與上一段不同
      segments.push({ text: character, font: fontName }); // 建立新的字型片段
    } else { // 如果字型與上一段相同
      segments[segments.length - 1].text += character; // 將字元接到上一個片段
    } // 結束字型片段判斷
  } // 結束逐字檢查

  let totalWidth = 0; // 記錄整段文字的總寬度

  for (let segment of segments) { // 逐一計算各文字片段的寬度
    textFont(segment.font); // 設定目前片段的字型
    segment.width = textWidth(segment.text); // 計算目前片段的實際寬度
    totalWidth += segment.width; // 累加整段文字的寬度
  } // 結束文字寬度計算

  push(); // 儲存目前畫布的文字設定
  textAlign(LEFT, CENTER); // 設定片段從左側開始繪製
  let currentX = x - totalWidth / 2; // 計算整段文字置中後的起始位置

  for (let segment of segments) { // 逐一繪製各文字片段
    textFont(segment.font); // 設定目前片段的字型
    text(segment.text, currentX, y); // 繪製目前片段
    currentX += segment.width; // 移動到下一個片段的起始位置
  } // 結束文字片段繪製

  pop(); // 恢復原本的文字設定
} // 混合字型繪製函式結束

function draw() { // p5.js 每一幀都會執行的函式
  background("#A9DEF9"); // 設定整個畫面的背景顏色

  if (loadError !== "") { // 如果 CSV 題庫讀取失敗
    drawLoadError(); // 顯示錯誤畫面
    return; // 結束本次繪圖
  } // 結束 CSV 錯誤判斷

  if (questionBank.length === 0 || questions.length === 0) { // 如果題庫尚未完成載入
    drawLoading(); // 顯示載入中畫面
    return; // 結束本次繪圖
  } // 結束題庫載入判斷

  let offsetX = 0; // 設定畫面水平震動位移
  let offsetY = 0; // 設定畫面垂直震動位移

  if (shaking) { // 如果目前正在震動畫面
    let elapsed = millis() - shakeStart; // 計算震動已經持續多久
    if (elapsed < 350) { // 如果震動時間還不到 350 毫秒
      offsetX = random(-12, 12); // 隨機產生水平震動
      offsetY = random(-12, 12); // 隨機產生垂直震動
    } else { // 如果震動已經結束
      shaking = false; // 關閉震動狀態
    } // 結束震動時間判斷
  } // 結束震動判斷

  push(); // 儲存目前畫布狀態
  translate(offsetX, offsetY); // 將整個內容套用震動位移

  if (gameFinished) { // 如果五題都已經完成
    drawFinalScreen(); // 顯示最後的成績畫面
  } else { // 如果測驗還沒有結束
    drawQuestion(); // 顯示目前的題目
  } // 結束畫面判斷

  pop(); // 恢復畫布狀態

  drawConfetti(); // 更新並繪製彩帶
} // draw 函式結束

function drawLoading() { // 繪製題庫載入中的畫面
  fill("#333333"); // 設定載入文字顏色
  noStroke(); // 移除文字外框
  textSize(32); // 設定載入文字大小
  textAlign(CENTER, CENTER); // 設定文字置中
  text("正在讀取題庫...", width / 2, height / 2); // 顯示載入中提示
} // drawLoading 函式結束

function drawLoadError() { // 繪製題庫載入錯誤的畫面
  fill("#D62828"); // 設定錯誤文字顏色
  noStroke(); // 移除文字外框
  textSize(24); // 設定錯誤文字大小
  textAlign(CENTER, CENTER); // 設定文字置中
  text(loadError, width / 2, height / 2); // 顯示錯誤訊息
} // drawLoadError 函式結束

function drawQuestion() { // 繪製題目畫面
  let q = questions[currentQuestion]; // 取得目前題目的資料

  fill("#FFFFFF"); // 設定題號文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.035, 24)); // 根據螢幕寬度適度縮小題號文字
  drawMixedText("第 " + (currentQuestion + 1) + " 題 / 5", width / 2, height * 0.12); // 顯示目前題號並混合兩種字型

  fill("#333333"); // 設定題目文字顏色
  textSize(min(width * 0.035, 34)); // 根據螢幕寬度適度縮小題目文字
  drawMixedText(q.question, width / 2, height * 0.24); // 顯示題目並讓中文與數學式使用不同字型

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的垂直距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  for (let i = 0; i < 4; i++) { // 依序繪製四個選項
    let x = width / 2; // 設定選項水平位置
    let baseY = startY + i * gap; // 計算選項的原始垂直位置
    let y = baseY; // 儲存目前選項的垂直位置

    if (answered && i === q.answer && selectedAnswer !== q.answer) { // 如果答錯且目前是正確答案
      y += sin(frameCount * 0.12) * 8; // 讓正確答案上下晃動
    } // 結束正確答案晃動判斷

    let optionColor = "#FFFFFF"; // 預設選項為白色

    if (answered && i === selectedAnswer && selectedAnswer !== q.answer) { // 如果這是玩家選錯的答案
      optionColor = "#FF5D8F"; // 將錯誤答案設定成粉紅色
    } // 結束錯誤答案顏色判斷

    if (answered && i === q.answer) { // 如果這是正確答案
      optionColor = "#AACC00"; // 將正確答案設定成綠色
    } // 結束正確答案顏色判斷

    fill(optionColor); // 設定選項框顏色
    stroke("#FFFFFF"); // 設定選項框白色外框
    strokeWeight(3); // 設定選項框外框粗細
    rect(x, y, boxWidth, boxHeight, 18); // 繪製四角圓弧的選項框

    fill("#333333"); // 設定選項文字顏色
    noStroke(); // 移除文字外框
    textSize(min(width * 0.032, 24)); // 根據螢幕寬度適度縮小選項文字
    drawMixedText(q.options[i], x, y); // 顯示選項並使用 Dancing Script 字型
  } // 結束四個選項的迴圈

  if (answered) { // 如果玩家已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      fill("#FFFFFF"); // 設定看分數按鈕顏色
      stroke("#FFFFFF"); // 設定按鈕外框顏色
      strokeWeight(3); // 設定按鈕外框粗細
      rect(width / 2, height * 0.91, 230, 60, 18); // 繪製看分數按鈕

      fill("#333333"); // 設定按鈕文字顏色
      noStroke(); // 移除文字外框
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小按鈕文字
      drawMixedText("看分數", width / 2, height * 0.91); // 顯示看分數文字
    } else { // 如果不是最後一題
      fill("#333333"); // 設定提示文字顏色
      textSize(min(width * 0.03, 22)); // 根據螢幕寬度適度縮小提示文字
      drawMixedText("點擊空白處進入下一題", width / 2, height * 0.91); // 顯示點擊空白處的提示
    } // 結束最後一題判斷
  } // 結束作答後提示判斷
} // drawQuestion 函式結束

function drawFinalScreen() { // 繪製最後成績畫面
  fill("#333333"); // 設定標題文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.07, 70)); // 根據螢幕寬度適度縮小標題文字
  drawMixedText("測驗完成！", width / 2, height * 0.28); // 顯示測驗完成文字

  textSize(min(width * 0.055, 55)); // 根據螢幕寬度適度縮小分數文字
  drawMixedText("你的總分：" + score + " / 5", width / 2, height * 0.42); // 顯示玩家總分並混合兩種字型

  textSize(min(width * 0.035, 26)); // 根據螢幕寬度適度縮小重新測驗提示
  drawMixedText("要再測驗一次嗎？", width / 2, height * 0.58); // 顯示重新測驗詢問

  fill("#FFFFFF"); // 設定重新測驗按鈕顏色
  stroke("#FFFFFF"); // 設定按鈕外框顏色
  strokeWeight(3); // 設定按鈕外框粗細
  rect(width / 2, height * 0.70, 230, 70, 20); // 繪製重新測驗按鈕

  fill("#333333"); // 設定按鈕文字顏色
  noStroke(); // 移除文字外框
  textSize(min(width * 0.034, 25)); // 根據螢幕寬度適度縮小按鈕文字
  drawMixedText("再測驗一次", width / 2, height * 0.70); // 顯示重新測驗文字
} // drawFinalScreen 函式結束

function mousePressed() { // 當滑鼠被按下時執行
  if (loadError !== "" || questionBank.length === 0 || questions.length === 0) { // 如果題庫尚未載入完成或讀取失敗
    return; // 不執行任何點擊操作
  } // 結束題庫狀態判斷

  if (gameFinished) { // 如果目前位於最後成績畫面
    if (dist(mouseX, mouseY, width / 2, height * 0.70) < 120) { // 判斷是否點擊重新測驗按鈕
      restartGame(); // 重新開始測驗
    } // 結束重新測驗按鈕判斷
    return; // 結束這次滑鼠事件
  } // 結束測驗完成判斷

  let q = questions[currentQuestion]; // 取得目前題目的資料

  let boxWidth = min(width * 0.65, 600); // 設定選項框寬度
  let boxHeight = 65; // 設定選項框高度
  let gap = 85; // 設定選項之間的距離
  let startY = height * 0.38; // 設定第一個選項的垂直位置

  if (!answered) { // 如果目前還沒有作答
    for (let i = 0; i < 4; i++) { // 檢查四個選項
      let y = startY + i * gap; // 計算目前選項的垂直位置

      if (mouseX > width / 2 - boxWidth / 2 && mouseX < width / 2 + boxWidth / 2 && mouseY > y - boxHeight / 2 && mouseY < y + boxHeight / 2) { // 判斷是否點擊選項
        selectedAnswer = i; // 記錄玩家選擇的答案
        answered = true; // 將題目設定成已作答
        showResult = true; // 開啟答題結果顯示

        if (selectedAnswer === q.answer) { // 如果玩家答對
          score++; // 分數增加一分
          createConfetti(); // 產生一批彩帶
        } else { // 如果玩家答錯
          shaking = true; // 開啟畫面震動
          shakeStart = millis(); // 記錄震動開始時間
        } // 結束答案判斷

        return; // 完成點擊選項後結束函式
      } // 結束選項碰撞判斷
    } // 結束四個選項的迴圈
  } else { // 如果目前已經作答
    if (currentQuestion === questions.length - 1) { // 如果目前是最後一題
      if (mouseX > width / 2 - 115 && mouseX < width / 2 + 115 && mouseY > height * 0.91 - 30 && mouseY < height * 0.91 + 30) { // 判斷是否點擊看分數按鈕
        nextQuestion(); // 顯示最後分數
      } // 結束看分數按鈕判斷
    } else { // 如果不是最後一題
      let blankAreaTop = height * 0.82; // 設定空白區域的上界
      let blankAreaBottom = height; // 設定空白區域的下界

      if (mouseY > blankAreaTop && mouseY < blankAreaBottom) { // 判斷是否點擊下方空白區域
        nextQuestion(); // 進入下一題
      } // 結束空白區域判斷
    } // 結束最後一題判斷
  } // 結束是否已作答判斷
} // mousePressed 函式結束

function nextQuestion() { // 進入下一題或顯示分數的函式
  if (currentQuestion < questions.length - 1) { // 如果還有下一題
    currentQuestion++; // 題目編號增加一
    answered = false; // 重置作答狀態
    selectedAnswer = -1; // 清除上一題選擇
    showResult = false; // 關閉答題結果
  } else { // 如果已經完成最後一題
    gameFinished = true; // 開啟測驗完成狀態
  } // 結束題目判斷
} // nextQuestion 函式結束

function createConfetti() { // 建立彩帶的函式
  for (let i = 0; i < 70; i++) { // 一次產生 70 個彩帶
    let piece = { // 建立單個彩帶物件
      x: random(width * 0.25, width * 0.75), // 設定彩帶隨機水平位置
      y: -random(20, 150), // 設定彩帶從畫面上方開始
      size: random(7, 14), // 設定彩帶大小
      speedY: random(2, 5), // 設定彩帶下落速度
      speedX: random(-2, 2), // 設定彩帶水平速度
      rotation: random(TWO_PI), // 設定彩帶初始旋轉角度
      rotationSpeed: random(-0.08, 0.08), // 設定彩帶旋轉速度
      color: random(["#FF5D8F", "#AACC00", "#FFFFFF", "#FFCF56", "#7B61FF", "#FF8C42"]) // 隨機設定彩帶顏色
    }; // 結束彩帶物件
    confetti.push(piece); // 將彩帶加入彩帶陣列
  } // 結束彩帶產生迴圈
} // createConfetti 函式結束

function drawConfetti() { // 更新並繪製彩帶
  for (let i = confetti.length - 1; i >= 0; i--) { // 從最後一個彩帶開始處理
    let c = confetti[i]; // 取得目前彩帶

    c.x += c.speedX; // 更新彩帶水平位置
    c.y += c.speedY; // 更新彩帶垂直位置
    c.speedY += 0.04; // 模擬重力讓彩帶越掉越快
    c.rotation += c.rotationSpeed; // 更新彩帶旋轉角度

    push(); // 儲存目前畫布狀態
    translate(c.x, c.y); // 移動到彩帶位置
    rotate(c.rotation); // 旋轉彩帶
    fill(c.color); // 設定彩帶顏色
    noStroke(); // 移除彩帶外框
    rect(0, 0, c.size, c.size * 1.8); // 繪製彩帶
    pop(); // 恢復目前畫布狀態

    if (c.y > height + 30) { // 如果彩帶已經掉到畫面最下面
      confetti.splice(i, 1); // 將彩帶從陣列中刪除
    } // 結束彩帶刪除判斷
  } // 結束彩帶迴圈
} // drawConfetti 函式結束

function restartGame() { // 重新開始遊戲的函式
  drawRandomQuestions(); // 重新從完整題庫中隨機抽出五題

  currentQuestion = 0; // 將題目回到第一題
  score = 0; // 將分數歸零
  answered = false; // 重置作答狀態
  selectedAnswer = -1; // 清除答案選擇
  showResult = false; // 關閉結果顯示
  gameFinished = false; // 關閉測驗完成狀態
  shaking = false; // 關閉畫面震動
  shakeStart = 0; // 重置畫面震動開始時間
  confetti = []; // 清除畫面上剩餘的彩帶
} // restartGame 函式結束

function windowResized() { // 當瀏覽器視窗大小改變時執行
  resizeCanvas(windowWidth, windowHeight); // 讓畫布跟著視窗大小重新調整
} // windowResized 函式結束

```
:::

:::info
:::spoiler 點開貼上學習4的程式碼
```questions.csv=
question,option1,option2,option3,option4,answer
若 2x + y = 11，且 x + y = 7，則 x = ?,2,3,4,5,3
若 x + y = 10，且 2x - y = 5，則 x = ?,3,4,5,6,3
若 3x + y = 13，且 x + y = 7，則 x = ?,2,3,4,5,2
若 2x + 3y = 16，且 x + y = 6，則 y = ?,1,2,3,4,4
若 3x - y = 7，且 x + y = 5，則 x = ?,2,3,4,5,2
若 x + 2y = 12，且 x + y = 7，則 x = ?,2,3,4,5,1
若 2x + y = 14，且 x - y = 2，則 x = ?,4,16/3,6,7,2
若 4x + y = 18，且 x + y = 6，則 x = ?,3,4,5,6,2
若 x + 3y = 14，且 x + y = 6，則 y = ?,2,3,4,5,3
若 5x - y = 13，且 x + y = 5，則 x = ?,2,3,4,5,2
若 2x - y = 4，且 x + y = 5，則 x = ?,2,3,4,5,2
若 3x + 2y = 16，且 x + y = 6，則 x = ?,2,3,4,5,3
若 x - y = 1，且 2x + y = 11，則 x = ?,3,4,5,6,2
若 2x + 3y = 19，且 x + y = 7，則 y = ?,2,3,4,5,4
若 4x - y = 9，且 x + y = 6，則 x = ?,2,3,4,5,2

```
:::

---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![image](https://hackmd.io/_uploads/BJuroVm2fe.png)
![image](https://hackmd.io/_uploads/ByKUsEmhfg.png)
questions.csv的題目是二元一次，試算表是幾何，由此可知成功讀取到試算表


### 第一次問 AI

```tex!
我該如何把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。questions.csv 當備用題庫
```

### 第二次問 AI

```tex!
多出了字數太多的問題，太多的時候會被切掉，我該如何讓他換行
```



### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=

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


```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）
我覺得最困難的是連接到試算表，除了要讓它優先讀取試算表，還要判斷是否成功讀取到試算表。後續我將題目類型設定不同，馬上就可以判斷
＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿

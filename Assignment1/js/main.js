/* =========================================================
   夜莺与玫瑰 · 作业一 — main.js
   文案列表渲染 / 旁白试听 / 滚动进度 / 导航高亮 / 入场动画
   台词数据与成片 src/v3/timeline.json 完全一致
   ========================================================= */

/* ---------- 1. 文案数据：23 句旁白（en = 王尔德原文引用） ---------- */
const SCRIPT = [
  { id: "S01", zh: "一朵用生命换来的玫瑰，最后被一辆马车的车轮碾碎。", s: 0.90, e: 4.67 },
  { id: "S02", zh: "王尔德 ·《夜莺与玫瑰》", label: "序章", s: 5.13, e: 8.51 },
  { id: "S03", zh: "夜色落进花园，白玫瑰在月光里静静开着。", s: 8.87, e: 12.40 },
  { id: "S04", zh: "学生爱上教授的女儿，她说：献我一朵红玫瑰，就与你跳舞。", label: "第一章 · 夜莺听见了", s: 12.56, e: 17.29 },
  { id: "S05", zh: "可是他的整座花园里，没有一朵红玫瑰。", en: "but in all my garden there is no red rose.", s: 17.45, e: 20.69 },
  { id: "S06", zh: "夜莺听见哭声：终于，让我遇见一个真正的爱人。", en: "Here at last is a true lover.", s: 21.15, e: 26.02 },
  { id: "S07", zh: "它相信，人间有值得用生命去换的爱情。", s: 26.48, e: 29.55 },
  { id: "S08", zh: "玫瑰树说：冬天冻僵了我的血脉。", label: "第二章 · 以生命为价", s: 29.71, e: 32.57 },
  { id: "S09", zh: "想要红玫瑰，只有用歌声造出它，再用心口的血染红它。", s: 32.73, e: 37.22 },
  { id: "S10", zh: "为一朵红玫瑰付出生命，代价太大了。", en: "Death is a great price to pay for a red rose.", s: 37.38, e: 41.34 },
  { id: "S11", zh: "可是爱，比生命更好。", en: "Yet Love is better than Life.", s: 41.80, e: 43.96 },
  { id: "S12", zh: "它把胸口抵上尖刺。刺越进越深，歌声越来越亮。", label: "第三章 · 刺与血", s: 44.42, e: 48.69 },
  { id: "S13", zh: "痛，是苦的。", s: 48.85, e: 50.70 },
  { id: "S14", zh: "白玫瑰一滴一滴被染红，花心像一枚红宝石。", s: 51.16, e: 54.68 },
  { id: "S15", zh: "黎明时，它开成东方天际的朝霞。", en: "And the marvellous rose became crimson, like the rose of the eastern sky.", label: "第四章 · 红玫瑰", s: 54.84, e: 57.99 },
  { id: "S16", zh: "而夜莺，躺在草丛里，心口还插着那根刺。", s: 58.45, e: 62.24 },
  { id: "S17", zh: "学生捧着玫瑰赴舞会。少女说：我怕它配不上我的裙子。", label: "第五章 · 被拒绝的玫瑰", s: 62.40, e: 66.96 },
  { id: "S18", zh: "内侍官的侄子送我真正的宝石，宝石比花贵重得多。", en: "everybody knows that jewels cost far more than flowers.", s: 67.12, e: 71.51 },
  { id: "S19", zh: "学生把玫瑰，扔进了街边的水沟。", s: 71.97, e: 74.80 },
  { id: "S20", zh: "一辆马车的车轮，从它上面碾了过去。", en: "and a cart-wheel went over it.", label: "第六章 · 车轮与哲学书", s: 74.96, e: 77.89 },
  { id: "S21", zh: "他回家翻开哲学书：爱，是一件多么愚蠢的事。", en: "What a silly thing Love is.", s: 78.35, e: 81.98 },
  { id: "S22", zh: "花园里的白玫瑰还在开，只是再没有一只鸟为它唱一整夜。", label: "终章", s: 82.44, e: 86.68 },
  { id: "S23", zh: "一朵玫瑰的代价，是一场没有人记得的祭奠。", s: 86.84, e: 90.23 }
];

/* ---------- 2. 渲染文案列表 #scriptList ---------- */
const fmt = t => {
  const m = Math.floor(t / 60), s = Math.round(t % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
};

const scriptList = document.getElementById("scriptList");
if (scriptList) {
  scriptList.innerHTML = SCRIPT.map(l => {
    const cls = l.en ? ' class="quote" data-fx="q"' : "";
    const lab = l.label ? '<span class="lab">' + l.label + "</span>" : "";
    const en  = l.en ? '<span class="qen"><span class="mk"></span><span class="qt">“' + l.en + '”</span></span>' : "";
    const dur = '<span class="dur">' + fmt(l.s) + " – " + fmt(l.e) + "</span>";
    return "<li" + cls + ">" + l.zh + lab + en + dur + "</li>";
  }).join("");
}

/* ---------- 3. 旁白试听 #mp3Grid（单实例播放器） ---------- */
const mp3Grid = document.getElementById("mp3Grid");
if (mp3Grid) {
  mp3Grid.innerHTML = SCRIPT.map((l, i) =>
    '<div class="mp3-item" data-i="' + i + '" title="' + l.zh + '">' +
      '<span class="no">' + l.id + "</span>" +
      '<span class="bar"><i></i></span>' +
      '<span class="tag-play">播放</span>' +
    "</div>"
  ).join("");

  const audio = new Audio();
  let current = null;

  const stopItem = item => {
    item.classList.remove("playing");
    item.querySelector(".tag-play").textContent = "播放";
    item.querySelector(".bar i").style.width = "0%";
  };

  mp3Grid.addEventListener("click", e => {
    const item = e.target.closest(".mp3-item");
    if (!item) return;
    if (current === item) {           // 同一条：播放 / 暂停切换
      audio.paused ? audio.play().catch(function(){}) : audio.pause();
      return;
    }
    if (current) stopItem(current);   // 换一条：先复位旧的
    current = item;
    audio.src = "mp3/" + SCRIPT[+item.dataset.i].id + ".mp3";
    audio.play().catch(function(){});
  });

  audio.addEventListener("play", () => {
    if (!current) return;
    current.classList.add("playing");
    current.querySelector(".tag-play").textContent = "暂停";
  });
  audio.addEventListener("pause", () => {
    if (current) current.querySelector(".tag-play").textContent = "播放";
  });
  audio.addEventListener("ended", () => {
    if (current) { stopItem(current); current = null; }
  });
  audio.addEventListener("timeupdate", () => {
    if (!current) return;
    const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    current.querySelector(".bar i").style.width = p + "%";
  });
}

/* ---------- 4. 顶部滚动进度条 + 导航高亮 ---------- */
const progress = document.getElementById("progress");
const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
const sections = navLinks.map(a => document.querySelector(a.getAttribute("href")));
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const st = window.scrollY || document.documentElement.scrollTop;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (dh > 0 ? (st / dh) * 100 : 0) + "%";

    let idx = -1;   // 取最后一个 top 已越过视口 1/3 的 section
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.35) idx = i;
    });
    navLinks.forEach((a, i) => a.classList.toggle("on", i === idx));
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- 5. 差异化入场：只编排 [data-fx] 元素 ---------- */
/* head=F+B 章节头 / hero=E 主标题 / curtain=E 主旨 / quote=C 引用 / q=C 台词引用 */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add("in");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.2, rootMargin: "0px 0px -4% 0px" });
document.querySelectorAll("[data-fx]").forEach(el => io.observe(el));

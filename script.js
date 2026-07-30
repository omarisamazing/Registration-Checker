// Fallback dataset (Embedded directly to work even without a web server)
const noticeData = {
  incourse_1: [
    "22222051950", "22222051964", "22222051980", "22222051986", "22222051987", "22222051997", "22222051999",
    "22222052007", "22222052011", "22222052027", "22222052038", "22222052052", "22222052061", "22222052080",
    "22222052085", "22222052096", "22222052106", "22222052117", "22222052141", "22222052152", "22222052161",
    "22222052172", "22222052177", "22222052208", "22222052215", "22222052229", "22222052248", "22222052253",
    "22222052267", "22222052283", "22222052285", "22222052294", "22222052305", "22222052306",
    "21222051731", "21222051781", "21222051805", "21222051875", "21222051999", "20222060559"
  ],
  incourse_2: [
    "22222051950", "22222051980", "22222051985", "22222051997", "22222051999", "22222052007", "22222052011",
    "22222052027", "22222052038", "22222052042", "22222052046", "22222052052", "22222052106", "22222052117",
    "22222052141", "22222052152", "22222052161", "22222052172", "22222052174", "22222052177", "22222052208",
    "22222052209", "22222052215", "22222052229", "22222052253", "22222052267", "22222052283", "22222052285",
    "22222052294", "22222052300", "22222052306",
    "21222051731", "21222051781", "21222051805", "21222051999", "20222060559"
  ]
};

// Convert digits to Bangla
function toBanglaNumerals(str) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/\d/g, d => bnDigits[d]);
}

// Convert Bangla digits to English
function toEnglishDigits(str) {
  const bnToEnMap = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'};
  return str.replace(/[০-৯]/g, match => bnToEnMap[match]);
}

// Search handler
function handleSearch(event) {
  if (event) event.preventDefault();

  const inputEl = document.getElementById('regInput');
  const resultArea = document.getElementById('resultArea');
  let rawQuery = inputEl.value.trim();

  rawQuery = toEnglishDigits(rawQuery);

  if (!rawQuery || !/^\d{3,11}$/.test(rawQuery)) {
    renderInvalid(resultArea);
    return;
  }

  const matchesInc1 = noticeData.incourse_1.filter(num => num.endsWith(rawQuery) || num === rawQuery);
  const matchesInc2 = noticeData.incourse_2.filter(num => num.endsWith(rawQuery) || num === rawQuery);

  if (matchesInc1.length > 0 || matchesInc2.length > 0) {
    renderFound(resultArea, rawQuery, matchesInc1, matchesInc2);
  } else {
    renderNotFound(resultArea, rawQuery);
  }
}

function renderFound(container, query, inc1Matches, inc2Matches) {
  let examTags = [];
  if (inc1Matches.length > 0) examTags.push('<span class="detail-tag">১ম ইনকোর্স পরীক্ষা</span>');
  if (inc2Matches.length > 0) examTags.push('<span class="detail-tag">২য় ইনকোর্স পরীক্ষা</span>');

  const allMatchedNumbers = [...new Set([...inc1Matches, ...inc2Matches])];

  container.innerHTML = `
    <div class="result-card" role="region" aria-label="অনুসন্ধান ফলাফল: পাওয়া গেছে">
      <div class="result-status found">
        <span class="status-icon">✓</span>
        <span>পাওয়া গেছে</span>
      </div>
      <p class="result-msg">আপনার রেজিস্ট্রেশন নম্বর (<strong>${toBanglaNumerals(query)}</strong>) প্রকাশিত তালিকায় রয়েছে।</p>
      
      <div class="result-details">
        <p><strong>পরীক্ষার নাম:</strong> ${examTags.join(' ')}</p>
        <p style="margin-top:0.5rem;"><strong>রেজিস্ট্রেশন নম্বর (পূর্ণাঙ্গ):</strong> <span class="mono">${allMatchedNumbers.map(n => toBanglaNumerals(n)).join(', ')}</span></p>
        <p style="margin-top:0.5rem;"><strong>পরীক্ষার সময়সূচী:</strong> ০৩.০৮.২০২৬ (সোমবার) সকাল ১০:০০ টা</p>
      </div>
    </div>
  `;
}

function renderNotFound(container, query) {
  container.innerHTML = `
    <div class="result-card" role="region" aria-label="অনুসন্ধান ফলাফল: পাওয়া যায়নি">
      <div class="result-status not-found">
        <span class="status-icon">✕</span>
        <span>পাওয়া যায়নি</span>
      </div>
      <p class="result-msg">প্রদত্ত রেজিস্ট্রেশন নম্বর (<strong class="mono">${toBanglaNumerals(query)}</strong>) তালিকায় পাওয়া যায়নি। আবার চেষ্টা করুন।</p>
      <div class="result-details">
        <p>অনুগ্রহ করে আপনার প্রবেশপত্র বা রেজিস্ট্রেশন কার্ড থেকে সঠিক সংখ্যাটি নিশ্চিত করুন।</p>
      </div>
    </div>
  `;
}

function renderInvalid(container) {
  container.innerHTML = `
    <div class="result-card" role="region" aria-label="অনুসন্ধান ফলাফল: অবৈধ নম্বর">
      <div class="result-status invalid">
        <span class="status-icon">!</span>
        <span>অবৈধ ইনপুট</span>
      </div>
      <p class="result-msg">অনুগ্রহ করে একটি বৈধ রেজিস্ট্রেশন নম্বর লিখুন।</p>
      <div class="result-details">
        <p>শুধুমাত্র সংখ্যা ব্যবহার করুন (যেমন: 22222051950 বা 1950)। কোন স্পেস বা চিহ্ন দিবেন না।</p>
      </div>
    </div>
  `;
}

function initTheme() {
  const savedTheme = localStorage.getItem('registration-checker-theme');
  const theme = savedTheme || 'dark';

  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    const icon = toggle.querySelector('.theme-toggle__icon');
    const label = toggle.querySelector('.theme-toggle__label');
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
    if (label) label.textContent = theme === 'dark' ? 'লাইট' : 'ডার্ক';
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
}

function bindThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('registration-checker-theme', nextTheme);
    const icon = toggle.querySelector('.theme-toggle__icon');
    const label = toggle.querySelector('.theme-toggle__label');
    if (icon) icon.textContent = nextTheme === 'dark' ? '☀' : '☾';
    if (label) label.textContent = nextTheme === 'dark' ? 'লাইট' : 'ডার্ক';
    toggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  });
}

// Instant Live Search
document.getElementById('regInput').addEventListener('input', function(e) {
  const val = e.target.value.trim();
  if (val.length >= 4) {
    handleSearch(null);
  } else if (val.length === 0) {
    document.getElementById('resultArea').innerHTML = '';
  }
});

initTheme();
bindThemeToggle();

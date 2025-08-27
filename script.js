// DOM 요소들
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.querySelector(".main-content");

// 사이드바 상태 관리
let sidebarCollapsed = false;
let isMobile = false;

// 초기화
function init() {
  checkScreenSize();
  setupEventListeners();
  setupResizeObserver();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 메뉴 버튼 클릭 이벤트
  menuBtn.addEventListener("click", toggleSidebar);

  // 모바일에서 사이드바 외부 클릭 시 닫기
  document.addEventListener("click", handleOutsideClick);

  // ESC 키로 사이드바 닫기
  document.addEventListener("keydown", handleKeydown);
}

// 화면 크기 체크
function checkScreenSize() {
  isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // 모바일에서는 사이드바를 기본적으로 숨김
    sidebar.classList.remove("collapsed");
    sidebar.classList.remove("open");
    mainContent.classList.remove("expanded");
    mainContent.style.marginLeft = "0";
  } else {
    // 데스크톱에서는 사이드바를 기본적으로 표시
    sidebar.classList.remove("open");
    mainContent.classList.remove("expanded");
    mainContent.style.marginLeft = "240px";
  }
}

// 사이드바 토글
function toggleSidebar() {
  if (isMobile) {
    // 모바일에서는 사이드바를 열고 닫기
    if (sidebar.classList.contains("open")) {
      collapseSidebar();
      removeOverlay();
    } else if (sidebar.classList.contains("collapsed")) {
      expandSidebar();
    } else {
      openSidebar();
    }
  } else {
    // 데스크톱에서는 사이드바를 축소하고 확장
    if (sidebarCollapsed) {
      expandSidebar();
    } else {
      collapseSidebar();
      console.log("collapsed");
    }
  }
}

// 모바일에서 사이드바 열기
function openSidebar() {
  sidebar.classList.add("open");
  createOverlay();
}

// 모바일에서 사이드바 닫기
function closeSidebar() {
  sidebar.classList.add("closing");
  removeOverlay();

  setTimeout(() => {
    sidebar.classList.remove("open", "closing");
  }, 300);
}

// 데스크톱에서 사이드바 축소
function collapseSidebar() {
  console.log("축소");
  sidebar.classList.add("collapsed");
  mainContent.classList.add("expanded");
  mainContent.style.marginLeft = "52px";
  sidebarCollapsed = true;

  // collapsed-nav-section 영역을 숨김
  const collapsedNavSections = sidebar.querySelectorAll(
    ".collapsed-nav-section"
  );
  collapsedNavSections.forEach((section) => {
    section.style.display = "none";
  });
}

// 데스크톱에서 사이드바 확장
function expandSidebar() {
  console.log("확장");
  sidebar.classList.remove("collapsed");
  mainContent.classList.remove("expanded");
  mainContent.style.marginLeft = "240px";
  sidebarCollapsed = false;

  // collapsed-nav-section 영역을 다시 표시
  const collapsedNavSections = sidebar.querySelectorAll(
    ".collapsed-nav-section"
  );
  collapsedNavSections.forEach((section) => {
    section.style.display = "block";
  });
}

// 오버레이 생성 (모바일용)
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay open";
  overlay.addEventListener("click", closeSidebar);
  document.body.appendChild(overlay);
}

// 오버레이 제거
function removeOverlay() {
  const overlay = document.querySelector(".sidebar-overlay");
  if (overlay) {
    overlay.remove();
  }
}

// 외부 클릭 처리
function handleOutsideClick(event) {
  if (isMobile && sidebar.classList.contains("open")) {
    if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
      closeSidebar();
    }
  }
}

// 키보드 이벤트 처리
function handleKeydown(event) {
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebar();
  }
}

// 리사이즈 옵저버 설정
function setupResizeObserver() {
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const newWidth = entry.contentRect.width;
      const wasMobile = isMobile;

      checkScreenSize();

      // 모바일/데스크톱 전환 시 사이드바 상태 초기화
      if (wasMobile !== isMobile) {
        if (isMobile) {
          // 모바일로 전환
          sidebar.classList.remove("collapsed");
          mainContent.classList.remove("expanded");
          mainContent.style.marginLeft = "0";
          removeOverlay();
        } else {
          // 데스크톱으로 전환
          sidebar.classList.remove("open");
          mainContent.style.marginLeft = sidebarCollapsed ? "0" : "240px";
          removeOverlay();
        }
      }
    }
  });

  resizeObserver.observe(document.body);
}

// 윈도우 리사이즈 이벤트 (폴백)
window.addEventListener("resize", () => {
  checkScreenSize();
});

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", init);

// 추가 기능: 비디오 카드 클릭 이벤트
document.addEventListener("DOMContentLoaded", () => {
  const videoCards = document.querySelectorAll(".video-card");

  videoCards.forEach((card) => {
    card.addEventListener("click", () => {
      // 비디오 클릭 시 동작 (예: 모달 열기, 페이지 이동 등)
      console.log(
        "비디오 클릭됨:",
        card.querySelector(".video-title").textContent
      );
    });
  });
});

// 추가 기능: 검색 기능
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      console.log("검색 쿼리:", query);
      // 여기에 실제 검색 로직을 구현할 수 있습니다
    }
  }

  searchBtn.addEventListener("click", performSearch);

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });
});

// 추가 기능: 스크롤 시 헤더 그림자 효과
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 0) {
    header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "none";
  }
});

// 추가 기능: 사이드바 스크롤 위치 기억
let sidebarScrollPosition = 0;

sidebar.addEventListener("scroll", () => {
  sidebarScrollPosition = sidebar.scrollTop;
});

// 페이지 포커스 시 스크롤 위치 복원
window.addEventListener("focus", () => {
  if (sidebarScrollPosition > 0) {
    sidebar.scrollTop = sidebarScrollPosition;
  }
});

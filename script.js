// DOM 요소들
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.querySelector(".main-content");
const miniPlayerBox = document.querySelector('.mini-player-box');
const miniPlayerIframe = document.querySelector('.mini-player-iframe');

// 사이드바 상태 관리
let sidebarCollapsed = false;
let isMobile = false;

// 초기화
function init() {
    checkScreenSize();
    setupEventListeners();
    setupResizeObserver();
    setupVideoPlayer(); // 비디오 플레이어 초기화 함수 추가
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 메뉴 버튼 클릭 이벤트
    if (menuBtn) {
        menuBtn.addEventListener("click", toggleSidebar);
    }

    // 모바일에서 사이드바 외부 클릭 시 닫기
    document.addEventListener("click", handleOutsideClick);

    // ESC 키로 사이드바 닫기
    document.addEventListener("keydown", handleKeydown);
}

// 화면 크기 체크
function checkScreenSize() {
    isMobile = window.innerWidth <= 768;

    if (isMobile) {
        sidebar.classList.remove("collapsed");
        sidebar.classList.remove("open");
        mainContent.classList.remove("expanded");
        mainContent.style.marginLeft = "0";
    } else {
        sidebar.classList.remove("open");
        if (sidebarCollapsed) {
            mainContent.classList.add("expanded");
        } else {
            mainContent.classList.remove("expanded");
            mainContent.style.marginLeft = "240px";
        }
    }
}

// 사이드바 토글
function toggleSidebar() {
    if (isMobile) {
        if (sidebar.classList.contains("open")) {
            collapseSidebar();
            removeOverlay();
        } else if (sidebar.classList.contains("collapsed")) {
            expandSidebar();
        } else {
            openSidebar();
        }
    } else {
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
    mainContent.style.marginLeft = "75px";
    sidebarCollapsed = true;

    const collapsedNavSections = sidebar.querySelectorAll(".collapsed-nav-section");
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

    const collapsedNavSections = sidebar.querySelectorAll(".collapsed-nav-section");
    collapsedNavSections.forEach((section) => {
        section.style.display = "block";
    });
}

// 오버레이 생성 (모바일용)
function createOverlay() {
    const collapsedNavSections = sidebar.querySelectorAll(".collapsed-nav-section");
    collapsedNavSections.forEach((section) => {
        section.style.display = "block";
    });
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

            if (wasMobile !== isMobile) {
                if (isMobile) {
                    sidebar.classList.remove("collapsed");
                    mainContent.classList.remove("expanded");
                    mainContent.style.marginLeft = "0";
                    removeOverlay();
                } else {
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

// 추가 기능: 비디오 카드 클릭 이벤트 및 중복 플레이 방지
document.addEventListener('DOMContentLoaded', () => {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');

    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const iframe = thumbnail.querySelector('iframe');
            const src = iframe.getAttribute('data-src');

            const isPlaying = thumbnail.classList.contains('is-playing');

            // 다른 모든 비디오를 멈추고 썸네일로 되돌립니다.
            videoThumbnails.forEach(otherThumbnail => {
                if (otherThumbnail !== thumbnail) {
                    otherThumbnail.classList.remove('is-playing');
                    const otherIframe = otherThumbnail.querySelector('iframe');
                    if (otherIframe) {
                        otherIframe.src = '';
                    }
                }
            });

            // 클릭된 비디오를 재생하거나 멈춥니다.
            if (!isPlaying) {
                iframe.src = src + '?autoplay=1';
                thumbnail.classList.add('is-playing');
            } else {
                iframe.src = '';
                thumbnail.classList.remove('is-playing');
            }
        });
    });
});
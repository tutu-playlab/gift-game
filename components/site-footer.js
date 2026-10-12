(() => {
  const componentScript = document.currentScript;
  const componentUrl = componentScript ? new URL(componentScript.src) : null;
  const stylesheetUrl = componentUrl
    ? new URL(`site-footer.css${componentUrl.search}`, componentUrl).href
    : "components/site-footer.css";

  if (!document.querySelector("link[data-site-footer-styles]")) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = stylesheetUrl;
    stylesheet.dataset.siteFooterStyles = "";
    document.head.append(stylesheet);
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;

      const currentPage = this.getAttribute("current-page");
      const links = [
        { key: "game", label: "遊戲首頁", href: "/gift-game/" },
        {
          key: "articles",
          label: "送禮研究所",
          href: "/gift-game/articles/practical-gift-mistakes/",
        },
        { key: "about", label: "關於我們", href: "/#about" },
        { key: "privacy", label: "隱私權政策", href: "/privacy/" },
      ];

      const linkMarkup = links
        .map(({ key, label, href }, index) => {
          const currentAttribute = currentPage === key ? ' aria-current="page"' : "";
          const separator = index > 0 ? '<span class="site-footer-separator" aria-hidden="true">|</span>' : "";
          return `${separator}<a href="${href}"${currentAttribute}>${label}</a>`;
        })
        .join("");

      this.innerHTML = `
        <footer class="site-footer">
          <nav class="site-footer-links" aria-label="頁尾導覽">
            ${linkMarkup}
          </nav>
          <p class="site-footer-note">
            本測驗僅供娛樂參考，現實生活裡每個人都是獨一無二的，送禮沒有正確解答。推薦拿本遊戲的禮物選項跟你的另一半對答案。但本製作團隊不保證你的感情安全。ヾ(´ε&#96;ヾ)
          </p>
          <p class="site-footer-copyright">© 2026《送禮大作戰》製作團隊 ALL RIGHTS RESERVED.</p>
        </footer>
      `;

      this.dataset.rendered = "true";
    }
  }

  if (!customElements.get("site-footer")) {
    customElements.define("site-footer", SiteFooter);
  }
})();

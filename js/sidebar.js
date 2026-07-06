/**
 * XML Tools — sidebar.js
 * Injects a fixed dynamic sidebar for XML Tools utilities
 * Theme: Clean, developer-focused, tech-oriented aesthetic
 */

(function () {
  // 1. Array of all XML tools based on the actual website structure
  const toolsList = [
    // Formatting & Beautification
    { name: "XML Formatter", icon: "✨", url: "/xml-formatter", desc: "Add indentation and structure for readability." },
    { name: "XML Minifier", icon: "📦", url: "/xml-minifier", desc: "Strip whitespace for compact XML files." },
    { name: "XML Beautifier", icon: "🎨", url: "/xml-beautifier", desc: "Enhance readability with formatting tweaks." },

    // Validation & Testing
    { name: "XML Validator", icon: "✅", url: "/xml-validator", desc: "Check syntax and ensure well-formed XML." },
    { name: "XML Schema Validator", icon: "📋", url: "/xml-schema-validator", desc: "Validate against an XSD schema." },
    { name: "XPath Tester", icon: "🔍", url: "/xpath-tester", desc: "Run and debug XPath queries." },

    // Conversion Utilities
    { name: "XML to JSON", icon: "🔄", url: "/xml-to-json", desc: "Convert XML data to JSON objects." },
    { name: "JSON to XML", icon: "🔄", url: "/json-to-xml", desc: "Transform JSON back to XML." },
    { name: "XML to CSV", icon: "📊", url: "/xml-to-csv", desc: "Export XML as comma-separated values." },
    { name: "CSV to XML", icon: "📊", url: "/csv-to-xml", desc: "Convert CSV data into XML structure." },
    { name: "XML to YAML", icon: "📄", url: "/xml-to-yaml", desc: "Convert XML to YAML format." },
    { name: "YAML to XML", icon: "📄", url: "/yaml-to-xml", desc: "Transform YAML back to XML." },
    { name: "XML to HTML", icon: "🌐", url: "/xml-to-html", desc: "Render XML as an HTML table." },

    // Transformation & Manipulation
    { name: "XSLT Transformer", icon: "⚙️", url: "/xslt-transformer", desc: "Apply XSLT stylesheets to XML." },
    { name: "XML Diff", icon: "🔀", url: "/xml-diff", desc: "Highlight differences between two XML files." },
    { name: "XML Escape", icon: "🔐", url: "/xml-escape", desc: "Escape special characters for safe embedding." },
    { name: "XML Unescape", icon: "🔓", url: "/xml-unescape", desc: "Restore escaped characters." },
    { name: "XML Sorter", icon: "🔢", url: "/xml-sorter", desc: "Order elements alphabetically." },
    { name: "XML Merger", icon: "📑", url: "/xml-merger", desc: "Combine multiple XML files." },
    { name: "XML Splitter", icon: "✂️", url: "/xml-splitter", desc: "Break large XML into smaller files." },

    // Viewing & Editing
    { name: "XML Viewer", icon: "👁️", url: "/xml-viewer", desc: "Display XML in a collapsible tree view." },
    { name: "XML Editor", icon: "✏️", url: "/xml-editor", desc: "Edit XML with syntax highlighting." },
    { name: "XML Parser", icon: "🧩", url: "/xml-parser", desc: "Extract specific data from XML." },
    { name: "XML Generator", icon: "⚡", url: "/xml-generator", desc: "Create sample XML for testing." },

    // Site Information
    { name: "All Tools", icon: "📚", url: "/alltools", desc: "View the complete list of XML utilities." },
    { name: "Blog", icon: "📝", url: "/blog", desc: "Read articles and tutorials about XML." },
    { name: "About", icon: "ℹ️", url: "/about", desc: "Learn more about XML Tools." },
    { name: "Contact", icon: "✉️", url: "/contact", desc: "Get in touch with the developer." },
    { name: "Privacy Policy", icon: "🔒", url: "/privacy", desc: "Understand our data handling practices." },
    { name: "Terms of Service", icon: "⚖️", url: "/terms", desc: "Read the terms and conditions." }
  ];

  // 2. Inject CSS Styles with XML Tools tech theme
  const cssStyles = `
    /* Floating Launch Trigger Button */
    .tools-floating-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 52px;
      height: 52px;
      background: #1e293b;
      color: #f8fafc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      cursor: pointer;
      border: 1px solid #334155;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease, color 0.2s ease;
    }
    body.dark .tools-floating-trigger {
      background: #0f172a;
      color: #38bdf8;
    }
    .tools-floating-trigger:hover {
      transform: scale(1.08) rotate(15deg);
      background: #2563eb;
      color: #ffffff;
    }
    .tools-floating-trigger.active {
      transform: scale(0.9) rotate(-90deg);
      background: #e2e8f0;
      color: #0f172a;
    }

    /* Fixed Sidebar Layout Container */
    .tools-fixed-sidebar {
      position: fixed;
      top: 0;
      right: -360px;
      width: 340px;
      height: 100vh;
      background: #f8fafc;
      border-left: 1px solid #e2e8f0;
      box-shadow: -8px 0 24px rgba(0,0,0,0.1);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    body.dark .tools-fixed-sidebar {
      background: #0f172a;
      border-left-color: #1e293b;
    }
    .tools-fixed-sidebar.open {
      right: 0;
    }

    /* Dimmed Background Backdrop Overlay */
    .tools-sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .tools-sidebar-overlay.visible {
      opacity: 1;
      pointer-events: auto;
    }

    /* Sidebar Header Details */
    .tools-sb-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      flex-shrink: 0;
    }
    body.dark .tools-sb-header {
      background: #1e293b;
      border-bottom-color: #334155;
    }
    .tools-sb-header h2 {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    body.dark .tools-sb-header h2 {
      color: #f8fafc;
    }
    .tools-sb-header h2 em {
      font-style: italic;
      color: #2563eb;
    }
    body.dark .tools-sb-header h2 em {
      color: #38bdf8;
    }
    .tools-sb-close {
      width: 32px;
      height: 32px;
      font-size: 1rem;
      color: #64748b;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: none;
      border: none;
    }
    .tools-sb-close:hover {
      color: #0f172a;
      background: #e2e8f0;
    }
    body.dark .tools-sb-close:hover {
      color: #f8fafc;
      background: #334155;
    }

    /* Scrollable items menu wrapper */
    .tools-sb-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Single Tool Items Card Styling & Animation */
    .tools-sb-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: transparent;
      transition: all 0.2s ease;
      opacity: 0;
      transform: translateX(20px);
      text-decoration: none;
      cursor: pointer;
    }
    .tools-fixed-sidebar.open .tools-sb-item {
      animation: slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .tools-sb-item:hover {
      background: #f1f5f9;
      border-color: #e2e8f0;
      transform: translateY(-2px);
    }
    body.dark .tools-sb-item:hover {
      background: #1e293b;
      border-color: #334155;
    }
    .tools-sb-item-icon {
      font-size: 1.1rem;
      width: 32px;
      height: 32px;
      background: #f1f5f9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e2e8f0;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }
    body.dark .tools-sb-item-icon {
      background: #1e293b;
      border-color: #334155;
    }
    .tools-sb-item:hover .tools-sb-item-icon {
      background: #dbeafe;
    }
    body.dark .tools-sb-item:hover .tools-sb-item-icon {
      background: #1e3a5f;
    }
    .tools-sb-item-details {
      flex: 1;
      min-width: 0;
    }
    .tools-sb-item-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 2px;
    }
    body.dark .tools-sb-item-name {
      color: #f8fafc;
    }
    .tools-sb-item-desc {
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.3;
    }
    body.dark .tools-sb-item-desc {
      color: #94a3b8;
    }

    /* Category Separator */
    .tools-sb-category {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      padding: 12px 8px 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      margin-top: 4px;
    }
    body.dark .tools-sb-category {
      color: #64748b;
      border-bottom-color: #1e293b;
    }
    .tools-sb-category:first-of-type {
      margin-top: 0;
    }

    /* Keyframe Animations */
    @keyframes slideInItem {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Scrollbar styling */
    .tools-sb-body::-webkit-scrollbar {
      width: 4px;
    }
    .tools-sb-body::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    body.dark .tools-sb-body::-webkit-scrollbar-track {
      background: #1e293b;
    }
    .tools-sb-body::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    body.dark .tools-sb-body::-webkit-scrollbar-thumb {
      background: #334155;
    }
    .tools-sb-body::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;

  // 3. Inject styles into document head
  const styleEl = document.createElement("style");
  styleEl.textContent = cssStyles;
  document.head.appendChild(styleEl);

  // 4. Generate the complete DOM structural markup dynamically
  const rootContainer = document.getElementById("tools-sidebar-root");
  if (!rootContainer) return;

  // Render the floating toggle switch, backdrop container, and sidebar dashboard
  rootContainer.innerHTML = `
    <div class="tools-sidebar-overlay" id="toolsSidebarOverlay"></div>
    <div class="tools-floating-trigger" id="toolsSidebarTrigger" title="Explore XML Tools" aria-label="Toggle XML Tools sidebar">👨‍💻</div>
    <aside class="tools-fixed-sidebar" id="toolsFixedSidebar" aria-label="XML Tools Sidebar">
      <div class="tools-sb-header">
        <h2>XML <em>Tools</em></h2>
        <button class="tools-sb-close" id="toolsSidebarClose" aria-label="Close toolkit">✕</button>
      </div>
      <div class="tools-sb-body" id="toolsSidebarBody"></div>
    </aside>
  `;

  const sidebarBody = document.getElementById("toolsSidebarBody");
  const sidebar = document.getElementById("toolsFixedSidebar");
  const trigger = document.getElementById("toolsSidebarTrigger");
  const overlay = document.getElementById("toolsSidebarOverlay");
  const closeBtn = document.getElementById("toolsSidebarClose");

  // Helper to add category headers
  function addCategory(title) {
    const catDiv = document.createElement("div");
    catDiv.className = "tools-sb-category";
    catDiv.textContent = title;
    sidebarBody.appendChild(catDiv);
  }

  // Categorized tool lists for better UX
  const categories = {
    "Formatting & Beautification": toolsList.slice(0, 3),
    "Validation & Testing": toolsList.slice(3, 6),
    "Conversion Utilities": toolsList.slice(6, 13),
    "Transformation & Manipulation": toolsList.slice(13, 20),
    "Viewing & Editing": toolsList.slice(20, 24),
    "Site Information": toolsList.slice(24, 29)
  };

  // Populate list items with categories
  for (const [category, tools] of Object.entries(categories)) {
    addCategory(category);
    tools.forEach((tool, idx) => {
      const itemA = document.createElement("a");
      itemA.href = tool.url;
      itemA.className = "tools-sb-item";
      // Global delay based on overall index for smooth animation
      const globalIdx = toolsList.indexOf(tool);
      itemA.style.animationDelay = `${globalIdx * 0.025}s`;

      itemA.innerHTML = `
        <div class="tools-sb-item-icon">${tool.icon}</div>
        <div class="tools-sb-item-details">
          <div class="tools-sb-item-name">${tool.name}</div>
          <div class="tools-sb-item-desc">${tool.desc}</div>
        </div>
      `;
      sidebarBody.appendChild(itemA);
    });
  }

  // 5. Active Structural Interface Controls and Handlers
  function toggleSidebar() {
    const isOpen = sidebar.classList.toggle("open");
    trigger.classList.toggle("active", isOpen);
    overlay.classList.toggle("visible", isOpen);
    trigger.innerHTML = isOpen ? "✕" : "👨‍💻";
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    trigger.classList.remove("active");
    overlay.classList.remove("visible");
    trigger.innerHTML = "👨‍💻";
  }

  // Bind Listeners
  trigger.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", closeSidebar);
  closeBtn.addEventListener("click", closeSidebar);

  // Close interface gracefully via the Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });
})();

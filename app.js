// Fetch and inject modular HTML components
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath)
    const html = await response.text()
    const element = document.getElementById(elementId)
    if (element) {
      element.innerHTML = html
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error)
  }
}

// Initialize all components
async function initializeComponents() {
  await Promise.all([
    loadComponent("header-container", "header.html"),
    loadComponent("footer-container", "footer.html"),
    loadComponent("sidebar-container", "sidebar.html"),
    loadComponent("alltools-container", "alltools.html"),
  ])

  // Initialize event listeners after components are loaded
  initializeEventListeners()
}

// Event Listeners
function initializeEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const nav = document.querySelector(".nav")

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.style.display = nav.style.display === "flex" ? "none" : "flex"
      nav.style.position = "absolute"
      nav.style.top = "100%"
      nav.style.left = "0"
      nav.style.right = "0"
      nav.style.background = "var(--black)"
      nav.style.flexDirection = "column"
      nav.style.padding = "var(--spacing-md)"
      nav.style.borderTop = "3px solid var(--yellow)"
    })
  }

  // Category filter
  const categoryTags = document.querySelectorAll(".category-tag")
  const toolCards = document.querySelectorAll(".tool-card")

  categoryTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const category = tag.dataset.category

      // Toggle active state
      categoryTags.forEach((t) => (t.style.transform = "scale(1)"))
      tag.style.transform = "scale(1.1)"

      // Filter tools (basic implementation - can be enhanced)
      toolCards.forEach((card) => {
        card.style.display = "block"
        card.style.animation = "cardAppear 0.6s ease-out"
      })
    })
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Tool card hover effects with color dynamics
  toolCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const color = card.dataset.color
      const colorMap = {
        blue: "#0066FF",
        green: "#00CC66",
        purple: "#9933FF",
        pink: "#FF3399",
        red: "#FF3333",
        yellow: "#FFCC00",
      }

      if (colorMap[color]) {
        card.style.backgroundColor = colorMap[color] + "10"
      }
    })

    card.addEventListener("mouseleave", () => {
      card.style.backgroundColor = ""
    })
  })

  // Add intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe tool cards for scroll animation
  toolCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })
}

// Search functionality (can be enhanced)
function initializeSearch() {
  const searchInput = document.createElement("input")
  searchInput.type = "search"
  searchInput.placeholder = "Search tools..."
  searchInput.className = "search-input"

  const hero = document.querySelector(".hero")
  if (hero) {
    hero.appendChild(searchInput)
  }

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const toolCards = document.querySelectorAll(".tool-card")

    toolCards.forEach((card) => {
      const title = card.querySelector(".tool-title").textContent.toLowerCase()
      const description = card.querySelector(".tool-description").textContent.toLowerCase()

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  })
}

// Initialize on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeComponents)
} else {
  initializeComponents()
}

// Dynamic year for copyright
function updateCopyrightYear() {
  const copyrightElement = document.querySelector(".copyright")
  if (copyrightElement) {
    const currentYear = new Date().getFullYear()
    copyrightElement.textContent = `© ${currentYear} XML TOOLS. ALL RIGHTS RESERVED.`
  }
}

// Update copyright year after components load
setTimeout(updateCopyrightYear, 500)

// Performance optimization: Lazy load images
if ("loading" in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]')
  images.forEach((img) => {
    img.src = img.dataset.src
  })
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement("script")
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js"
  document.body.appendChild(script)
}

// Console message for developers
console.log("%c⚡ XML TOOLS", "font-size: 24px; font-weight: bold; color: #0066FF;")
console.log("%cBuilt with brutalist design principles", "font-size: 14px; color: #666;")
console.log("%cContribute: https://github.com/xmltools", "font-size: 12px; color: #00CC66;")

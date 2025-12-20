// XML Diff Tool Logic
;(() => {
  const xmlInput1 = document.getElementById("xml-input-1")
  const xmlInput2 = document.getElementById("xml-input-2")
  const compareBtn = document.getElementById("compare-btn")
  const clearBtn = document.getElementById("clear-btn")
  const diffOutput = document.getElementById("diff-results")
  const diffContainer = document.getElementById("diff-output-container")
  const errorMessage = document.getElementById("error-message")

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#ffe6e6"
    errorMessage.style.color = "#ff3333"
    diffContainer.style.display = "none"
    setTimeout(() => { errorMessage.style.display = "none" }, 5000)
  }

  function simpleDiff(text1, text2) {
    const lines1 = text1.split(/\r?\n/)
    const lines2 = text2.split(/\r?\n/)
    let resultHtml = ""

    const maxLength = Math.max(lines1.length, lines2.length)

    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] || ""
      const line2 = lines2[i] || ""

      if (line1 === line2) {
        resultHtml += `<div>  ${escapeHtml(line1)}</div>`
      } else {
        if (i < lines1.length) {
          resultHtml += `<div class="diff-removed">- ${escapeHtml(line1)}</div>`
        }
        if (i < lines2.length) {
          resultHtml += `<div class="diff-added">+ ${escapeHtml(line2)}</div>`
        }
      }
    }
    return resultHtml
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  compareBtn.addEventListener("click", () => {
    const xml1 = xmlInput1.value.trim()
    const xml2 = xmlInput2.value.trim()

    if (!xml1 || !xml2) {
      showError("Please provide both XML inputs to compare.")
      return
    }

    try {
      // Basic validation check
      const parser = new DOMParser()
      if (parser.parseFromString(xml1, "text/xml").querySelector("parsererror") || 
          parser.parseFromString(xml2, "text/xml").querySelector("parsererror")) {
        showError("One of the inputs is not valid XML. However, comparing as plain text...")
      }

      const diffHtml = simpleDiff(xml1, xml2)
      diffOutput.innerHTML = diffHtml
      diffContainer.style.display = "block"
      
      // Scroll to result
      diffContainer.scrollIntoView({ behavior: 'smooth' })
    } catch (error) {
      showError("Comparison failed: " + error.message)
    }
  })

  clearBtn.addEventListener("click", () => {
    xmlInput1.value = ""
    xmlInput2.value = ""
    diffOutput.innerHTML = ""
    diffContainer.style.display = "none"
    errorMessage.style.display = "none"
  })
})()

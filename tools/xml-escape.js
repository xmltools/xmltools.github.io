// XML Escape & Unescape Logic
;(() => {
  const textInput = document.getElementById("text-input")
  const textOutput = document.getElementById("text-output")
  const escapeBtn = document.getElementById("escape-btn")
  const unescapeBtn = document.getElementById("unescape-btn")
  const clearBtn = document.getElementById("clear-btn")
  const copyBtn = document.getElementById("copy-btn")
  const downloadBtn = document.getElementById("download-btn")
  const pasteBtn = document.getElementById("paste-btn")
  const errorMessage = document.getElementById("error-message")

  function escapeXml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }

  function unescapeXml(text) {
    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
  }

  function showError(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#f8d7da"
    errorMessage.style.color = "#721c24"
    errorMessage.style.borderColor = "#f5c6cb"
    setTimeout(() => {
      errorMessage.style.display = "none"
    }, 5000)
  }

  function showSuccess(message) {
    errorMessage.textContent = message
    errorMessage.style.display = "block"
    errorMessage.style.background = "#d4edda"
    errorMessage.style.color = "#155724"
    errorMessage.style.borderColor = "#c3e6cb"
    setTimeout(() => {
      errorMessage.style.display = "none"
    }, 3000)
  }

  escapeBtn.addEventListener("click", () => {
    const input = textInput.value

    if (!input) {
      showError("Please enter text to escape.")
      return
    }

    const escaped = escapeXml(input)
    textOutput.value = escaped
    showSuccess("XML characters escaped successfully!")
  })

  unescapeBtn.addEventListener("click", () => {
    const input = textInput.value

    if (!input) {
      showError("Please enter text to unescape.")
      return
    }

    const unescaped = unescapeXml(input)
    textOutput.value = unescaped
    showSuccess("XML entities unescaped successfully!")
  })

  clearBtn.addEventListener("click", () => {
    textInput.value = ""
    textOutput.value = ""
    errorMessage.style.display = "none"
  })

  copyBtn.addEventListener("click", () => {
    if (!textOutput.value) {
      showError("Nothing to copy. Please process text first.")
      return
    }

    textOutput.select()
    document.execCommand("copy")
    showSuccess("Copied to clipboard!")
  })

  downloadBtn.addEventListener("click", () => {
    if (!textOutput.value) {
      showError("Nothing to download. Please process text first.")
      return
    }

    const blob = new Blob([textOutput.value], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "result.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showSuccess("File downloaded!")
  })

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText()
      textInput.value = text
      showSuccess("Pasted from clipboard!")
    } catch (error) {
      showError("Failed to paste. Please paste manually.")
    }
  })
})()

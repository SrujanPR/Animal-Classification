class WildlifeClassifier {
  constructor() {
    this.initializeElements()
    this.bindEvents()
  }

  initializeElements() {
    this.uploadArea = document.getElementById("uploadArea")
    this.imageInput = document.getElementById("imageInput")
    this.imagePreview = document.getElementById("imagePreview")
    this.previewImg = document.getElementById("previewImg")
    this.removeImageBtn = document.getElementById("removeImage")
    this.uploadForm = document.querySelector(".upload-form")
    this.classifyBtn = document.getElementById("classifyBtn")
    this.btnText = document.querySelector(".btn-text")
    this.btnLoader = document.getElementById("btnLoader")
  }

  bindEvents() {
    // Upload area events
    this.uploadArea.addEventListener("dragover", this.handleDragOver.bind(this))
    this.uploadArea.addEventListener("dragleave", this.handleDragLeave.bind(this))
    this.uploadArea.addEventListener("drop", this.handleDrop.bind(this))

    // File input change
    this.imageInput.addEventListener("change", this.handleFileSelect.bind(this))

    // Remove image
    if (this.removeImageBtn) {
      this.removeImageBtn.addEventListener("click", this.removeImage.bind(this))
    }

    // Form submission
    this.uploadForm.addEventListener("submit", this.handleFormSubmit.bind(this))
  }

  handleDragOver(e) {
    e.preventDefault()
    this.uploadArea.classList.add("dragover")
  }

  handleDragLeave(e) {
    e.preventDefault()
    this.uploadArea.classList.remove("dragover")
  }

  handleDrop(e) {
    e.preventDefault()
    this.uploadArea.classList.remove("dragover")

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      this.imageInput.files = files
      this.handleFileSelect({ target: { files: files } })
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      this.showImagePreview(file)
    }
  }

  showImagePreview(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      this.previewImg.src = e.target.result
      this.uploadArea.style.display = "none"
      this.imagePreview.style.display = "block"
    }
    reader.readAsDataURL(file)
  }

  removeImage() {
    this.imageInput.value = ""
    this.uploadArea.style.display = "block"
    this.imagePreview.style.display = "none"
  }

  handleFormSubmit(e) {
    // Show loading state
    this.uploadForm.classList.add("loading")
    this.btnText.style.display = "none"
    this.btnLoader.style.display = "flex"

    // The form will submit normally to Flask
    // Loading state will be cleared when page reloads
  }
}

// Initialize the classifier when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WildlifeClassifier()
})

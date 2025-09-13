// Contact Form JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusMessage = document.getElementById("statusMessage");


  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message:
        "Name must be 2-50 characters and contain only letters and spaces",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 100,
      message: "Subject must be 5-100 characters",
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: "Message must be 10-1000 characters",
    },
  };

  
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = "block";

    
    setTimeout(() => {
      statusMessage.style.opacity = "1";
      statusMessage.style.transform = "translateY(0)";
    }, 10);

    
    if (type === "success") {
      setTimeout(() => {
        statusMessage.style.opacity = "0";
        statusMessage.style.transform = "translateY(-10px)";
        setTimeout(() => {
          statusMessage.style.display = "none";
        }, 300);
      }, 5000);
    }
  }

  
  function hideStatus() {
    statusMessage.style.display = "none";
    statusMessage.style.opacity = "0";
    statusMessage.style.transform = "translateY(-10px)";
  }

  
  function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true };

    
    if (rules.required && (!value || value.trim() === "")) {
      return {
        isValid: false,
        message: `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`,
      };
    }

    
    if (!value || value.trim() === "") {
      return { isValid: true };
    }

    
    if (rules.minLength && value.length < rules.minLength) {
      return { isValid: false, message: rules.message };
    }

    
    if (rules.maxLength && value.length > rules.maxLength) {
      return { isValid: false, message: rules.message };
    }

    
    if (rules.pattern && !rules.pattern.test(value)) {
      return { isValid: false, message: rules.message };
    }

    return { isValid: true };
  }

  
  function validateForm(formData) {
    const errors = [];

    for (const [fieldName, value] of formData.entries()) {
      const validation = validateField(fieldName, value);
      if (!validation.isValid) {
        errors.push({ field: fieldName, message: validation.message });
      }
    }

    return errors;
  }

  
  function showFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const container =
      field.closest(".input-box") || field.closest(".message-box");
    container.classList.add("error");
  }

  
  function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const container =
      field.closest(".input-box") || field.closest(".message-box");
    container.classList.remove("error");
  }

  
  function clearAllFieldErrors() {
    const errorElements = document.querySelectorAll(
      ".input-box.error, .message-box.error"
    );
    errorElements.forEach((element) => element.classList.remove("error"));
  }

  
  function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, "");
  }

  
  function setupRealTimeValidation() {
    const fields = ["name", "email", "subject", "message"];

    fields.forEach((fieldName) => {
      const field = document.getElementById(fieldName);

      field.addEventListener("blur", function () {
        const value = sanitizeInput(this.value);
        const validation = validateField(fieldName, value);

        if (!validation.isValid) {
          showFieldError(fieldName);
        } else {
          clearFieldError(fieldName);
        }
      });

      field.addEventListener("input", function () {
        
        clearFieldError(fieldName);
        hideStatus();
      });
    });
  }

  function submitForm(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; 
        if (success) {
          resolve({
            success: true,
            message:
              "✅ Message sent successfully! We'll get back to you soon.",
          });
        } else {
          resolve({
            success: false,
            message: "❌ Failed to send message. Please try again later.",
          });
        }
      }, 2000);
    });
  }

  
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    clearAllFieldErrors();
    hideStatus();

    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      formData.set(key, sanitizeInput(value));
    }

    const errors = validateForm(formData);

    if (errors.length > 0) {
      const firstError = errors[0];
      showFieldError(firstError.field);
      showStatus(firstError.message, "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.value = "Sending...";
    showStatus("📤 Sending your message...", "loading");

    try {
      const result = await submitForm(formData);

      if (result.success) {
        showStatus(result.message, "success");
        form.reset();
        // Reset textarea visual state
        updateTextareaState();
      } else {
        showStatus(result.message, "error");
      }
    } catch (error) {
      showStatus("An unexpected error occurred. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.value = "Send Message";
    }
  });

  setupRealTimeValidation();

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });

  function resetForm() {
    form.reset();
    clearAllFieldErrors();
    hideStatus();
    // Reset textarea visual state
    updateTextareaState();
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      resetForm();
    }
  });

  const messageField = document.getElementById("message");
  const maxLength = validationRules.message.maxLength;

  const counter = document.createElement("div");
  counter.style.cssText = `
        position: absolute;
        bottom: 8px;
        right: 12px;
        font-size: 12px;
        color: #636c72;
        background: rgba(255, 255, 255, 0.9);
        padding: 2px 6px;
        border-radius: 4px;
        pointer-events: none;
        z-index: 5;
        font-family: "Poppins", sans-serif;
    `;

  const messageContainer = messageField.closest(".message-box");
  messageContainer.style.position = "relative";
  messageContainer.appendChild(counter);

   function updateCounter() {
     const length = messageField.value.length;
     counter.textContent = `${length}/${maxLength}`;

     if (length > maxLength * 0.9) {
       counter.style.color = "#dc3545";
       counter.style.background = "rgba(220, 53, 69, 0.1)";
     } else {
       counter.style.color = "#636c72";
       counter.style.background = "rgba(255, 255, 255, 0.9)";
     }
   }

   function updateTextareaState() {
     const hasText = messageField.value.trim().length > 0;
     if (hasText) {
       messageField.classList.add("has-text");
     } else {
       messageField.classList.remove("has-text");
     }
     updateCounter();
   }

   messageField.addEventListener("input", updateTextareaState);
   messageField.addEventListener("blur", updateTextareaState);
   updateTextareaState(); 
});

// navbar scroll tracker

let lastScrollY = window.scrollY;
const navbar = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  if (window.scrollY < lastScrollY) {
    // Scrolling UP
    navbar.classList.remove("hide");
    navbar.classList.add("show");
  } else {
    // Scrolling DOWN
    navbar.classList.remove("show");
    navbar.classList.add("hide");
  }

  lastScrollY = window.scrollY;
});

// menu slider

let slideBtn = document.querySelector(".menu-slider");
let logo = document.querySelector(".logo");
let menu = document.querySelector(".menu");
let rightSection = document.querySelector(".right-section");
rightSection.style.transition = "all 0.5s ease";
let clicked = false;
slideBtn.addEventListener("click", () => {
  if (clicked) {
    logo.style.transform = "translateX(0)";
    menu.style.transform = "translateX(0)";
    rightSection.style.transform = "translateX(0)";
    slideBtn.style.transform = "translateX(0)";
  } else {
    logo.style.transform = "translateX(-20vw)";
    menu.style.transform = "translateX(-20vw)";
    rightSection.style.transform = "translateX(-7.75vw)";
    slideBtn.style.transform = "translateX(-11vw)";
  }
  clicked = !clicked;
});

slideBtn.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// form opening btn
let nav = document.querySelector(".nav");
let mainSetion = document.querySelector(".main");
let openBtn = document.querySelector("#formOpen");
let formBody = document.querySelector(".r-form");
openBtn.addEventListener("click", () => {
  formBody.style.transform = "translate(-50%, -50%) scale(1)";
  formBody.style.opacity = "1";
  nav.style.filter = "blur(5px)";
  mainSetion.style.filter = "blur(5px)";
});

let closeBtn = document.querySelector("#closeForm3");

closeBtn.addEventListener("click", () => {
  formBody.style.transform = "translate(-50%, -50%) scale(0)";
  formBody.style.opacity = "0";
  nav.style.filter = "blur(0px)";
  mainSetion.style.filter = "blur(0px)";
});

// API function to generate campaign
async function generateCampaign(campaignData) {
  try {
    const response = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating campaign:", error);
    throw error;
  }
}

// form submission
document
  .getElementById("campaignForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const product = document.getElementById("product").value;
    const description = document.getElementById("description").value;
    const audience = document.getElementById("audience").value;
    const tone = document.getElementById("tone").value;
    const goal = document.getElementById("goal").value;

    const platformElements = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    const platforms = Array.from(platformElements).map((el) => el.value);

    // Validate at least one platform is selected
    if (platforms.length === 0) {
      alert("Please select at least one platform!");
      return;
    }

    const requestBody = {
      product_name: product,
      product_description: description,
      target_audience: audience,
      brand_tone: tone,
      platforms: platforms,
      goal: goal,
    };

    const chatBox = document.getElementById("chatOutput");
    chatBox.innerHTML = `<div class="chat-bubble">⏳ Generating your campaign... This may take 10-30 seconds.</div>`;

    try {
      const result = await generateCampaign(requestBody);

      chatBox.innerHTML = ""; // clear loader

      // Check if there's an error in response
      if (result.error) {
        chatBox.innerHTML = `<div class="chat-bubble">❌ Error: ${result.error}</div>`;
        return;
      }

      // Display generated campaigns for each platform
      for (const [platform, content] of Object.entries(result)) {
        const bubble = document.createElement("div");
        bubble.classList.add("chat-bubble");

        let formatted = `📱 ${platform.toUpperCase()}\n\n`;

        if (typeof content === "object") {
          for (const [key, value] of Object.entries(content)) {
            formatted += `• ${key}: ${value}\n\n`;
          }
        } else {
          formatted += `${content}\n`;
        }

        // Add copy button for each platform
        const copyBtn = document.createElement("button");
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        copyBtn.style.cssText = `
          background: #4c4e6d;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
          font-size: 12px;
        `;
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(formatted).then(() => {
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
              copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
            }, 2000);
          });
        };

        bubble.textContent = formatted;
        bubble.appendChild(document.createElement("br"));
        bubble.appendChild(copyBtn);
        chatBox.appendChild(bubble);
      }

      // Add download all button
      const downloadBtn = document.createElement("button");
      downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download All Campaigns';
      downloadBtn.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 20px;
        font-size: 14px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      `;
      downloadBtn.onclick = downloadAllCampaigns;
      chatBox.appendChild(downloadBtn);

    } catch (err) {
      console.error("Campaign generation failed:", err);
      chatBox.innerHTML = `
        <div class="chat-bubble">
          ❌ Failed to generate campaign. Please check:<br>
          • Flask server is running on port 8000<br>
          • Model is properly loaded<br>
          • Internet connection is stable
        </div>`;
    }

    const userDescription = document.getElementById("userdescription");
    userDescription.innerText = description;

    // Show chat section
    const chatSection = document.querySelector(".chat-container");
    chatSection.style.transform = "translate(-50%,-50%) scale(1)";

    // Add to chat history
    chatHistory();

    // Close form and remove blur
    closeCampaignForm();
    removeBlur();
  });

// Download all campaigns as text file
function downloadAllCampaigns() {
  const chatBubbles = document.querySelectorAll('.chat-bubble');
  let allText = 'MARKETING CAMPAIGNS GENERATED\n\n';
  allText += '='.repeat(50) + '\n\n';
  
  chatBubbles.forEach((bubble, index) => {
    // Remove the copy button text from the content
    const bubbleText = bubble.textContent.replace('Copy', '').trim();
    allText += bubbleText + '\n\n';
    allText += '='.repeat(50) + '\n\n';
  });
  
  const blob = new Blob([allText], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'marketing-campaigns.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Copy individual campaign
function copyCampaign(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Campaign copied to clipboard!");
  });
}

// chat history
let chatHistory = () => {
  let productName = document.getElementById("product").value;
  let history = document.getElementById("history");
  
  // Create new chat item
  let li = document.createElement("li");
  let link = document.createElement("a");
  link.href = "#";
  link.innerHTML = `<i class="fa-regular fa-message"></i> ${productName}`;
  
  // Add click event to load this chat
  link.addEventListener("click", function(e) {
    e.preventDefault();
    // You can implement chat history loading here
    alert(`Loading campaign for: ${productName}`);
  });
  
  li.appendChild(link);
  history.prepend(li);
  
  // Limit history to 10 items
  if (history.children.length > 10) {
    history.removeChild(history.lastChild);
  }
};

const closeCampaignForm = () => {
  document.querySelector(".r-form").style.transform =
    "translate(-50%, -50%) scale(0)";
  document.querySelector(".r-form").style.opacity = "0";
};

const removeBlur = () => {
  nav.style.filter = "blur(0px)";
  mainSetion.style.filter = "blur(0px)";
};

// Form validation before submission
const submit = document.querySelector("#submit");
submit.addEventListener("click", (e) => {
  const product = document.getElementById("product");
  const description = document.getElementById("description");
  const audience = document.getElementById("audience");
  const platformCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  
  if (!product.value.trim()) {
    alert("Please enter a product name!");
    product.focus();
    e.preventDefault();
    return;
  }
  
  if (!description.value.trim()) {
    alert("Please enter a product description!");
    description.focus();
    e.preventDefault();
    return;
  }
  
  if (!audience.value.trim()) {
    alert("Please enter a target audience!");
    audience.focus();
    e.preventDefault();
    return;
  }
  
  if (platformCheckboxes.length === 0) {
    alert("Please select at least one platform!");
    e.preventDefault();
    return;
  }
});

// user dropdown
const userDropdownBtn = document.querySelector(".login");
userDropdownBtn.addEventListener("click", () => {
  const userDropdown = document.querySelector(".userdropdown");
  if (userDropdown) {
    userDropdown.style.transform = "scale(1)";
    userDropdown.style.opacity = "1";
  }
});

// newchat feature
document.querySelector(".newChat").addEventListener("click", (e) => {
  e.preventDefault();
  const chatSection = document.querySelector(".chat-container");
  chatSection.style.transform = "translate(-50%,-50%) scale(0)";
  
  // Reset form
  document.getElementById("campaignForm").reset();
  
  // Show main input section
  const mainInput = document.querySelector(".main-input");
  mainInput.style.display = "flex";
});

// logo navigation
const brand = document.querySelector(".logo");
brand.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Search chats functionality
document.querySelector(".search-chat").addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = prompt("Enter campaign name to search:");
  if (searchTerm) {
    const historyItems = document.querySelectorAll("#history li");
    let found = false;
    
    historyItems.forEach(item => {
      if (item.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
        item.style.backgroundColor = "#4c4e6d";
        item.scrollIntoView({ behavior: "smooth" });
        found = true;
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          item.style.backgroundColor = "";
        }, 3000);
      }
    });
    
    if (!found) {
      alert("No matching campaigns found!");
    }
  }
});

// Introduction section
document.querySelector(".intro").addEventListener("click", (e) => {
  e.preventDefault();
  const chatBox = document.getElementById("chatOutput");
  chatBox.innerHTML = `
    <div class="chat-bubble">
      🤖 <strong>Marketing Campaign Generator</strong><br><br>
      This AI-powered tool helps you create compelling marketing campaigns using fine-tuned GPT-2 technology.<br><br>
      <strong>How to use:</strong><br>
      1. Click "Click Me To Get Things Started"<br>
      2. Fill in your product details<br>
      3. Select target platforms<br>
      4. Choose tone and goal<br>
      5. Generate your campaign!<br><br>
      <strong>Features:</strong><br>
      • Multiple platform support<br>
      • Customizable tone and goals<br>
      • Copy and download options<br>
      • Chat history<br><br>
      Start by creating your first campaign! 🚀
    </div>
  `;
  
  const chatSection = document.querySelector(".chat-container");
  chatSection.style.transform = "translate(-50%,-50%) scale(1)";
});

// Check server connection on load
window.addEventListener('load', async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    if (response.ok) {
      console.log('✅ Flask server is connected');
    }
  } catch (error) {
    console.log('❌ Flask server is not running. Please start the server on port 8000');
  }
});
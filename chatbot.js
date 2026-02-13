// chatbot.js - استخدام DeepSeek الرسمي (مجاني ومضمون)
document.addEventListener("DOMContentLoaded", function() {
    "use strict";
    
    // ============================================================
    // استخدام DeepSeek API الرسمي - مجاني تماماً
    // =============================================================
    const API_KEY = "sk-d4f6844e3508411d85871d32f24d4c7d"; // ✅ مفتاح DeepSeek الرسمي الجديد
    
    // التحقق من وجود العناصر
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".chatbot header .close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    
    if (!chatbox || !chatInput || !sendChatBtn) {
        console.error("❌ عناصر الشات بوت غير موجودة!");
        return;
    }
    
    let userMessage = null;
    const inputInitHeight = chatInput.scrollHeight;
    
    const systemInstruction = `أنت "أبونا" (كاهن قبطي أرثوذكسي) في كنيسة القديسين بطرس وبولس بشبين الكوم. 
تحدث باللهجة المصرية العامية الودودة. أسلوبك أبوي، حكيم، ومتواضع. استخدم عبارات مثل (يا ابني، يا بنتي، يا حبيبي، ربنا يباركك، صليلي).`;
    
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        chatLi.innerHTML = className === "outgoing" 
            ? `<p></p>` 
            : `<span class="material-symbols-outlined icon">✝️</span><p></p>`;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    };
    
    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector("p");
        
        // ✅ DeepSeek API الرسمي - الرابط الصحيح
        const API_URL = "https://api.deepseek.com/v1/chat/completions";
        
        const requestBody = {
            model: "deepseek-chat",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500,
            stream: false
        };
        
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "Accept": "application/json"
            },
            body: JSON.stringify(requestBody)
        };
        
        try {
            console.log("📤 جاري إرسال الطلب إلى DeepSeek...");
            const response = await fetch(API_URL, requestOptions);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ خطأ:", response.status, errorData);
                
                // رسائل خطأ مفهومة
                if (response.status === 401) throw new Error("مفتاح API غير صالح");
                if (response.status === 429) throw new Error("تم تجاوز الحد المسموح، حاول بعد دقيقة");
                if (response.status === 402) throw new Error("رصيد غير كافٍ");
                
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log("✅ تم الاستلام:", data);
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                messageElement.textContent = data.choices[0].message.content;
            } else {
                throw new Error("تنسيق غير متوقع");
            }
            
        } catch (error) {
            console.error("❌ فشل:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "سامحني يا ابني، في مشكلة في الاتصال. جرب تاني بعد شوية.";
        } finally {
            chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
        }
    };
    
    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;
        
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
        
        setTimeout(() => {
            const incomingChatLi = createChatLi("بيفكر...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
            generateResponse(incomingChatLi);
        }, 600);
    };
    
    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });
    
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });
    
    sendChatBtn.addEventListener("click", handleChat);
    
    if (chatbotToggler) {
        chatbotToggler.addEventListener("click", () => {
            document.body.classList.toggle("show-chatbot");
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.body.classList.remove("show-chatbot");
        });
    }
    
    console.log("✅ شات بوت أبونا جاهز - يستخدم DeepSeek الرسمي!");
});
  // Function to summarize a conversation in a specific language
  function summarizeConversation(textOutputElement, language) {
      return `Be a language expert and write summarize the above conversation: '${textOutputElement}'. 
      
      Requirements: 
      1. Summarize this conversation concisely in ${language}, focusing on the main points and key details.
      2. I want the answer to be just a summary of the above conversation.
       
      Example:
      English:
        Summarize this conversation concisely in English, focusing on the main points and key details.

      Spanish:
       Resume esta conversación de manera concisa en español, enfocándote en los puntos principales y detalles clave.

      Japanese:
       この会話を日本語で簡潔に要約し、主なポイントと重要な詳細に焦点を当ててください。 
      `;
  }

  async function fetchGeneratedContent() {
    const textOutputElement = document.getElementById("transcription-text").textContent; // Lấy giá trị ở đây
    const targetLanguage = document.getElementById('language-select').value ; // Replace with the desired language (e.g., English, Japanese, etc.)

      
      const apiKey = "AIzaSyDNn_Xqi7mbYiHqeGGc8zImHXSWduKDtN8"; // Thay bằng API Key của bạn
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

      const payload = {
          contents: [
              {
                  role: "user",
                  parts: [
                      {
                          text: summarizeConversation(textOutputElement, targetLanguage) // Use the corrected function
                      }
                  ]
              }
          ],
          generationConfig: {
              temperature: 1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
              responseMimeType: "text/plain"
          }
      };

      console.log(payload);

      try {
          const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              throw new Error(`Lỗi: ${response.status}`);
          }

          const data = await response.json();

          const markdownContent = data.candidates[0].content.parts[0].text;
          const htmlContent = marked.parse(markdownContent);
          document.getElementById("transcription-text-AI").innerHTML = htmlContent;
      } catch (error) {
          document.getElementById("transcription-text-AI").innerText = `Không thể tải dữ liệu. Lỗi: ${error.message}`;
      }
  }
  // GET VALUE OF BUTTON
  const languageSelect = document.getElementById('language-select');
  const startBtn = document.getElementById('start-btn'); 
  const stopBtn = document.getElementById('stop-btn');
  const textOutput = document.getElementById('transcription-text');
  const textOutputAI = document.getElementById('transcription-text-AI');
  const downloadBtn = document.getElementById("audio-download");
  const audioPlayback = document.getElementById("audio-playback");

  // START THE LANG
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.interimResults = true;
  recognition.continuous = true;
  let mediaRecorder;
  let audioChunks = [];
  
  // HANDLE START BUTTON
  startBtn.addEventListener('click', async () => {
      const selectedLanguage = languageSelect.value;
      recognition.lang = selectedLanguage;
  
      try {
          // Bắt đầu nhận diện giọng nói
          recognition.start();
      } catch (e) {
          console.error('Recognition already started');
      }
  
      startBtn.classList.add('hidden');
      stopBtn.classList.remove('hidden');
  
      try {
          // Yêu cầu quyền truy cập microphone từ người dùng
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
  
          // Bắt đầu ghi âm
          mediaRecorder.start();
          textOutput.textContent = 'Listening...';
  
          // Lưu các đoạn âm thanh
          mediaRecorder.ondataavailable = (event) => {
              audioChunks.push(event.data);
          };
  
          mediaRecorder.onstop = () => {
              // Tạo file Blob từ các đoạn âm thanh
              const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
              const audioUrl = URL.createObjectURL(audioBlob);
  
              // Hiển thị âm thanh trong thẻ <audio>
              audioPlayback.src = audioUrl;
  
              // Kích hoạt nút tải xuống
              downloadBtn.disabled = false;
              downloadBtn.onclick = () => {
                  const a = document.createElement("a");
                  a.href = audioUrl;
                  a.download = "recording.mp3";
                  a.click();
                  URL.revokeObjectURL(audioUrl);
              };
  
              // Reset các đoạn âm thanh và stream
              audioChunks = [];
              stream.getTracks().forEach(track => track.stop());
          };
      } catch (err) {
          console.error('Error accessing microphone:', err);
          textOutput.textContent = 'Failed to access microphone. Please check your permissions.';
          startBtn.classList.remove('hidden');
          stopBtn.classList.add('hidden');
      }
  });
  

  stopBtn.addEventListener('click', () => {
    try {
                recognition.stop();
            } catch (e) {
                console.error('Recognition already stopped');
            }

            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
    stopBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
  });

  recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      textOutput.textContent = transcript;
    };

    recognition.onend = () => {
      if (startBtn.classList.contains('hidden')) {
                recognition.start();
            }
    };

    document.getElementById('export-pdf-transcription').addEventListener('click', function() {
      const text = textOutput.textContent;

      const docDefinition = {
          content: [
              { text : text, font: 'Roboto' }
          ],
          defaultStyle: {
              font: 'Roboto'
          }
      };

      pdfMake.createPdf(docDefinition).download('transcription.pdf'); // Tên file khi tải xuống
  });  
  
  document.getElementById('export-pdf-AI').addEventListener('click', function() {
    const text = textOutputAI.textContent;

    const docDefinition = {
        content: [
            { text : text, font: 'Roboto' }
        ],
        defaultStyle: {
            font: 'Roboto'
        }
    };

    pdfMake.createPdf(docDefinition).download('transcription.pdf'); // Tên file khi tải xuống
});  

    document.getElementById('export-docx-transcription').addEventListener('click', () => {
      const textOutput = document.getElementById('transcription-text').textContent.trim();
      const content = textOutput || 'No content available.';
      const docContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Transcription</title>
          </head>
          <body>
            <p>${content}</p>
          </body>
        </html>
      `;      
    // Tạo Blob với nội dung HTML
    const blob = new Blob([docContent], { type: 'application/msword' });

    // Sử dụng FileSaver.js để tải xuống
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcription.doc';
    a.click();

    // Giải phóng URL sau khi tải
    URL.revokeObjectURL(a.href);
    });

    document.getElementById('export-docx-AI').addEventListener('click', () => {
      const textOutput = document.getElementById('transcription-text-AI').textContent.trim();
      const content = textOutput || 'No content available.';
      const docContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Transcription</title>
          </head>
          <body>
            <p>${content}</p>
          </body>
        </html>
      `;      
    // Tạo Blob với nội dung HTML
    const blob = new Blob([docContent], { type: 'application/msword' });

    // Sử dụng FileSaver.js để tải xuống
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcription.doc';
    a.click();

    // Giải phóng URL sau khi tải
    URL.revokeObjectURL(a.href);
    });
   
    document.getElementById('export-txt-AI').addEventListener('click', () => {
      const content = textOutputAI.textContent.trim();
      const blob = new Blob([content || 'No content available.'], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'transcription.txt');
    });

    document.getElementById('copy-text-transcription').addEventListener('click', function() {
      // Lấy thẻ textarea
      var textarea = document.getElementById('transcription-text');
      
      // Chọn nội dung trong textarea
      textarea.select();
      textarea.setSelectionRange(0, 99999); // Đối với thiết bị di động

        // Sao chép nội dung vào clipboard
        navigator.clipboard.writeText(textarea.value).then(function() {
          alert('Text copied to clipboard');
      }).catch(function(err) {
          console.error('Failed to copy text: ', err);
      });
      });
        
        function copyCodeAI() {
            const textToCopy = document.getElementById('transcription-text-AI').innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Text copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }     
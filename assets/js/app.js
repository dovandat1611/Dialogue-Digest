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
        recognition.start();
      } catch (e) {
          console.error('Recognition already started');
      }

  startBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
    
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
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Hiển thị âm thanh trong thẻ <audio>
        audioPlayback.src = audioUrl;

        // Cho phép tải xuống file
        downloadBtn.disabled = false;
        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = audioUrl;
            a.download = "recording.webm";
            a.click();
        };

        // Reset các đoạn âm thanh
        audioChunks = [];
        stream.getTracks().forEach(track => track.stop());
    };  

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

    // Export functionality
    document.getElementById('export-pdf-transcription').addEventListener('click', () => {
  const doc = new jspdf.jsPDF();
  const content = textOutput.textContent.trim();
  doc.text(content || 'No content available.', 10, 10);
  doc.save('transcription.pdf');
});

document.getElementById('export-pdf-AI').addEventListener('click', () => {
  const doc = new jspdf.jsPDF();
  const content = textOutputAI.textContent.trim();
  doc.text(content || 'No content available.', 10, 10);
  doc.save('transcription.pdf');
});


document.getElementById('export-docx-transcription').addEventListener('click', () => {
      const textOutput = document.getElementById('text-output').textContent.trim();
      const content = textOutput || 'No content available.';
      const blob = new Blob([content], { type: 'application/msword' });
      saveAs(blob, 'transcription.doc');
    });

    document.getElementById('export-docx-AI').addEventListener('click', () => {
      const textOutputAI = document.getElementById('text-output').textContent.trim();
      const content = textOutputAI || 'No content available.';
      const blob = new Blob([content], { type: 'application/msword' });
      saveAs(blob, 'transcription.doc');
    });

    document.getElementById('export-txt-transcription').addEventListener('click', () => {
      const content = textOutput.textContent.trim();
      const blob = new Blob([content || 'No content available.'], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'transcription.txt');
    });
  
    document.getElementById('export-txt-AI').addEventListener('click', () => {
      const content = textOutputAI.textContent.trim();
      const blob = new Blob([content || 'No content available.'], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, 'transcription.txt');
    });

    function copyText() {
            const outputText = textOutput.value;
            const textarea = document.createElement('textarea');
            textarea.value = outputText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Text copied to clipboard');
        }
        
        function copyCodeAI() {
            const textToCopy = document.getElementById('transcription-text-AI').innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Text copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }     
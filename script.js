document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const thumbnailCanvas = document.getElementById("thumbnail-canvas");
    const canvasContext = thumbnailCanvas.getContext("2d");

    // Create an audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();

    // Connect the audio element to the analyser
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Set the size of the FFT (Fast Fourier Transform)
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Create a function to capture and draw the audio waveform
    function captureAudioThumbnail() {
        analyser.getByteFrequencyData(dataArray);
        thumbnailCanvas.width = thumbnailCanvas.clientWidth;
        thumbnailCanvas.height = thumbnailCanvas.clientHeight;
        const barWidth = (thumbnailCanvas.width / bufferLength) * 2;
        let x = 0;

        dataArray.forEach(value => {
            const barHeight = (value / 256) * thumbnailCanvas.height;
            canvasContext.fillStyle = `rgb(${value + 100}, 50, 50)`;
            canvasContext.fillRect(x, thumbnailCanvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        });
    }

    // Start audio context and capture thumbnail on play
    audio.addEventListener("play", () => {
        audioContext.resume().then(() => {
            audio.play();
            setInterval(captureAudioThumbnail, 50);
        });
    });
});


// p5.movieRecorder

// MIT License
// Copyright (c) 2021 Tetsunori NAKAYAMA

// A simple movie recording tool for p5.js canvas

class P5MovRec {
  constructor(opeKey = 82 /* 'r' */) {
    this.movRecorder;
    this.chunks = [];
    this.opeKey = opeKey;
    this.init();
  }

  init() {
    const stream = document.querySelector('canvas').captureStream();
    const options = {
      videoBitsPerSecond: 100000000,
      mimeType: 'video/webm;codecs=vp9',
    };
    this.movRecorder = new MediaRecorder(stream, options);

    this.movRecorder.ondataavailable = (e) => {
      if (e.data.size) {
        this.chunks.push(e.data);
      }
    };
    this.movRecorder.onstop = this.generateMovie.bind(this);

    console.log(String.fromCharCode(this.opeKey) + ' key: Start/Stop Recording');
  }

  generateMovie() {
    const blob = new Blob(this.chunks, { type: 'video/webm' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = this.getNowYMDhmsStr() + '.webm';
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  keyHandler() {
    if (keyCode !== this.opeKey) {
      // Ignore
      return;
    }
    this.toggleRec();
  }

  toggleRec() {
    if (this.movRecorder) {
      if (this.movRecorder.state === 'inactive') {
        console.log('🎥Start Recording.');
        this.movRecorder.start();
      } else if (this.movRecorder.state === 'recording') {
        console.log('✅Recorded.');
        this.movRecorder.stop();
      }
    }
  }

  // https://hatolabo.com/programming/js-get-now-string
  getNowYMDhmsStr() {
    const date = new Date();
    const Y = date.getFullYear();
    const M = ('00' + (date.getMonth() + 1)).slice(-2);
    const D = ('00' + date.getDate()).slice(-2);
    const h = ('00' + date.getHours()).slice(-2);
    const m = ('00' + date.getMinutes()).slice(-2);
    const s = ('00' + date.getSeconds()).slice(-2);

    return Y + M + D + h + m + s;
  }
}

// Instance of this tool
let p5MovRec;

const initFunc = () => {
  // Search canvas first
  const targetCanvas = document.querySelector('canvas');
  if (targetCanvas === null) {
    // Canvas is not created yet. Call initFunc again after 100msec
    setTimeout(() => {
      initFunc();
    }, 100);
  } else {
    // Found canvas. Start preparing for P5MovRec
    p5MovRec = new P5MovRec();
  }
};
initFunc();

function keyPressed() {
  p5MovRec.keyHandler();
}

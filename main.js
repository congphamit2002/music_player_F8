// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist')
const cd = $('.cd')
const cdWidth = Number(cd.offsetWidth)
const playBtn = $('.btn-toggle-play')
const heading = $('header h2')
const cdThumb = $('.cd .cd-thumb')
const audio = $('#audio')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRepeat: false,
  isRandom: false,
  songs: [
    {
      name: "Pháo Hồng",
      singer: "Đạt Long Vinh",
      path: 'mp3/Phao Hong H2O Remix_ - Dat Long Vinh.mp3',
      image: "https://data.chiasenhac.com/data/cover_thumb/169/168154.jpg"
    },
    {
      name: "Thich Thich",
      singer: "Phương Ly",
      path: "mp3/ThichThich - Phuong Ly.mp3",
      image:
        "https://data.chiasenhac.com/data/cover/172/171554.jpg"
    },
    {
      name: "Bên trên tầng lầu",
      singer: "Tăng Duy Tân",
      path:
        "mp3/Ben Tren Tang Lau Version 2_ - Tang Duy.mp3",
      image: "https://data.chiasenhac.com/data/cover/172/171912.jpg"
    },
    
  ],

  //định nghĩa property cho object app
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  //render playlist
  renderPlayList: function() {
    const _this = this;
    const html = this.songs.map(function(song, index){
        return `<div class="song ${index === _this.currentIndex ? "active" : "flase"}"  data-index = ${index} >
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`
    }).join('')
    playlist.innerHTML =   html;
  },

  //xử lý các sự kiện
  handelEvents: function(){
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });    
        const _this = this;
        //xử lý khi trượt playlist
        document.onscroll = function () {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const newCdWidth = cdWidth - scrollTop;
          cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
          cd.style.opacity = newCdWidth / cdWidth;
        };
        
        //click nút play
        playBtn.onclick = function(){
            if(_this.isPlaying)
                audio.pause();
            else 
                audio.play()
        };

        //click nút next bài hát
        nextBtn.onclick = function () {
            
            if(_this.isRepeat || (_this.isRepeat === true && _this.isRandom === true)) {
                _this.loadCurrentSong()
                audio.play()
            } else if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
        }
        
        //click nút prev bài hát

        prevBtn.onclick = function() {
            if(_this.isRepeat || (_this.isRepeat === true && _this.isRandom === true)) {
                _this.loadCurrentSong()
                audio.play()
            } else if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
        }


        audio.onplay = function(){

            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()  
        }

        //xử lý khi time của bài hát bị thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration != 'NaN') {
                const currentTime = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = currentTime;
            }
        }

        //xử lý khi hết bài hát
        audio.onended = function() {
            if(_this.isRepeat || (_this.isRepeat === true && _this.isRandom === true)) {
                _this.loadCurrentSong()
                audio.play()
            } else if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
        }

        //khi di chuyển thanh kéo thì bài hát cx bị thay đổi
        progress.onchange = function() {
            const timeChange = this.value;
            audio.currentTime = (timeChange / 100 * audio.duration);
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            if(_this.isRepeat) {
                this.classList.add('active')
            } else { 
                this.classList.remove('active')
            }
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            if(_this.isRandom) {
                this.classList.add('active')
            } else { 
                this.classList.remove('active')
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            
            if(songNode || e.target.closest('.song.option')) {
                _this.currentIndex = Number(songNode.getAttribute('data-index'))
                console.log(_this.currentIndex)
                _this.loadCurrentSong();
                audio.play()
                _this.renderPlayList()
            }
        }
    }, 
  nextSong: function() {
    this.currentIndex ++ ;
    if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
    } 
    this.loadCurrentSong();
    audio.play()
    this.renderPlayList()
  },
  prevSong: function() {
    this.currentIndex--;
    if(this.currentIndex <= 0) {
        this.currentIndex = this.songs.length - 1;
    } 
    this.loadCurrentSong();
    audio.play()
    this.renderPlayList()

  },
  playRandomSong: function() {
    let randomValue
    do {
        randomValue = Math.floor(Math.random() * (this.songs.length));
    }while (this.currentIndex === randomValue)
    this.currentIndex = randomValue;
    this.loadCurrentSong();
    audio.play();
    this.renderPlayList()

  },
  //load bài hát hiện tại 
  loadCurrentSong: function(){

    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    },
  start: function() {
    this.defineProperties();

    this.renderPlayList();

    this.loadCurrentSong();
    this.handelEvents();

} 
  
};

app.start();

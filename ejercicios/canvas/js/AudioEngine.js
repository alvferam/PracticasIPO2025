export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playSound(type) {
        if (!this.ctx || this.isMuted) return;
        
        const osc = this.ctx.createOscillator(); 
        const gain = this.ctx.createGain();      
        osc.connect(gain);
        gain.connect(this.ctx.destination);      
        const now = this.ctx.currentTime;        

        if (type === 'shoot') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            
            osc.start(now);
            osc.stop(now + 0.1); 

        } else if (type === 'explosion') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        }
    }
}
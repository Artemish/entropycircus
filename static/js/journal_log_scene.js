class JournalLogScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JournalLogScene' });
    }

    create(data) {
        this.lines = data.lines;
        this.currentLine = 0;

        this.add.rectangle(400, 300, 800, 600, 0x000000); // Black background

        this.input.on('pointerdown', this.onPointerDown, this);

        // Create a timer that calls showNextLine every 5 seconds
        this.timer = this.time.addEvent({
            delay: 5000,
            callback: this.showNextLine,
            callbackScope: this,
            loop: true
        });

        this.showNextLine();
    }

    onPointerDown() { 
        this.timer.reset({
            delay: 5000,                // 5000 ms = 5 seconds
            callback: this.showNextLine,
            callbackScope: this,
            loop: true
        }); 

        this.showNextLine();
    }

    showNextLine() {
        if (this.currentLine >= this.lines.length) {
            this.scene.get('GameScene').processNextEvent();
            this.scene.stop();
            return;
        }

        const line = this.lines[this.currentLine];
        const ypos = 50 * (1 + this.currentLine);

        let text = this.add.text(50, ypos, line, { fontSize: '24px', fill: '#ffffff' });
        text.alpha = 0;
        // Create a tween to fade in the text
        this.tweens.add({
            targets: text,
            alpha: 1,
            duration: 2000, // 3 seconds
            ease: 'Linear'
        });

        this.currentLine++;
    }
}

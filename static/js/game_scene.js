class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.sequenceIndex = 0;
        console.log("[GAME] active: ", this.config);
    }

    preload() {
        this.load.json('level', 'assets/levels/level1.json');
        this.load.audio('bgm', 'assets/music/01_entropy_circus.mp3');
    }

    startBGM() {
        this.bgm.play();
    }

    create() {
        this.levelData = this.cache.json.get('level');
        console.log("[GAME] Starting level: ", this.levelData);
        // this.processNextEvent();
        this.bgm = this.sound.add('bgm', {loop: true});
        this.bgm.play();

        this.sound.pauseOnBlur = false;
        
        this.events.once('scene_ready', this.handleSceneFullyRendered, this);

        this.processNextEvent();
    }
  
    handleSceneFullyRendered(data) {
        console.log(`${data.scene} is fully rendered`);
        // Process the next event or any other logic
        this.processNextEvent();
    }

    processNextEvent() {
        if (this.sequenceIndex >= this.levelData.sequence.length) {
            console.log('End of sequence');
            return;
        }

        const event = this.levelData.sequence[this.sequenceIndex];
        this.sequenceIndex++;
        console.log("[GAME] processing event: ", event);

        switch (event.type) {
            case 'journallog':
                this.handleJournalLog(event);
                break;
            case 'stage':
                this.handleStage(event.target, event.interactive);
                break;
            case 'dialogue':
                this.handleDialogue(event.script);
                break;
            case 'new_objective':
                this.handleNewObjective(event.objective);
                break;
            case 'wait_for_event':
                this.handleWaitForEvent(event.event, event.target);
                break;
            default:
                console.warn('Unknown event type:', event.type);
                this.processNextEvent();
                break;
        }
    }

    handleJournalLog(event) {
        this.scene.launch('JournalLogScene', { lines: event.lines });
        this.scene.pause();
    }

    handleDialogue(script) {
        this.scene.launch('DialogueScene', script);
        this.scene.get('DialogueScene').scene.setVisible(true);
        this.scene.pause();
    }

    handleNewObjective(objective) {
        this.events.emit('new_objective', objective);
        this.processNextEvent();
    }

    handleWaitForEvent(eventName, targetId) {
        const mainScene = this.scene.get('MainScene');
        mainScene.shipIDMap.get(targetId).once(eventName, () => {
          this.processNextEvent();
        });
    }

    handleStage(target, interactive) {
        let mainScene = this.scene.get('MainScene');

        if (mainScene.scene.isActive()) {
          mainScene.scene.restart(target);
        } else {
          this.scene.start('MainScene', target);
        }

        if (interactive) {
          // console.log("[GAME] Pausing while scene plays out");
          // this.scene.pause();
        }
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.sequenceIndex = 0;
        this.lastStage = -1;
        console.log("[GAME] active: ", this.config);
    }

    preload() {
        this.load.json('level', 'assets/levels/level1.json');
        this.load.audio('bgm', 'assets/music/01_entropy_circus.mp3');
    }

    create() {
        this.levelData = this.cache.json.get('level');
        console.log("[GAME] Starting level: ", this.levelData);
        // this.processNextEvent();
        this.bgm = this.sound.add('bgm', {loop: true});
        this.bgm.play();

        this.sound.pauseOnBlur = false;
        
        this.events.on('scene_ready', this.handleSceneFullyRendered, this);

        this.processNextEvent();
    }
  
    handleSceneFullyRendered(data) {
        console.log(`${data.scene} is fully rendered`);
        // Process the next event or any other logic
        this.processNextEvent();
    }

    resetStage() {
      this.sequenceIndex = this.lastStage;
      this.bgm.play();
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
                this.lastStage = this.sequenceIndex;
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
            case 'event':
                this.handleRaiseEvent(event.event, event.scene);
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
        this.scene.get('UIScene').renderObjective(objective);
        this.processNextEvent();
    }

    handleWaitForEvent(eventName, targetId) {
        console.log(`[GAME] Waiting for ${eventName} on target ${targetId}`);
        const mainScene = this.scene.get('MainScene');
        mainScene.shipIDMap.get(targetId).once(eventName, () => {
          this.processNextEvent();
        });
    }

    handleRaiseEvent(eventName, sceneID) {
        console.log(`[GAME] Emitting event ${eventName} on ${sceneID}`);
        const scene = this.scene.get(sceneID);
        scene.events.emit(eventName);
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

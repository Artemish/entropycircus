class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    preload() {
        // Load any assets needed for the menu
        this.load.image('tabButton', 'assets/tab_button.png');
        this.load.image('tabButtonSelected', 'assets/tab_button_selected.png');
    }

    create(data) {
        this.parentSceneKey = data.parentSceneKey;
        console.log(`Making Settings Scene with parent ${this.parentSceneKey}`);
        this.currentTab = 'Sound'; // Start with the "Sound" tab active

        // Create the tabs
        this.createTabs();

        // Create the content for the "Sound" and "General" tabs
        this.createSoundTabContent();
        this.createGeneralTabContent();

        // Show the current tab content
        this.showTabContent(this.currentTab);

        // Listen for the Escape key to resume the game
        this.input.keyboard.on('keydown-ESC', () => {
            console.log(`Resuming scene: ${this.parentSceneKey}`);
            this.scene.stop();
            this.scene.resume(this.parentSceneKey);
        });

        // Get the current game width and height
        const { width, height } = this.scale;

        // Add a dark semi-transparent overlay to deemphasize the parent scene
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.depth = -1;
    }

    createTabs() {
        const tabSpacing = 150;

        // Sound Tab
        this.soundTabButton = this.add.image(100, 50, 'tabButton').setInteractive();
        this.soundTabButtonText = this.add.text(100, 50, 'Sound', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.soundTabButton.on('pointerdown', () => this.selectTab('Sound'));

        // General Tab
        this.generalTabButton = this.add.image(100 + tabSpacing, 50, 'tabButton').setInteractive();
        this.generalTabButtonText = this.add.text(100 + tabSpacing, 50, 'General', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5, 0.5);
        this.generalTabButton.on('pointerdown', () => this.selectTab('General'));
    }

    createSoundTabContent() {
        // Create sound settings content (e.g., volume controls)
        this.soundContent = this.add.group();

        const volumeText = this.add.text(100, 150, 'Volume:', { fontSize: '24px', fill: '#ffffff' });
        const volumeSlider = this.add.rectangle(250, 160, 200, 20, 0xaaaaaa).setOrigin(0, 0.5);

        this.soundContent.add(volumeText);
        this.soundContent.add(volumeSlider);

        // Initially hide this content if it's not the active tab
        if (this.currentTab !== 'Sound') {
            this.soundContent.setVisible(false);
        }
    }

    createGeneralTabContent() {
        // Create general settings content (e.g., difficulty, screen options)
        this.generalContent = this.add.group();

        const difficultyText = this.add.text(100, 150, 'Difficulty:', { fontSize: '24px', fill: '#ffffff' });
        const difficultyOption = this.add.text(250, 150, 'Normal', { fontSize: '24px', fill: '#ffffff' });

        this.generalContent.add(difficultyText);
        this.generalContent.add(difficultyOption);

        // Initially hide this content if it's not the active tab
        if (this.currentTab !== 'General') {
            this.generalContent.setVisible(false);
        }
    }

    selectTab(tabName) {
        if (this.currentTab === tabName) {
            return; // If the tab is already selected, do nothing
        }

        this.currentTab = tabName;

        // Update the tab button visuals
        this.updateTabButtons();

        // Show the selected tab's content
        this.showTabContent(tabName);
    }

    updateTabButtons() {
        // Reset all tab buttons to unselected state
        this.soundTabButton.setTexture('tabButton');
        this.generalTabButton.setTexture('tabButton');

        // Highlight the selected tab button
        if (this.currentTab === 'Sound') {
            this.soundTabButton.setTexture('tabButtonSelected');
        } else if (this.currentTab === 'General') {
            this.generalTabButton.setTexture('tabButtonSelected');
        }
    }

    showTabContent(tabName) {
        // Hide all content
        this.soundContent.setVisible(false);
        this.generalContent.setVisible(false);

        // Show the selected tab's content
        if (tabName === 'Sound') {
            this.soundContent.setVisible(true);
        } else if (tabName === 'General') {
            this.generalContent.setVisible(true);
        }
    }
}

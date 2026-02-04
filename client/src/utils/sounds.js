// Sound utility for timer notifications

// Sound file paths
const SOUNDS = {
	stop: '/sounds/notification-pluck-off-269290.mp3',      // Bitir butonu
	reset: '/sounds/new-notification-014-363678.mp3',       // Sıfırla
	pause: '/sounds/new-notification-09-352705.mp3',        // Durdur
	complete: '/sounds/mixkit-correct-answer-tone-2870.wav' // Sayaç otomatik bitti
};

// Play a specific sound (only once)
export const playSound = (soundName) => {
	try {
		const path = SOUNDS[soundName];
		if (!path) {
			console.warn(`Sound not found: ${soundName}`);
			return;
		}

		const audio = new Audio(path);
		audio.volume = 0.7;
		audio.play().catch(err => {
			console.warn('Could not play sound:', err);
		});
	} catch (error) {
		console.error('Error playing sound:', error);
	}
};

// Convenience functions for each sound
export const playSoundStop = () => playSound('stop');
export const playSoundReset = () => playSound('reset');
export const playSoundPause = () => playSound('pause');
export const playSoundComplete = () => playSound('complete');

// Preload all sounds for faster playback
export const preloadSounds = () => {
	Object.values(SOUNDS).forEach(path => {
		const audio = new Audio(path);
		audio.preload = 'auto';
	});
};

export default {
	playSound,
	playSoundStop,
	playSoundReset,
	playSoundPause,
	playSoundComplete,
	preloadSounds
};

import {
    Animations
} from './LnData';

export default class LegendaryNotificatorAnimations {

    interval: any = null;

    constructor() {
        this.init();
    }

    init() {}

    animation(animationType: Animations = Animations.NONE) {
        confetti.reset();
        clearInterval(this.interval);

        switch (animationType) {
            case Animations.CONFETTI:
                this.confetti();
                break;
            case Animations.CONFETTI_SIDE:
                this.confettiSide();
                break;
            case Animations.FIREWORKS:
                this.fireworks();
                break;
            case Animations.STARS:
                this.stars();
                break;
            case Animations.NONE:
                break;
            default:
                console.error('Unknown animation type');
                break;
        }
    }

    confetti() {
        confetti({
            particleCount: 100,
            spread: 140,
            origin: {
                y: 0.6
            },
            scalar: 1.8
        });
    }

    confettiSide() {
        const animationEnd = Date.now() + (15 * 1000);
        const defaults = {
            particleCount: 4,
            spread: 55,
            scalar: 1.2,
            // colors: ['#bb0000', '#ffffff']
        };

        const fire = () => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(this.interval);
            }

            confetti({
                ...defaults,
                angle: 60,
                origin: {
                    x: 0
                },
            });
            confetti({
                ...defaults,
                angle: 120,
                origin: {
                    x: 1
                },
            });
        }

        this.interval = setInterval(fire, 50);
    }

    stars() {
        const defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
        };

        const shoot = () => {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.4,
                shapes: ['star']
            });

            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 1,
                shapes: ['circle']
            });
        }

        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
        setTimeout(shoot, 400);
        setTimeout(shoot, 600);
    }

    fireworks() {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            scalar: 1.2
        };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const fire = () => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(this.interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2
                }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2
                }
            });
        }

        this.interval = setInterval(fire, 150);
    }

}
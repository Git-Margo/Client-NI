module.exports = {
    effect: {
        SHAKE: 'SHAKE',
        TINT: 'TINT',
        ANIMATION: 'ANIMATION'
    },
    target: {
        SCREEN: 'SCREEN',
        CHARACTER: 'CHARACTER',
    },
    specificTarget: {
        SKILL_CASTER: 'SKILL_CASTER',
        SKILL_TARGET: 'SKILL_TARGET',
        SKILL_CASTER_GROUP: 'SKILL_CASTER_GROUP',
        SKILL_TARGET_GROUP: 'SKILL_TARGET_GROUP',
    },
    soundUrl: {},
    params: {
        delay: true,
        duration: true,
        repeat: true,
        opacity: true,
        color: true,
        url: true,
        gifUrl: true,
        position: {
            TOP: 'TOP',
            RIGHT: 'RIGHT',
            BOTTOM: 'BOTTOM',
            LEFT: 'LEFT',
            CENTER: 'CENTER'
        }
    }
}
import like from './svg/reactions/like.svg'
import angry from './svg/reactions/angry.svg'
import care from './svg/reactions/care.svg'
import love from './svg/reactions/love.svg'
import haha from './svg/reactions/haha.svg'
import sad from './svg/reactions/sad.svg'
import wow from './svg/reactions/wow.svg'

import loading from './svg/loading/loading.svg'
import { ReactionType } from '../enums/reaction'

const svgReaction: Record<ReactionType, string> = {
    LIKE: like,
    LOVE: love,
    WOW: wow,
    HAHA: haha,
    SAD: sad,
    ANGRY: angry,
    CARE: care
};


export type ReactionSvgType = keyof typeof svgReaction; 

const svgShared = {
    loading
}

export { svgReaction, svgShared }
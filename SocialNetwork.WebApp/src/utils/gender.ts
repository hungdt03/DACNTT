import { Gender } from "../enums/gender";

export const getGenderTitle = (gender: Gender) : string => {
    if(gender === Gender.FEMALE) return 'Nữ'
    if(gender === Gender.MALE) return 'Nam'
    
    return 'Khác'
}
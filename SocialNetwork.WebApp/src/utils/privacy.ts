
import { GroupPrivacy } from "../enums/group-privacy";

export const getGroupPrivacyTitle = (privacy: GroupPrivacy) => {
    switch (privacy) {
        case GroupPrivacy.PRIVATE:
            return 'Riêng tư';
        case GroupPrivacy.PUBLIC:
            return 'Công khai'
    }
};


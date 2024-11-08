let NAME = "NAME";
let KEY_CODE = "KEY_CODE";
let TEXT_PARAMS = "TEXT_PARAMS";
let VIEW_PARAMS = "VIEW_PARAMS";
let CALL_PARAMS = "CALL_PARAMS";

let CHAT = "CHAT";
let MESSAGE = "MESSAGE";

let ALERT = "ALERT";
let YELLOW_MESSAGE = "YELLOW_MESSAGE";
let CHAT_SYSTEM_MESSAGE = "CHAT_SYSTEM_MESSAGE";
let CHAT_CLAN_MESSAGE = "CHAT_CLAN_MESSAGE";

let GROUP_PARAMS_AMOUNT = "GROUP_PARAMS_AMOUNT";

let INSTANT_CALL = "INSTANT_CALL";
let AFTER_CLIENT_READY_CALL = "AFTER_CLIENT_READY_CALL";

let o = {
    CODE_MESSAGE_ATTR: {
        [NAME]: NAME,
        [KEY_CODE]: KEY_CODE,
        [TEXT_PARAMS]: TEXT_PARAMS,
        [VIEW_PARAMS]: VIEW_PARAMS,
        [CALL_PARAMS]: CALL_PARAMS
    },
    SOURCE: {
        [CHAT]: CHAT,
        [MESSAGE]: MESSAGE
    },
    TEXT_MODIFY: {
        [GROUP_PARAMS_AMOUNT]: GROUP_PARAMS_AMOUNT
    },
    CALL_KIND: {
        [INSTANT_CALL]: INSTANT_CALL,
        [AFTER_CLIENT_READY_CALL]: AFTER_CLIENT_READY_CALL
    },
    VISIBLE_KIND: {
        [ALERT]: ALERT,
        [YELLOW_MESSAGE]: YELLOW_MESSAGE,
        [CHAT_SYSTEM_MESSAGE]: CHAT_SYSTEM_MESSAGE,
        [CHAT_CLAN_MESSAGE]: CHAT_CLAN_MESSAGE
    },
    CODE_MESSAGE_WRAPPER: null,
    CODE_MESSAGE: null
};

o.CODE_MESSAGE_WRAPPER = {
    1004001: {
        [NAME]: 'confirm-prompt-ask-message-wrapper'
    }
};


// [VIEW_PARAMS]: [MESSAGE] -> default YELLOW_MESSAGE
// [VIEW_PARAMS]: [CHAT]    -> default CHAT_SYSTEM_MESSAGE

o.CODE_MESSAGE = {

    // Enhancement
    1001001: {
        [NAME]: 'ItemClassIsNotValid'
    },
    1001002: {
        [NAME]: 'ItemCanNotBeCursed'
    },
    1001003: {
        [NAME]: 'ItemIsProgressable'
    },
    1001004: {
        [NAME]: 'ItemMustBeInInventory'
    },
    1001005: {
        [NAME]: 'IngredientMustBeInBag'
    },
    1001006: {
        [NAME]: 'NotEnoughGold'
    },
    1001007: {
        [NAME]: 'NotEnoughIngredients'
    },
    1001008: {
        [NAME]: 'BonusSelectorApplyError'
    },
    1001009: {
        [NAME]: 'BonusSelectorSelectError'
    },
    1001010: {
        [NAME]: 'IngredientIsWorthless'
    },
    1001011: {
        [NAME]: 'ItemLevelIsTooLow'
    },
    1001012: {
        [NAME]: 'ProgressOverflow'
    },
    1001013: {
        [NAME]: 'ItemIsUpgradable'
    },
    1001014: {
        [NAME]: 'ItemIsCompleted'
    },
    1001015: {
        [NAME]: 'BoundConfirm'
    },
    1001016: {
        [NAME]: 'SelfItemUpgrade'
    },
    1001017: {
        [NAME]: 'ItemCannotBeTimeLimited'
    },
    1001018: {
        [NAME]: 'ItemIsRequiredInQuest'
    },
    1002001: {
        [NAME]: 'ItemUpgraded'
    },

    1101001: {
        [NAME]: 'MissingSelectedStat'
    },
    1102001: {
        [NAME]: 'BonusSelectorItemBindableConfirmation'
    },
    1201001: {
        [NAME]: 'ForceBindingConfirmation'
    },

    1005001: {
        [NAME]: 'MatchCommonOnly'
    },
    1005002: {
        [NAME]: 'MatchUniqueOnly'
    },
    1005003: {
        [NAME]: 'MatchHeroicOnly'
    },
    1005004: {
        [NAME]: 'MatchUpgradeOnly'
    },
    1005005: {
        [NAME]: 'MatchLegendaryOnly'
    },
    1005006: {
        [NAME]: 'MatchArtifactOnly'
    },

    // Salvager
    1003001: {
        [NAME]: 'ItemIsDeleted'
    },
    1003002: {
        [NAME]: 'ItemLocationIsNotInPlayer'
    },
    1003003: {
        [NAME]: 'ItemStateIsEquipped'
    },
    1003004: {
        [NAME]: 'ItemStateIsNotInBag'
    },
    1003005: {
        [NAME]: 'ItemRarityIsNotSalvageable'
    },
    1003006: {
        [NAME]: 'ItemClassIsNotSalvageable'
    },
    1003007: {
        [NAME]: 'ItemLevelIsTooLow'
    },
    1003008: {
        [NAME]: 'ItemValueIsWorthless'
    },
    1003009: {
        [NAME]: 'ItemIsRequiredInQuest'
    },
    1003010: {
        [NAME]: 'ItemIsCursed'
    },
    1003011: {
        [NAME]: 'ItemExpires'
    },
    1004001: {
        [NAME]: 'ItemsInBattleSets',
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 2
        }
    },

    //Extraction
    1301001: {
        [NAME]: 'GuestCantUseCredits'
    },
    1301002: {
        [NAME]: 'InvalidCurrency'
    },
    1301003: {
        [NAME]: 'NotEnoughGold'
    },
    1301004: {
        [NAME]: 'NotEnoughCredits'
    },
    1401001: {
        [NAME]: 'ItemMustBeInBag'
    },
    1401002: {
        [NAME]: 'NotUpgraded'
    },

    //Bonus reselect
    1004002: {
        [NAME]: 'ItemNotInBag'
    },
    1004003: {
        [NAME]: 'NotEnoughItems'
    },
    1004004: {
        [NAME]: 'BagIsFull'
    },
    1004005: {
        [NAME]: 'RequiredTakeOffTwoItems'
    },
    1004006: {
        [NAME]: 'ItemIsNotEquippable'
    },
    1004007: {
        [NAME]: 'ItemIsAlreadyEquipped'
    },
    1004008: {
        [NAME]: 'ItemIsExpired'
    },
    1004009: {
        [NAME]: 'ItemReqNotFullfilled'
    },
    1004010: {
        [NAME]: 'ItemNoUsesLeft'
    },
    1004011: {
        [NAME]: 'ItemUsedInBattle'
    },
    1006001: {
        [NAME]: 'NotSummable'
    },
    1006002: {
        [NAME]: 'DifferentLevels'
    },
    1006003: {
        [NAME]: 'DifferentExpires'
    },
    1006004: {
        [NAME]: 'DifferentCustomTeleports'
    },
    1006005: {
        [NAME]: 'SelectedOutfitMissmatch'
    },
    1007001: {
        [NAME]: 'InvalidOperation'
    },
    1008001: {
        [NAME]: 'TalismanSuccessful'
    },
    1008002: {
        [NAME]: 'TalismanAlreadyActivated'
    },
    1101002: {
        [NAME]: 'MissingSelectorStat'
    },
    1601001: {
        [NAME]: 'TooFastLinkedGetLinkedItem'
    },
    1501001: {
        [NAME]: 'LinkedItemDoesNotExist'
    },
    1501002: {
        [NAME]: 'TooMuchLinkedItem'
    },
    1501003: {
        [NAME]: 'ChatCharacterLimitExceeded'
    },
    1701001: {
        [NAME]: 'TooHighLevelToAttack'
    },
    1702002: {
        [NAME]: 'GroupFightConfirm'
    },
    1801001: {
        [NAME]: 'EnhancementLimitExceed'
    },
    1902001: {
        [NAME]: 'InvalidAuctionTime',
        [VIEW_PARAMS]: {
            [MESSAGE]: ALERT
        }
    },

    //battlePass
    2001001: {
        [NAME]: 'RerollCompletedMission'
    },
    2003001: {
        [NAME]: 'InsufficientPoints'
    },
    2002001: {
        [NAME]: 'CollectedReward'
    },
    2002002: {
        [NAME]: 'InsufficientAccesToCollectReward'
    },
    2002003: {
        [NAME]: 'AlreadyHavePremium'
    },

    //skills
    2101001: {
        [NAME]: 'FreeSkillsTime'
    },

    //builds
    4901001: {
        [NAME]: 'SkillBattlesetBuyNotification',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    4902001: {
        [NAME]: 'SkillBattlesetChangeNameError_EBattleSetNameError_IsTooShort'
    },
    4902002: {
        [NAME]: 'SkillBattlesetChangeNameError_EBattleSetNameError_IsTooLong'
    },
    4902003: {
        [NAME]: 'SkillBattlesetChangeNameError_EBattleSetNameError_IsImproper'
    },
    4903001: {
        [NAME]: 'SkillBattlesetAddConfirmation'
    },
    4904001: {
        [NAME]: 'SkillBattlesetAddIsFullError'
    },
    4905001: {
        [NAME]: 'SkillBattlesetAddNotification',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },

    //auctions
    1905001: {
        [NAME]: 'AuctionSellConfirm'
    },
    1901001: {
        [NAME]: 'ChangeAllAuctionsTime'
    },
    1904001: {
        [NAME]: 'FeaturedAuctionLimitReached'
    },
    1903001: {
        [NAME]: 'ObservedAuction'
    },
    1906001: {
        [NAME]: 'AuctionsItemIsExpired'
    },
    1907001: {
        [NAME]: 'AuctionsFeaturedIsNotPossible'
    },

    //trade
    2201001: {
        [NAME]: 'TradeAcceptCanceled',
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 1
        }
    },
    2202001: {
        [NAME]: 'AcceptanceIsLocked'
    },
    2202002: {
        [NAME]: 'OfferIsChanged'
    },

    //clan
    2301001: {
        [NAME]: 'ClanNameChange',
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 2
        }
    },
    2302001: {
        [NAME]: 'ClanNameIsTooLong '
    },
    2302002: {
        [NAME]: 'ClanNameIsImproper'
    },
    2302003: {
        [NAME]: 'ClanNameContainsTooManyCapitalLetters'
    },
    2302004: {
        [NAME]: 'ClanNameContainsInvalidCapitalLetters'
    },
    2302005: {
        [NAME]: 'ClanNameContainsForbiddenPhrases'
    },

    //items
    2401001: {
        [NAME]: 'CouldNotThrowAwayQuestItem'
    },
    2501001: {
        [NAME]: 'ExpbackCreditsConfirm',
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 1
        }
    },
    2502001: {
        [NAME]: 'L_EXP_BACK',
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 2
        }
    },

    //limits
    1801012: {
        [NAME]: 'ItemSplitLimit'
    },
    1801013: {
        [NAME]: 'ShopBuyLimit'
    },
    1801014: {
        [NAME]: 'MailSendLimit'
    },
    1801015: {
        [NAME]: 'TradeLimit'
    },
    1801016: {
        [NAME]: 'AuctionSellLimit'
    },
    1801017: {
        [NAME]: 'ItemGroundDropLimit'
    },
    1801018: {
        [NAME]: 'ItemGroundTakeLimit'
    },

    //chat
    2803001: {
        [NAME]: 'InvitationParty',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    4505001: {
        [NAME]: 'GetLvlAndProf',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2305000: {
        [NAME]: 'ClanMemberStatusNotification_Left',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2305001: {
        [NAME]: 'ClanMemberStatusNotification_Join',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2701000: {
        [NAME]: 'FriendStatusNotification_Left',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2701001: {
        [NAME]: 'FriendStatusNotification_Join',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2801000: {
        [NAME]: 'PartyStatusNotification_Left',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2801001: {
        [NAME]: 'PartyStatusNotification_Join',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2806001: {
        [NAME]: 'EPartyInvitationError_TooFarAway'
    },

    4501001: {
        [NAME]: 'EChatBroadcastError_TooShort'
    },
    4501002: {
        [NAME]: 'EChatBroadcastError_InvalidCharacters'
    },
    4501003: {
        [NAME]: 'EChatBroadcastError_Muted'
    },
    4501004: {
        [NAME]: 'EChatBroadcastError_NoobUsesHyperlinks'
    },
    4501005: {
        [NAME]: 'EChatBroadcastError_TooFast'
    },
    4501008: {
        [NAME]: 'EChatBroadcastError_ChatIsDisabled'
    },
    4501009: {
        [NAME]: 'EChatBroadcastError_ChatIsLocked'
    },
    4501012: {
        [NAME]: 'EChatBroadcastError_YouAreEnemyOfReceiver'
    },
    4501013: {
        [NAME]: 'EChatBroadcastError_ReceiverIsYourEnemy'
    },
    4501014: {
        [NAME]: 'EChatBroadcastError_ReceiverHasPersonalLocked'
    },
    4501015: {
        [NAME]: 'EChatBroadcastError_YourPrivIsLocked'
    },
    4501016: {
        [NAME]: 'EChatBroadcastError_YouAreNewbie'
    },
    4501019: {
        [NAME]: 'EChatBroadcastError_LowLvl'
    },
    4501006: {
        [NAME]: 'EChatBroadcastError_Spam'
    },
    4501007: {
        [NAME]: 'EChatBroadcastError_ShadowBanned'
    },
    4501010: {
        [NAME]: 'EChatBroadcastError_NarStyleIsNotAvailable'
    },
    4501011: {
        [NAME]: 'EChatBroadcastError_MeStyleIsNotAvailable'
    },
    4501017: {
        [NAME]: 'EChatBroadcastError_RedStyleIsNotAvailable'
    },
    4501018: {
        [NAME]: 'EChatBroadcastError_StyleIsNotAvailable'
    },

    2602001: {
        [NAME]: 'LSYSTEM_MAINTENANCE_CLOSED_ACCESS_OK',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2702001: {
        [NAME]: 'L_INVITATION_DECLINED_friend',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    2802001: {
        [NAME]: 'L_INVITATION_DECLINED_party',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    2703001: {
        [NAME]: 'L_INVITATION_SENT_friend',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    2303001: {
        [NAME]: 'L_INVITATION_SENT_clan',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    2203001: {
        [NAME]: 'L_INVITATION_SENT_trade',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },

    2304004: {
        [NAME]: 'L_SAVED_clan',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304006: {
        [NAME]: 'LCLAN_ALLY_ACCEPTED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304007: {
        [NAME]: 'LCLAN_ALLY_BROKEN',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304005: {
        [NAME]: 'LCLAN_ALLY_SENT',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304008: {
        [NAME]: 'LCLAN_APPLICATION_ACCEPTED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304009: {
        [NAME]: 'LCLAN_APPLICATION_REJECTED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304010: {
        [NAME]: 'LCLAN_APPLIED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304011: {
        [NAME]: 'LCLAN_DISBANDED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304012: {
        [NAME]: 'LCLAN_GOLD_IN_MSG',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304013: {
        [NAME]: 'LCLAN_GOLD_OUT_MSG',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304014: {
        [NAME]: 'LCLAN_HAS_BEEN_RENAMED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304003: {
        [NAME]: 'LCLAN_LEFT',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304015: {
        [NAME]: 'LCLAN_NO_LONGER_LEADER',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304016: {
        [NAME]: 'LCLAN_WAR_ENDED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304001: {
        [NAME]: 'LCLAN_YOU_HAVE_CREATED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304002: {
        [NAME]: 'LCLAN_YOU_HAVE_JOINED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3001001: {
        [NAME]: 'LCONFIG_SAVED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3101001: {
        [NAME]: 'LEMO_KB_BLESS_CAST_ON',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },

    39020001: {
        [NAME]: 'LEMO_SPELL_EXPIRED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    4101001: {
        [NAME]: 'LRECEIVED/LLOST + LFATIGUE',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    100101001: {
        [NAME]: 'LITEM_CUSTOM_OUTFIT_SET',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    100201001: {
        [NAME]: 'LITEM_CUSTOM_TELEPORT_SET',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    100301001: {
        [NAME]: 'LITEM_LOWREQ_DONE',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    100401001: {
        [NAME]: 'LITEM_RECIPE_LEARNT',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    100501001: {
        [NAME]: 'LITEM_UNBOUND',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    39010001: {
        [NAME]: 'LITEM_UNDER_SPELL',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    100601001: {
        [NAME]: 'LITEM_UNDO_DONE',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    100701001: {
        [NAME]: 'CEventRevivePlayerIsWantedError',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    100602001: {
        [NAME]: 'UndoupgError',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        },
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 1
        }
    },
    100302001: {
        [NAME]: 'LowreqError',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    100702001: {
        [NAME]: 'UpglvlError',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    100901001: {
        [NAME]: 'ExpaddLevelAdvanceConfirmation'
    },
    101001001: {
        [NAME]: 'UpgResetCustomTeleportConfirmation'
    },
    101101001: {
        [NAME]: 'AddEnhancementRefundConfirmation'
    },
    101101002: {
        [NAME]: 'ChangeEnhancementRefundConfirmation.RemoveByAuction'
    },
    101101003: {
        [NAME]: 'ChangeEnhancementRefundConfirmation.RemoveByTrade'
    },
    101101004: {
        [NAME]: 'ChangeEnhancementRefundConfirmation.RemoveByUnbind'
    },
    101201001: {
        [NAME]: 'AddTabDepositConfirmation'
    },
    4801001: {
        [NAME]: 'ArtisanshipItemIsModifiedConfirmation'
    },

    4001001: {
        [NAME]: 'LITEM_YOU_HAVE_RECEIVED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE,
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    4601001: {
        [NAME]: 'QUEST_STARTED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE,
            [MESSAGE]: YELLOW_MESSAGE
        }
    },

    4002001: {
        [NAME]: 'LITEM_YOU_HAVE_RECEIVED',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },

    3701004: {
        [NAME]: 'LITEM_TOO_HIGH_LVL_TO_GAIN',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3201001: {
        [NAME]: 'LMAIL_VOTE_STORED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3201002: {
        [NAME]: 'MessageSent'
    },
    3301001: {
        [NAME]: 'LMATCH_SIGNED_OUT',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3401001: {
        [NAME]: 'LML_FIGHT_WITHDRAWN',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3401002: {
        [NAME]: 'LML_ROUND',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    2804001: {
        [NAME]: 'LPARTY_FAIL_TRIALS',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2706001: {
        [NAME]: 'LPLAYER_FRIENDS_ADDED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2805001: {
        [NAME]: 'LPLAYER_PARTY_ADDED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3501001: {
        [NAME]: 'LSHOP_TTL_ACTIVATED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3501004: {
        [NAME]: 'LSHOP_TTL_ADD_BOUGHT',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3501003: {
        [NAME]: 'LSHOP_TTL_DEL_BOUGHT',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3501002: {
        [NAME]: 'LSHOP_TTL_PROLONGED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3302001: {
        [NAME]: 'LTALK_LOOT_EMPTY_matchmaking',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    3601001: {
        [NAME]: 'LTALK_LOOT_EMPTY_promo',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    3701002: {
        [NAME]: 'LTALK_LOOT_EMPTY_lootbox',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },
    2205001: {
        [NAME]: 'LTRADE_CANCELLED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2206001: {
        [NAME]: 'LTRADE_SUCCESSFUL',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2207001: {
        [NAME]: 'ETradeInvitationError_TooFarAway'
    },
    2208001: {
        [NAME]: 'TradeSoulboundItemConfirmation',
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 1
        }
    },
    2209001: {
        [NAME]: 'TradeSoulboundItemsAcceptConfirmation',
        [TEXT_PARAMS]: {
            [GROUP_PARAMS_AMOUNT]: 1
        }
    },
    2210001: {
        [NAME]: 'TradeInvalidSoulboundItem'
    },
    2402001: {
        [NAME]: '(HARD_CODED)',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3801001: {
        [NAME]: '(HARD_CODED)',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    4506001: {
        [NAME]: 'CHANNEL_NOT_EXITST',
        [VIEW_PARAMS]: {
            [MESSAGE]: YELLOW_MESSAGE
        }
    },

    4201001: {
        [NAME]: 'L_PLAYER_NOT_FOUND'
    },
    4201002: {
        [NAME]: 'L_PLAYER_OFFLINE'
    },
    4701001: {
        [NAME]: 'L_INVITATION_BUSY'
    },
    4401001: {
        [NAME]: 'LBATTLE_CAN_ATTACK_ONLY'
    },
    4401002: {
        [NAME]: 'LBATTLE_CAN_ATTACK_ONLY_LBATTLE_OR_SELF_CAST_SPELL'
    },
    4401003: {
        [NAME]: 'CanNotUseFightperhealInMatchmaking'
    },
    4301001: {
        [NAME]: 'LCLAN_CREATE_COST_IS'
    },
    2304019: {
        [NAME]: 'LCLAN_GOLD_IN_MAX'
    },
    2306001: {
        [NAME]: 'ClanAddCreditsIsLoanUnpaidError'
    },


    2304020: {
        [NAME]: 'LCLAN_QUEST_NO_ITEM'
    },
    2704002: {
        [NAME]: 'LFRIENDS_ADD_LIMIT'
    },
    2704001: {
        [NAME]: 'LFIRENDS_ADD_IS_ALREADY'
    },
    2704004: {
        [NAME]: 'LFRIENDS_ADD_LOCKED'
    },
    2704005: {
        [NAME]: 'LFRIENDS_ADD_SELF'
    },
    2704006: {
        [NAME]: 'LFRIENDS_ADD_YOU_ENEMY'
    },
    2704007: {
        [NAME]: 'LFRIENDS_ADD_YOUR_ENEMY'
    },
    2705001: {
        [NAME]: 'LFRIENDS_EADD_IS_ALREADY'
    },
    2705004: {
        [NAME]: 'LFRIENDS_EADD_IS_FRIEND'
    },
    2705003: {
        [NAME]: 'LFRIENDS_EADD_LIMIT'
    },
    2705002: {
        [NAME]: 'LFRIENDS_EADD_SELF'
    },
    2704003: {
        [NAME]: 'LFRINEDS_ADD_TOO_MANY'
    },
    1301005: {
        [NAME]: 'LPLAYER_GOLD_LIMIT_HAPPEN_1_LPLAYER_GOLD_LIMIT_HAPPEN_2'
    },
    4503001: {
        [NAME]: 'LSYSTEM_OPT_NOT_THIS_WORLD_ChatShowLvlError'
    },
    3502001: {
        [NAME]: 'LSYSTEM_OPT_NOT_THIS_WORLD_ShopTimeticketsChangeError'
    },
    2204001: {
        [NAME]: 'LTRADE_PLAYER_DECLINED'
    },
    4504001: {
        [NAME]: 'LCHAT_DICE_HELP'
    },
    4504002: {
        [NAME]: 'LCHAT_DICE_ERR'
    },
    4504003: {
        [NAME]: 'LCHAT_COIN_DONT_HAVE'
    },

    2603001: {
        [NAME]: 'LSYSTEM_CHAR_REMOVED'
    },
    2603002: {
        [NAME]: 'LSYSTEM_ERR_IP_CHANGED*'
    },
    2602002: {
        [NAME]: 'LSYSTEM_MAINTENANCE*',
        [CALL_PARAMS]: INSTANT_CALL
    },

    4502001: {
        [NAME]: 'FORBIDDEN_HREF'
    },
    4502002: {
        [NAME]: 'FORBIDDEN_SWERING'
    },
    3901001: {
        [NAME]: 'AFFECTED_BY_SPELL',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    2304017: {
        [NAME]: 'ALLIANCE_PROPOSAL_REJECTED'
    },
    2304018: {
        [NAME]: 'DONT_ENOUGH_GOLD_TO_CREATE_CLAN'
    },
    4102001: {
        [NAME]: 'LOST_MINUTES_TO_STAMINA',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },
    3902001: {
        [NAME]: 'NOT_ACCEPT_STH',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_SYSTEM_MESSAGE
        }
    },

    4003001: {
        [NAME]: 'INVENTORY_GAIN_LEGENDARY_ITEMS_LINKED',
        [VIEW_PARAMS]: {
            [CHAT]: CHAT_CLAN_MESSAGE
        }
    }

    //test
    //1801018: {
    //    [NAME]          : 'ItemGroundTakeLimit',
    //    [VIEW_PARAMS]   : {
    //        [MESSAGE] : ALERT,
    //        [CHAT]    : CHAT_SYSTEM_MESSAGE
    //    }
    //},

};

for (let keyCodeMessageWrapper in o.CODE_MESSAGE_WRAPPER) {
    o.CODE_MESSAGE_WRAPPER[keyCodeMessageWrapper][KEY_CODE] = keyCodeMessageWrapper;
}

for (let keyCodeMessage in o.CODE_MESSAGE) {
    o.CODE_MESSAGE[keyCodeMessage][KEY_CODE] = keyCodeMessage;
}



module.exports = o;
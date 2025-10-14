const BuildsData = require('@core/builds/BuildsData.js');
var SettingsData = require('@core/settings/SettingsData');
const ProfData = require('@core/characters/ProfData');

module.exports = function() {

    let data = null;

    const BUILDS_REQ = BuildsData.REQUEST;


    const init = () => {
        initData();
    };

    const initData = () => {
        data = {
            captcha: {
                start: (v) => {
                    return isIntVal(v)
                },
                answerId: (v) => {
                    return isIntsValWithSeperatorOrEmpty(v)
                },
            },
            [BUILDS_REQ.BUILDS]: {
                [BUILDS_REQ.ACTION]: (v) => {
                    return specificStringVals(v, [BUILDS_REQ.UPDATE_CURRENT, BUILDS_REQ.UPDATE, BUILDS_REQ.BUY])
                },
                [BUILDS_REQ.CURRENCY]: (v) => {
                    return specificStringVals(v, [BUILDS_REQ.CURRENCY_GOLD, BUILDS_REQ.CURRENCY_CREDITS])
                },
                [BUILDS_REQ.ID]: (v) => {
                    return isIntVal(v)
                },
                [BUILDS_REQ.NAME]: (v) => {
                    return isStringVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
                skillshop: (v) => {
                    return isIntVal(v)
                },
            },
            moveitem: {
                st: (v) => {
                    return isIntVal(v)
                },
                set: (v) => {
                    return isIntVal(v)
                },
                tpl: (v) => {
                    return isIntVal(v)
                },
                id: (v) => {
                    return isIntVal(v)
                },
                //answer1001012: (v) => {return isIntVal(v)},
                //answer1201001: (v) => {return isIntVal(v)},
                answer: (v) => {
                    return isIntVal(v)
                },
                x: (v) => {
                    return isIntVal(v)
                },
                y: (v) => {
                    return isIntVal(v)
                },
                town_id: (v) => {
                    return isIntVal(v)
                },
                town_x: (v) => {
                    return isIntVal(v)
                },
                town_y: (v) => {
                    return isIntVal(v)
                },
                bonusIdx: (v) => {
                    return isIntVal(v)
                },
                put: (v) => {
                    return isIntVal(v)
                },
                findslot: (v) => {
                    return isIntVal(v)
                },
                ans: (v) => {
                    return isIntVal(v)
                },
                outfit_id: (v) => {
                    return isIntVal(v)
                },
                split: (v) => {
                    return isIntVal(v)
                },
                skillshop: (v) => {
                    return isIntVal(v)
                },
                locationId: (v) => {
                    return isIntVal(v)
                }
            },
            talk: {
                id: (v) => {
                    return isIntVal(v) || specificStringVals(v, ['player', 'pet', 'any'])
                },
                action: (v) => {
                    return specificStringVals(v, ['reset', 'cancel'])
                },
                sex: (v) => {
                    return specificStringVals(v, ['m', "f"])
                },
                prof: (v) => {
                    return specificStringVals(v, [ProfData.WARRIOR, ProfData.BLADE_DANCER, ProfData.PALADIN, ProfData.MAGE, ProfData.HUNTER, ProfData.TRACKER])
                },
                c: (v) => {
                    return isPl() ? isFloatVal(v) : isStringVal(v)
                },
                inputId: (v) => isIntVal(v),
                inputData: (v) => isStringVal(v),
                inputCancel: (v) => {
                    return isIntVal(v)
                },
                //answer2501001: (v) => {return isIntVal(v)}
            },
            shop: {
                //answer1004001: (v) => {return isIntVal(v)},
                buy: (v) => {
                    return isBuyVal(v)
                },
                sell: (v) => {
                    return isSellVal(v)
                },
                can_sell: (v) => {
                    return isIntVal(v)
                },
                npc: (v) => {
                    return isIntVal(v)
                },
                filters: (v) => {
                    return isIntVal(v)
                }
            },
            codeprom: {
                code: (v) => {
                    return isStringVal(v)
                },
                opt: (v) => {
                    return isIntVal(v)
                }
            },
            skills: {
                learn: (v) => {
                    return isIntVal(v)
                },
                lvl: (v) => {
                    return isIntVal(v)
                },
                reset: (v) => {
                    return isIntVal(v)
                },
                show: (v) => {
                    return isIntVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
                battleaction: (v) => {
                    return specificStringVals(v, ['set', 'show', 'learn'])
                },
                battleskills: (v) => {
                    return isIntsValWithSeperatorOrEmpty(v)
                },
                selectedskills: (v) => {
                    return isIntsValOrEmptyValWithSeperatorOrEmpty(v)
                },
                rpt: (v) => {
                    return isIntVal(v)
                },
                set: (v) => {
                    return isIntVal(v)
                },
                credits: (v) => {
                    return isIntVal(v)
                },
            },
            //useab: {
            //	a: (v) => {return specificStringVals(v, ['str', 'agi', 'int'])},
            //	cnt: (v) => {return isIntVal(v)}
            //},
            promotions: {
                a: (v) => {
                    return specificStringVals(v, ['use', 'show'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                }
            },
            clan: {
                nrid: (v) => {
                    return isIntVal(v)
                },
                a: (v) => {
                    return specificStringVals(v, ['wear', 'confirm', 'disband', 'invite_cancel', 'recruit_applications_reject', 'recruit_applications_accept', 'set_attrs', 'rank', 'join', 'apply', 'leave', 'skills_use', 'skills_upgrade', 'buy_quest', 'credits', 'invite_show', 'recruit_applications_show', 'invite', 'set_attrs', 'bring', 'myclan', 'list', "member", "members", "dipl", "quests_show", "getclan", "skills_show", "save", "depo", "create"])
                },
                a2: (v) => {
                    return specificStringVals(v, ['add', 'del', 'edit'])
                },
                f: (v) => {
                    return specificStringVals(v, ['gold', 'credits', 'info', 'official', 'logo', 'name'])
                },
                agree: (v) => {
                    return isStringVal(v)
                },
                n: (v) => {
                    return isStringVal(v)
                },
                name: (v) => {
                    return isStringVal(v)
                },
                page: (v) => {
                    return isIntVal(v)
                },
                rid: (v) => {
                    return isIntValOrEmpty(v)
                },
                r: (v) => {
                    return isIntVal(v)
                },
                inv: (v) => {
                    return isIntVal(v)
                },
                pid: (v) => {
                    return isIntVal(v)
                },
                dismiss: (v) => {
                    return isIntVal(v)
                },
                v: (v) => {
                    return true
                }, //... sometimes int sometimes string e.q logo ...
                sort: (v) => {
                    return isIntVal(v)
                },
                ascending: (v) => {
                    return isIntVal(v)
                },
                id: (v) => {
                    return isIntVal(v)
                },
                rank: (v) => {
                    return isIntVal(v)
                },
                allow: (v) => {
                    return isIntVal(v)
                },
                leader: (v) => {
                    return isIntVal(v)
                },
                op: (v) => {
                    return specificStringVals(v, ['confirm', 'cancel_e', 'cancel_a', 'close', 'ally', "enemy", "item_put", "item_move", "item_get", "upgrade"])
                },
                pay: (v) => {
                    return specificStringVals(v, ['gold', 'credits', 'self'])
                },
                x: (v) => {
                    return isIntVal(v)
                },
                y: (v) => {
                    return isIntVal(v)
                },
                filters: (v) => {
                    return isStringVal(v)
                },
                search: (v) => {
                    return isStringVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
                ans: (v) => {
                    return isIntVal(v)
                },
                opt: (v) => {
                    return isIntVal(v)
                },
                amount: (v) => {
                    return isIntVal(v)
                },
                inputCancel: (v) => {
                    return isIntVal(v)
                },
                //answer2301001: (v) => {return isIntVal(v)}
            },
            skillshop: {},
            minimap: {},
            friends: {
                a: (v) => {
                    return specificStringVals(v, ['faccept', 'edown', 'eup', 'fdown', 'fup', 'finvite', 'fdel', 'inv', 'show', 'edel', 'eadd'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                nick: (v) => {
                    return isStringVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
            },
            config: {
                opt: (v) => {
                    return isIntVal(v)
                },
                set: (v) => {
                    return isIntVal(v)
                },
                clear: (v) => {
                    return isIntVal(v)
                },
                remove: (v) => {
                    return true
                },
            },
            craft: {
                a: (v) => {
                    return specificStringVals(v, ['list', 'use'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                ans: (v) => {
                    return isIntVal(v)
                },
            },
            quests: {
                a: (v) => {
                    return specificStringVals(v, ['observe_add', 'use', 'cancel', 'observe_remove', "track_set"])
                },
                cancel: (v) => {
                    return isIntVal(v)
                },
                quest_id: (v) => {
                    return isIntVal(v)
                },
            },
            emo: {
                a: (v) => {
                    return specificStringVals(v, ['flag-anglia.gif', 'flag-chorwacja.gif', 'flag-czechy.gif', 'flag-dania.gif', 'flag-francja.gif', 'flag-grecja.gif', 'flag-hiszpania.gif', 'flag-holandia.gif', 'flag-irlandia.gif', 'flag-niemcy.gif', 'flag-polska.gif', 'flag-portugalia.gif', 'flag-rosja.gif', 'flag-skull.gif', 'flag-szwecja.gif', 'flag-ukraina.gif', 'flag-wlochy.gif', 'bat', 'spider', 'banki', 'curse', 'emonutki', 'guma1', 'guma2', 'guma3', 'guma4', 'kuciak', 'ptaszek', 'emosnow', 'ghost', 'water', 'buzia1', 'buzia2', 'roza', 'cocos', 'emohug1', 'emohug2', 'emohug3', 'gift', 'holly', 'snowball', 'pillow', 'fire_1', 'fire_2', 'fire_3', 'fire_4', 'fire_5', 'fire_6', 'fire_7', 'fire_8', 'fire_9', 'fireworks', 'stars', 'termofor', 'lampion1', 'lampion2', 'lampion3', 'lampion4', 'lampion5', 'noemo', 'zombie', 'kiss', 'kiss2', 'angry', 'acceptbless', 'bless'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                iid: (v) => {
                    return isIntVal(v)
                },
                ans: (v) => {
                    return isIntVal(v)
                }
            },
            logoff: {
                a: (v) => {
                    return specificStringVals(v, ['start', 'stop'])
                },
            },
            mail: {
                action: (v) => {
                    return specificStringVals(v, ['refresh', 'send', 'get', 'delete', 'showSent'])
                },
                page: (v) => {
                    return isIntVal(v)
                },
                id: (v) => {
                    return isIntVal(v)
                },
                gold: (v) => {
                    return isIntValOrEmpty(v)
                },
                item: (v) => {
                    return isIntValOrEmpty(v)
                },
                recipient: (v) => {
                    return isStringVal(v)
                },
                msg: (v) => {
                    return isStringVal(v)
                },
                lastPage: (v) => {
                    return isIntVal(v)
                },
            },
            match: {
                a: (v) => {
                    return specificStringVals(v, ['prepared', 'battleset', 'accept_opp', 'main', 'profile', 'statistics', 'history', 'season', 'statistics_detailed', 'signin', 'signout', 'ladder_global', 'ladder_clan', 'ladder_friends', 'summary', 'collect'])
                },
                ans: (v) => {
                    return isIntVal(v)
                },
                player_id: (v) => {
                    return isIntVal(v)
                },
                page: (v) => {
                    return isIntVal(v)
                },
                reward_stage: (v) => {
                    return isIntVal(v)
                },
                reward_season: (v) => {
                    return isIntVal(v)
                },
                reward_idx: (v) => {
                    return isIntVal(v)
                },
                outfit_idx: (v) => {
                    return isIntVal(v)
                },
            },
            bonus_reselect: {
                action: (v) => {
                    return specificStringVals(v, ['status', 'apply', 'select'])
                },
                item: (v) => {
                    return isIntVal(v)
                },
                bonusIdx: (v) => {
                    return isIntVal(v)
                }
            },
            enhancement: {
                //answer1004001: (v) => {return isIntVal(v)},
                action: (v) => {
                    return specificStringVals(v, ['progress_preview', 'progress', 'status', 'upgrade', 'open', 'show'])
                },
                item: (v) => {
                    return isIntVal(v)
                },
                ingredients: (v) => {
                    return isIntsValWithSeperator(v)
                },
                bonusIdx: (v) => {
                    return isIntVal(v)
                },
                //answer1001012: (v) => {return isIntVal(v)},
                //answer1001015: (v) => {return isIntVal(v)}
            },
            salvager: {
                //answer1004001: (v) => {return isIntVal(v)},
                action: (v) => {
                    return specificStringVals(v, ['preview', 'salvage'])
                },
                selectedItems: (v) => {
                    return isIntsValWithSeperator(v)
                }
            },
            extractor: {
                action: (v) => {
                    return specificStringVals(v, ['preview', 'extract'])
                },
                items: (v) => {
                    return isIntVal(v)
                },
                item: (v) => {
                    return isIntVal(v)
                },
                currency: (v) => {
                    return specificStringVals(v, ['gold', 'credits'])
                },
            },
            loot: {
                final: (v) => {
                    return isIntVal(v)
                },
                want: (v) => {
                    return isIntsValWithSeperatorOrEmpty(v)
                },
                not: (v) => {
                    return isIntsValWithSeperatorOrEmpty(v)
                },
                must: (v) => {
                    return isIntsValWithSeperatorOrEmpty(v)
                },
            },
            rewards_calendar: {
                action: (v) => {
                    return specificStringVals(v, ['show', 'open'])
                },
                day_no: (v) => {
                    return isIntVal(v)
                },
                id: (v) => {
                    return isIntVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
            },
            takeitem: {
                id: (v) => {
                    return isIntVal(v)
                },
            },
            recovery: {
                item: (v) => {
                    return isIntVal(v)
                },
            },
            setpvp: {
                mode: (v) => {
                    return isIntVal(v)
                },
            },
            tutorial: {
                opt: (v) => {
                    return isIntVal(v)
                },
            },
            depo: {
                upgrade: (v) => {
                    return isIntVal(v)
                },
                opentab: (v) => {
                    return isIntVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
                move: (v) => {
                    return isIntVal(v)
                },
                get: (v) => {
                    return isIntVal(v)
                },
                put: (v) => {
                    return isIntVal(v)
                },
                x: (v) => {
                    return isIntVal(v)
                },
                y: (v) => {
                    return isIntVal(v)
                },
                goldin: (v) => {
                    return isIntVal(v)
                },
                goldout: (v) => {
                    return isIntVal(v)
                },
                time: (v) => {
                    return isIntVal(v)
                },
                pay: (v) => {
                    return specificStringVals(v, ['gold', 'credits'])
                },
                remove: (v) => {
                    return specificStringVals(v, ['OK'])
                }
            },
            ah: {
                cat: (v) => {
                    return isIntVal(v)
                },
                filter: (v) => {
                    return isStringVal(v)
                },
                sort: (v) => {
                    return isStringVal(v)
                },
                auction: (v) => {
                    return isStringVal(v)
                },
                action: (v) => {
                    return specificStringVals(v, ['sell', 'end', 'change_time', 'change_time_all', 'bid', 'buyout', 'observation_add', 'observation_remove'])
                },
                item: (v) => {
                    return isIntVal(v)
                },
                price: (v) => {
                    return isIntValOrEmpty(v)
                },
                buy_out: (v) => {
                    return isIntValOrEmpty(v)
                },
                time: (v) => {
                    return isIntVal(v)
                },
                is_featured: (v) => {
                    return isIntVal(v)
                },
                //answer1901001: (v) => {return isIntVal(v)},
                //answer1905001: (v) => {return isIntVal(v)},
                //answer1004001: (v) => {return isIntVal(v)},
            },
            wanted: {
                show: (v) => {
                    return isIntVal(v)
                },
            },
            party: {
                a: (v) => {
                    return specificStringVals(v, ['acceptsummon', 'inv', 'disband', 'give', 'rm', 'accept'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
            },
            battlepass: {
                action: (v) => {
                    return specificStringVals(v, ['buy_premium', 'reroll', 'status', 'collect_reward'])
                },
                level: (v) => {
                    return isIntVal(v)
                },
                type: (v) => {
                    return specificStringVals(v, ['standard', 'premium'])
                },
            },
            barter: {
                action: (v) => {
                    return specificStringVals(v, ['use', 'safemode'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                offerId: (v) => {
                    return isIntVal(v)
                },
                selectedItems: (v) => {
                    return isIntsValWithSeperator(v)
                },
                usesCount: (v) => {
                    return isIntVal(v)
                },
                available: (v) => {
                    return isIntVal(v)
                },
                desiredItem: (v) => {
                    return isIntVal(v)
                },
                requiredId: (v) => {
                    return isIntVal(v)
                },
                enabled: (v) => {
                    return isIntVal(v)
                },
            },
            creditshop: {
                filters: (v) => {
                    return isIntVal(v)
                },
                npc: (v) => {
                    return isIntVal(v)
                },
                filterlvlunder: (v) => {
                    return isIntVal(v)
                },
                filterlvlabove: (v) => {
                    return isIntVal(v)
                },
                credits_gold: (v) => {
                    return isIntVal(v)
                },
                ttl_days: (v) => {
                    return isIntVal(v)
                },
                ttl_del: (v) => {
                    return isIntVal(v)
                }
            },
            chat: {
                a: (v) => {
                    return specificStringVals(v, ['ban'])
                },
                ans: (v) => {
                    return specificStringVals(v, ['OK', "null"])
                },
                getContent: (v) => {
                    return isStringVal(v)
                },
                tab: (v) => {
                    return isIntVal(v)
                },
                channel: (v) => {
                    return specificStringVals(v, ['local', 'global', 'trade', 'personal', 'party', 'clan', 'system'])
                },
                style: (v) => {
                    return specificStringVals(v, ['special', 'nar', 'me'])
                },
                receiver: (v) => {
                    return isStringVal(v)
                }
            },
            rooms: {
                room: (v) => {
                    return isIntVal(v)
                },
                keydup: (v) => {
                    return isIntVal(v)
                },
                delkeys: (v) => {
                    return isIntVal(v)
                },
                rent: (v) => {
                    return isIntVal(v)
                },
                m: (v) => {
                    return isIntVal(v)
                },
            },
            trade: {
                a: (v) => {
                    return specificStringVals(v, ['gold', 'cancel', 'ask', 'confirm', 'add', 'sid', 'del', 'accept', 'noaccept'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                buy: (v) => {
                    return isIntsValWithSeperator(v)
                },
                sell: (v) => {
                    return isIntsValWithSeperator(v)
                },
                tid: (v) => {
                    return isIntVal(v)
                },
                sid: (v) => {
                    return isIntVal(v)
                },
                ans: (v) => {
                    return isIntVal(v)
                },
                val: (v) => {
                    return isIntVal(v)
                },
                acceptGoldOverflow: (v) => {
                    return isIntVal(v)
                },
            },
            pet: {
                a: (v) => {
                    return isIntVal(v)
                }
            },
            fight: {
                a: (v) => {
                    return specificStringVals(v, ['attack', 'f', 'exit', 'strike', 'move', 'surrender', 'spell', 'nextmatch', 'auto'])
                },
                auto: (v) => {
                    return isIntVal(v)
                },
                id: (v) => {
                    return isIntVal(v)
                },
                s: (v) => {
                    return isIntVal(v)
                },
                answer: (v) => {
                    return isIntVal(v)
                },
                //answer1702002: (v) => {return isIntVal(v)},
                ff: (v) => {
                    return isIntVal(v)
                },
                enabled: (v) => isIntVal(v),
            },
            registernoob: {
                collect: (v) => {
                    return isIntVal(v)
                },
            },
            artisanship: {
                action: (v) => {
                    return specificStringVals(v, ['open', 'close'])
                }
            },
            settings: {
                action: (v) => {
                    return specificStringVals(v, ['update'])
                },
                id: (v) => {
                    return isIntVal(v)
                },
                v: (v) => {
                    return isIntVal(v) || v == '-' // v == '-' exception for range berserk. need to fix in future
                },
                key: (v) => {
                    return specificStringVals(v, [
                        SettingsData.VARS.OPERATION_LEVEL.MODE,
                        ...Object.values(SettingsData.VARS.LOOT_FILTER),
                        ...Object.values(SettingsData.VARS.BERSERK_VARS)
                    ])
                },
            },
            hunting_statistics: {
                sort: (v) => {
                    return isStringVal(v)
                },
                filter: (v) => {
                    return isStringVal(v)
                },
            },
            administration: {
                targetId: (v) => {
                    return isIntVal(v)
                },
            },
            activities: {
                action: (v) => {
                    return specificStringVals(v, ['show', 'observe'])
                },
                targetId: (v) => {
                    return isIntVal(v)
                },
                activityId: (v) => {
                    return isIntVal(v)
                },
                isObserved: (v) => {
                    return isIntVal(v)
                },
            },
            socket: {
                action: (v) => {
                    return specificStringVals(v, ['inject', 'injectPreview', 'extract', 'extractPreview', 'compose', 'composePreview', 'composePreviewRecipes'])
                },
                item: (v) => {
                    return isIntVal(v)
                },
                items: (v) => {
                    return isIntsValWithSeperator(v)
                },
                enhancer: (v) => {
                    return isIntVal(v)
                },
                currency: (v) => {
                    return specificStringVals(v, ['gold', 'credits'])
                },
            }
        };
    };

    //["creditshop", "filters=1", "npc=479", "filterlvlunder=10", "filterlvlabove=5"]

    const isStringBoolean = (v) => {
        return v == 'true' || v == 'false';
    }

    const isEmptyString = (v) => {
        return v == '';
    }

    const isIntValOrEmpty = (v) => {
        if (v == '') return true;

        return isIntVal(v)
    }

    const isBuyVal = (v) => {
        if (v == '') return true;

        let allItems = v.split(";");

        for (let k in allItems) {
            let args = allItems[k].split(',');

            if (args.length != 2) return false;

            let correctVals = isIntVal(args[0]) && isIntVal(args[1]);

            if (!correctVals) return false

        }

        return true
    };

    const isIntsValWithSeperatorOrEmpty = (v) => {
        if (v == '') return true;

        let allItems = v.split(",");

        for (let k in allItems) {

            let val = allItems[k];

            let correctVal = isIntVal(val);

            if (!correctVal) return false

        }

        return true
    };

    const isIntsValOrEmptyValWithSeperatorOrEmpty = (v) => {
        if (v == '') return true;

        let allItems = v.split(",");

        for (let k in allItems) {

            let val = allItems[k];

            let correctVal = isIntVal(val);

            if (!correctVal) {
                if (val != '') return false;
            }

        }

        return true
    };

    // const isIntsValWithSeperator = (v) => {
    // 	if (v == '') return false;
    //
    // 	let allItems = v.split(",");
    //
    // 	for (let k in allItems) {
    //
    // 		let val = allItems[k];
    //
    // 		let correctVal = isIntVal(val);
    //
    // 		if (!correctVal) return false
    //
    // 	}
    //
    // 	return true
    // };

    const specificStringVals = (val, a) => {
        if (!val) return false

        return a.includes(val);

    };

    const isSellVal = (v) => {
        if (v == '') return true;

        let allItems = v.split(",");

        for (let k in allItems) {
            if (!isIntVal(allItems[k])) return false
        }

        return true
    };

    const checkTaskIsCorrect = (task) => {
        if (!Engine.communication.getGlobalAddonsWasReceived()) return true
        if (task == "_") return true;

        let taskSplit = task.split("&");

        // console.log(task, taskSplit)

        if (taskSplit.length == 1) return true;

        let keyTask = taskSplit[0];

        if (!data[keyTask]) {
            let exception = ['gm', 'console'];
            if (exception.includes(keyTask)) return true;
            warningReport('RequestController.js', 'checkTaskIsCorrect', 'unregistered task request:', keyTask + ' REQUEST:' + task)
            message('unregistered task request:' + keyTask + '|' + task)

            return true; // TEST TIME!!!
        }

        for (let i = 1; i < taskSplit.length; i++) {

            let actionAndVal = taskSplit[i].split('=');

            if (actionAndVal.length != 2) continue;

            let actionIsCorrect = checkActionIsCorrect(keyTask, actionAndVal, task);

            if (!actionIsCorrect) return true; // TEST TIME!!!

        }

        return true;
        //return !(task.indexOf('NaN') > 0 || task.indexOf('NaN') > 0 || task.indexOf('undefined') > 0);
    };

    const isMessageControllerRequest = (action) => {
        return (new RegExp('answer([0-9]{7})')).exec(action);
    };

    const checkActionIsCorrect = (task, actionAndVal, fullTask) => {
        let action = actionAndVal[0];
        let val = actionAndVal[1];
        let result = null;
        let messageControllerMessage = isMessageControllerRequest(action);


        if (messageControllerMessage) result = isIntVal(val);
        else {

            if (!data[task][action]) {
                warningReport('RequestCorrect.js', 'checkActionIsCorrect', 'Unregistered action: ' + action + ', in task:' + task, "Val:" + val + '|' + fullTask);
                message('Unregistered action: ' + action + ', in task:' + task + '|' + fullTask);
                return false;
            }
            result = data[task][action](val);
        }


        if (!result) {
            errorReport("Communication.js", "checkTaskIsCorrect", "Incorrect val in request task:" + task + ", in action:" + action, "Val:" + val + '|' + fullTask);
            message("Incorrect val in request task:" + task + ", in action:" + action + "|" + "Val:" + val + '|' + fullTask);
            return false
        }

        return true
    };


    const checkStepsToSendCorrect = (steps) => {
        for (let k in steps) {
            let xyVals = steps[k].split(',');

            let correctXY = isIntVal(xyVals[0]) && isIntVal(xyVals[1]);

            if (!correctXY) {
                errorReport('Engine.js', "checkStepsToSendCorrect", "Val in stepsToSend is incorrect:", xyVals);
                return false;
            }
        }

        return true
    };

    const checkTimesToSendCorrect = (times) => {
        for (let k in times) {

            let val = times[k];
            let correctTime = isFloatVal(val);

            if (!correctTime) {
                errorReport('Engine.js', "checkTimesToSendCorrect", "Val in timesToSend is incorrect:", val);
                return false;
            }
        }

        return true
    };


    this.init = init;
    this.checkStepsToSendCorrect = checkStepsToSendCorrect;
    this.checkTimesToSendCorrect = checkTimesToSendCorrect;
    this.checkTaskIsCorrect = checkTaskIsCorrect;

};
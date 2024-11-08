module.exports = function ScaleBattle() {

    let scale = 1;

    this.getAvailableHeightForBattleArea = () => {
        let $battleController = Engine.battle.getBattleController();

        let zoom = Engine.zoomFactor ? Engine.zoomFactor : 1;

        let margin = $battleController.hasClass('with-skills') ? 0 : 15;
        let hBattleController = zoom * $battleController.height() - margin;
        let hBottomBar = zoom * Engine.interface.getBottomPositioner().height();
        let hTopBar = zoom * Engine.interface.getTopPositioner().height();
        let hInterfaceLayer = zoom * Engine.interface.get$InterfaceLayerHeight();

        let val = hInterfaceLayer - hBattleController - hBottomBar - hTopBar;

        return val > 0 ? val : 0;
    };


    this.getAvailableWidthForBattleArea = () => {
        return Engine.battle.$.width() * Engine.zoomFactor;
    };

    this.getMaxBattleGroundHeight = () => {


        let $battleArea = Engine.battle.getBattleArea();
        let zoom = Engine.zoomFactor;
        let maxHeightMob = zoom * this.getMaxHeightMob();
        let posY = zoom * Engine.battle.getYPosByLine(5);
        let height = zoom * $battleArea.height();

        let maxY = posY - maxHeightMob;
        let val = height - maxY;

        val = val < height ? height : val;

        return val;
    };

    this.getMaxSumWidthOfLine = () => {
        let lines = Engine.battle.warriors.getLines();
        let maxSumWidth = 0;
        let separatorWidth = Engine.battle.warriors.getSeparatoprWidth();
        let margin = 60;

        for (let y = 0; y < lines.length; y++) {

            let oneLine = lines[y];
            let maxSumWithOfLine = 0;

            for (let j = 0; j < oneLine.length; j++) {

                maxSumWithOfLine += oneLine[j].$.width();
                maxSumWithOfLine += separatorWidth[y];
                //let separatorWidth = getEngine().battle.getSeparatorWidth(j, y);
                //maxSumWithOfLine += separatorWidth[y];
            }

            maxSumWithOfLine += margin;

            if (maxSumWithOfLine > maxSumWidth) maxSumWidth = maxSumWithOfLine
        }

        return Engine.zoomFactor * maxSumWidth;
    };

    // this.manageBattleAreaPosition = () => {
    //
    //     let $battleArea                         = Engine.battle.getBattleArea();
    //     let maxAvailableHeightForBattleArea 	= this.getAvailableHeightForBattleArea();
    //     let maxBattleGroundHeight 				= this.getMaxBattleGroundHeight();
    //
    //     let scale      = maxAvailableHeightForBattleArea / maxBattleGroundHeight;
    //     scale          = scale > 1 ? 1 : scale ;
    //
    //     let top        = ((maxAvailableHeightForBattleArea * 1 / Engine.zoomFactor) / 2);
    //
    //     $battleArea.css('transform', 'translate(-50%, -50%) scale(' + scale + ')');
    //     $battleArea.css('top', top + 'px');
    // };

    this.manageBattleAreaPosition = () => {

        if (!getEngine().battle.zoomMode) return;

        let zoom = Engine.zoomFactor ? Engine.zoomFactor : 1;
        let $battleArea = Engine.battle.getBattleArea();

        let maxAvailableHeightForBattleArea = this.getAvailableHeightForBattleArea();
        let maxAvailableWidthForBattleArea = this.getAvailableWidthForBattleArea();

        let maxBattleGroundHeight = this.getMaxBattleGroundHeight();
        let maxSumWidthOfLine = this.getMaxSumWidthOfLine();

        //let scale;

        let scaleWidth = maxAvailableWidthForBattleArea / maxSumWidthOfLine;
        scaleWidth = scaleWidth > 1 ? 1 : scaleWidth;

        let scaleHeight = maxAvailableHeightForBattleArea / maxBattleGroundHeight;
        scaleHeight = scaleHeight > 1 ? 1 : scaleHeight;

        if (scaleWidth < 1 || scaleHeight < 1) {
            scale = Math.min(scaleWidth, scaleHeight);
        } else scale = 1;

        let top = ((maxAvailableHeightForBattleArea * 1 / zoom) / 2);

        $battleArea.css('transform', 'translate(-50%, -50%) scale(' + scale + ')');
        $battleArea.css('top', top + 'px');
    };

    this.getFirstTakenLine = () => {
        let lines = Engine.battle.warriors.getLines();

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length) return i;
        }

        return null;
    };

    this.getLastTakenLine = () => {
        let lines = Engine.battle.warriors.getLines();

        for (let i = lines.length - 1; i > -1; i--) {
            if (lines[i].length) return i;
        }

        return null;
    };

    this.getMaxHeightMob = () => {
        let lines = Engine.battle.warriors.getLines();
        let maxHeight = 0;

        for (let y = 0; y < lines.length; y++) {

            let oneLine = lines[y];

            for (let j = 0; j < oneLine.length; j++) {

                let warriorHeight = oneLine[j].$.height();

                if (warriorHeight > maxHeight) {
                    maxHeight = warriorHeight
                }
            }

        }

        return maxHeight;
    };

    this.getScale = () => {
        if (getEngine().battle.zoomMode) return scale;

        return 1;
    }

    //this.scaleBattleBackground = () => {
    // let val = -window.innerHeight / 4;
    // Engine.battle.$.find('.battle-background').css('top', val + 'px');
    //}

};
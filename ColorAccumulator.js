(function () {
    var ColorAccumulator = (function () {

        var ColorAccumulator = function () {
            if (!(this instanceof ColorAccumulator)) {
                return new ColorAccumulator();
            }
            this.initialize();
        };

        ColorAccumulator.prototype.initialize = function () {
            this.m_nR = 0;
            this.m_nG = 0;
            this.m_nB = 0;
            this.m_nA = 0;
            this.m_nNumberOfRows = 0;
            this.m_nNumberOfColumns = 0;
            this.m_nNumberOfBytesAllocated = 1;
            this.m_pTable = new Uint8ClampedArray(this.m_nNumberOfBytesAllocated);
            this.m_nMinRow = 0;
            this.m_nMaxRow = 0;
            this.m_nMinColumn = 0;
            this.m_nMaxColumn = 0;
        };

        ColorAccumulator.prototype.setSize = function (a_nNewWidth, a_nNewHeight) {
            var nSize = a_nNewWidth * a_nNewHeight;
            if (self.m_nNumberOfBytesAllocated < nSize)
            {
                this.m_pTable = new Uint8ClampedArray(nSize);
                this.m_nNumberOfBytesAllocated = nSize;
            }
            this.m_nNumberOfRows    = a_nNewHeight;
            this.m_nNumberOfColumns = a_nNewWidth;
            this.m_nMinRow          = a_nNewHeight - 1;
            this.m_nMaxRow          = 0;
            this.m_nMinColumn       = a_nNewWidth - 1;
            this.m_nMaxColumn       = 0;
        }

        ColorAccumulator.prototype.setColor = function (a_nNewColorR, a_nNewColorG, a_nNewColorB, a_nNewColorA) {
            this.m_nR = a_nNewColorR;
            this.m_nG = a_nNewColorG;
            this.m_nB = a_nNewColorB;
            this.m_nA = a_nNewColorA;
        }

        ColorAccumulator.prototype.getPixelPosition = function (a_nRow, a_nColumn) {
            return a_nRow * this.m_nNumberOfColumns + a_nColumn;
        }

        ColorAccumulator.prototype.getRightPixelPosition = function (a_nPosition) {
            return a_nPosition + 1;
        }

        ColorAccumulator.prototype.getDownPixelPosition = function (a_nPosition) {
            return a_nPosition + this.m_nNumberOfColumns;
        }

        ColorAccumulator.prototype.drawAddNoMnMx = function (a_nPosition, a_nColorPortion) {
            var nValue = this.m_pTable[a_nPosition] + a_nColorPortion;
            this.m_pTable[a_nPosition] = (nValue > this.m_nA ? this.m_nA : nValue);
            return a_nPosition + 1;
        }

        ColorAccumulator.prototype.drawAddBacktrackNoMnMx = function (a_nPosition, a_nColorPortion) {
            var nValue = this.m_pTable[a_nPosition] + a_nColorPortion;
            this.m_pTable[a_nPosition] = (nValue > this.m_nA ? this.m_nA : nValue);
            return a_nPosition - 1;
        }

        ColorAccumulator.prototype.drawFillLineNoMnMx = function (a_nPosition, a_nColorPortion, a_nCount) {
            var nNewPosition = a_nPosition + a_nCount;
            this.m_pTable.fill(a_nColorPortion, a_nPosition, nNewPosition);
            return hNewPosition;
        }

        ColorAccumulator.prototype.drawFillSolidLineNoMnMx = function (a_nPosition, a_nCount) {
            var nNewPosition = a_nPosition + a_nCount;
            this.m_pTable.fill(this.m_nA, a_nPosition, nNewPosition);
            return hNewPosition;
        }

        ColorAccumulator.prototype.considerMinX = function (a_nX) {
	        this.m_nMinColumn = this.m_nMinColumn < a_nX ? this.m_nMinColumn : (a_nX < 0 ? 0 : a_nX);
        }

        ColorAccumulator.prototype.considerMaxX = function (a_nX) {
	        this.m_nMaxColumn = this.m_nMaxColumn > a_nX ? this.m_nMaxColumn : (a_nX >= this.m_nNumberOfColumns ? this.m_nNumberOfColumns - 1 : a_nX);
        }

        ColorAccumulator.prototype.considerMinY = function (a_nY) {
	        this.m_nMinRow = this.m_nMinRow < a_nY ? this.m_nMinRow : (a_nY < 0 ? 0 : a_nY);
        }

        ColorAccumulator.prototype.considerMaxY = function (a_nY) {
	        this.m_nMaxRow = this.m_nMaxRow > a_nY ? this.m_nMaxRow : (a_nY >= this.m_nNumberOfRows ? this.m_nNumberOfRows - 1 : a_nY);
        }

        ColorAccumulator.prototype.flushToCanvas = function (a_Canvas) {
            var nR          = this.m_nR;
            var nG          = this.m_nG;
            var nB          = this.m_nB;
            var nTableY     = this.m_nMinRow * this.m_nNumberOfColumns + this.m_nMinColumn;
            var nCanvasPosXY, nCanvasPosY = a_Canvas.getPixelPosition(this.m_nMinRow, this.m_nMinColumn);

            var nRectRows    = this.m_nMaxRow - this.m_nMinRow + 1;
            var nRectColumns = this.m_nMaxColumn - this.m_nMinColumn + 1;
            var i, j;
            for (i = 0; i < nRectRows; i++)
            {
                nCanvasPosXY = nCanvasPosY;
                for (j = 0; j < nRectColumns; j++)
                    nCanvasPosXY = a_Canvas.addColor(nCanvasPosXY, nR, nG, nB, this.m_pTable[nTableY + j]);
                this.m_pTable.fill(0, nTableY, nTableY + nRectColumns);
                nTableY += this.m_nNumberOfColumns;
                nCanvasPosY = a_Canvas.belowPosition(nCanvasPosY);
            }

            this.m_nMinRow      = this.m_nNumberOfRows - 1;
            this.m_nMaxRow      = 0;
            this.m_nMinColumn   = this.m_nNumberOfColumns - 1;
            this.m_nMaxColumn   = 0;
        }

        return ColorAccumulator;
    })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = ColorAccumulator;
    else
        window.ColorAccumulator = ColorAccumulator;
})();
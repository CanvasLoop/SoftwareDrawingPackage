(function () {
    var Canvas = (function () {

        var Canvas = function () {
            if (!(this instanceof Canvas)) {
                return new Canvas();
            }
            this.initialize();
        };

        Canvas.prototype.initialize = function () {
            this.setSize(1);
        };

        Canvas.prototype.setSize = function (a_nNumberOfRows, a_nNumberOfColumns) {
            this.m_nNumberOfRows    = a_nNumberOfRows;
            this.m_nNumberOfColumns = a_nNumberOfColumns;
            this.m_pRGBATable = new Uint8ClampedArray(this.m_nNumberOfRows * this.m_nNumberOfColumns);
        }

        Canvas.prototype.getRowCount = function () {
	        return this.m_nNumberOfRows;
        }

        Canvas.prototype.getColumnCount = function () {
	        return this.m_nNumberOfColumns;
        }

        Canvas.prototype.getRBGAColor = function (a_nRowIndex, a_nColumnIndex) {
            var nPixel = this.getPixelPosition(a_nRowIndex, a_nColumnIndex);
            return [this.m_pRGBATable[nPixel], this.m_pRGBATable[nPixel + 1], this.m_pRGBATable[nPixel + 2], this.m_pRGBATable[nPixel + 3]];
        }

        Canvas.prototype.getRBGColor = function (a_nRowIndex, a_nColumnIndex) {
            var nPixel = this.getPixelPosition(a_nRowIndex, a_nColumnIndex);
            return [this.m_pRGBATable[nPixel], this.m_pRGBATable[nPixel + 1], this.m_pRGBATable[nPixel + 2]];
        }

        Canvas.prototype.getImageData = function () {
            return {}
        }

        Canvas.prototype.clear = function (a_nR, a_nG, a_nB, a_nA) {
	        var i, j;
            var nPixel = 0;
            for (i = 0; i < this.m_nNumberOfRows; i++)
            {
                for (j = 0; j < this.m_nNumberOfColumns; j++)
                {
                    this.m_pRGBATable[nPixel]       = a_nR;
                    this.m_pRGBATable[nPixel + 1]   = a_nG;
                    this.m_pRGBATable[nPixel + 2]   = a_nB;
                    this.m_pRGBATable[nPixel + 3]   = a_nA;
                    nPixel += 4;
                }
            }
        }

        Canvas.prototype.getPixelPosition = function (a_nRow, a_nColumn) {
	        return (a_nRow * this.m_nNumberOfColumns + a_nColumn) << 2;
        }

        Canvas.prototype.rightOfPosition = function (a_nPosition) {
	        return a_nPosition + 4;
        }

        Canvas.prototype.leftOfPosition = function (a_nPosition) {
            return a_nPosition - 4;
        }

        Canvas.prototype.abovePosition = function (a_nPosition) {
            return a_nPosition - (this.m_nNumberOfColumns << 2);
        }

        Canvas.prototype.belowPosition = function (a_nPosition) {
            return a_nPosition + (this.m_nNumberOfColumns << 2);
        }

        Canvas.prototype.getRBGAColorAt = function (a_nPosition) {
            return [this.m_pRGBATable[a_nPosition], this.m_pRGBATable[a_nPosition + 1], this.m_pRGBATable[a_nPosition + 2], this.m_pRGBATable[a_nPosition + 3]];
        }

        Canvas.prototype.getRBGColorAt = function (a_nPosition) {
            return [this.m_pRGBATable[a_nPosition], this.m_pRGBATable[a_nPosition + 1], this.m_pRGBATable[a_nPosition + 2]];
        }

        Canvas.prototype.addColor = function (a_nPosition, a_nR, a_nG, a_nB, a_nA) {
            if (a_nA > 0)
            {
                var nAlphaPart1Scaled = a_nA << 8;
                var nA0 = this.m_pRGBATable[a_nPosition + 3];
                var nAlphaPart2Scaled = (nA0 << 8) - nA0 * a_nA;
                var nAlphaSumScaled = nAlphaPart1Scaled + nAlphaPart2Scaled;
                this.m_pRGBATable[a_nPosition]      = (a_nR * nAlphaPart1Scaled + this.m_pRGBATable[a_nPosition    ] * nAlphaPart2Scaled) / nAlphaSumScaled;
                this.m_pRGBATable[a_nPosition + 1]  = (a_nG * nAlphaPart1Scaled + this.m_pRGBATable[a_nPosition + 1] * nAlphaPart2Scaled) / nAlphaSumScaled;
                this.m_pRGBATable[a_nPosition + 2]  = (a_nB * nAlphaPart1Scaled + this.m_pRGBATable[a_nPosition + 2] * nAlphaPart2Scaled) / nAlphaSumScaled;
                this.m_pRGBATable[a_nPosition + 3]  = nAlphaSumScaled >> 8;
            }
            return a_nPosition + 4;
        }       

        return Canvas;
    })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Canvas;
    else
        window.Canvas = Canvas;
})();
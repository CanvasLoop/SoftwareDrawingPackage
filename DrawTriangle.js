(function () {
    var BresenhamPath = (function () {

        var BresenhamPath = function (a_nTopX,
								     a_nTopY,
								     a_nBottomX,
								     a_nBottomY,
								     a_nMaxLeftCover) {
            if (!(this instanceof BresenhamPath)) {
                return new BresenhamPath(a_nTopX, a_nTopY, a_nBottomX, a_nBottomY, a_nMaxLeftCover);
            }
            var self = this;
            self.calculate(a_nTopX, a_nTopY, a_nBottomX, a_nBottomY, a_nMaxLeftCover);
        };

        BresenhamPath.prototype.BRESENHAM_SCALE = 256;
        BresenhamPath.prototype.BRESENHAM_SCALE_MINUS_ONE = 255;
        BresenhamPath.prototype.BRESENHAM_SCALE_TIMES_TWO = 512;
        BresenhamPath.prototype.BRESENHAM_SCALE_HALF = 128;
        BresenhamPath.prototype.BRESENHAM_SCALE_POWER = 8;

        BresenhamPath.prototype.calculate = function (a_nTopX,
								                     a_nTopY,
								                     a_nBottomX,
								                     a_nBottomY,
								                     a_nMaxLeftCover) {
            var self = this;
            self.m_Cells = [];

            var nTopXScaled = (BRESENHAM_SCALE * a_nTopX) | 0;
            var nTopYScaled = (BRESENHAM_SCALE * a_nTopY) | 0;
            var nBottomXScaled = (BRESENHAM_SCALE * a_nBottomX) | 0;
            var nBottomYScaled = (BRESENHAM_SCALE * a_nBottomY) | 0;
            var nWScaled = nBottomXScaled - nTopXScaled;
            var nHScaled = nBottomYScaled - nTopYScaled;

            var nOctant = (nWScaled <= 0 ?
                                (nHScaled <= -nWScaled ? 0 : 1) :
                                (nHScaled <= nWScaled ? 3 : 2));
            if (nOctant == 0) {
                var nDScaledMinusWTimesMaxLC =
                    a_nMaxLeftCover *
                    ((-nWScaled * (nTopYScaled & BRESENHAM_SCALE_MINUS_ONE)
                    + nHScaled * (nTopXScaled & BRESENHAM_SCALE_MINUS_ONE)
                        ) >> BRESENHAM_SCALE_POWER);
                var nNegWScaledTimesMaxLC = -a_nMaxLeftCover * nWScaled;
                var nHScaledTimesMaxLC = a_nMaxLeftCover * nHScaled;
                var nHMinusWScaled = nHScaled - nWScaled;

                var nX = nTopXScaled >> BRESENHAM_SCALE_POWER;
                var nY = nTopYScaled >> BRESENHAM_SCALE_POWER;
                var nX2 = nBottomXScaled >> BRESENHAM_SCALE_POWER;
                for (; nX >= nX2; nX--) {
                    self.m_Cells.push({
                        m_nX: nX,
                        m_nY: nY,
                        m_nLeftCover: nDScaledMinusWTimesMaxLC / nHMinusWScaled
                    });

                    if (nDScaledMinusWTimesMaxLC >= nNegWScaledTimesMaxLC) {
                        nY++;
                        nDScaledMinusWTimesMaxLC -= nNegWScaledTimesMaxLC; // neg

                        self.m_Cells.push({
                            m_nX: nX,
                            m_nY: nY,
                            m_nLeftCover: nDScaledMinusWTimesMaxLC / nHMinusWScaled
                        });
                    }
                    nDScaledMinusWTimesMaxLC += nHScaledTimesMaxLC;
                }

                /* DO NOT DELETE 
                int nX1 = a_nTopX;
                int nY1 = a_nTopY;
                int nX2 = a_nBottomX;
                int nY2 = a_nBottomY;
    
                double h = a_nBottomY - a_nTopY;
                double w = a_nBottomX - a_nTopX;
                double d = w * (1 - (a_nTopY - nY1)) + h * (a_nTopX - nX1);
    
                int nCount = 0;
                int nX = nX1;
                int nY = nY1;
                for (; nX >= nX2; nX--)
                {
                    a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                    a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                    double percentage = (d - w) / (-w + h);
                    a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = percentage * a_nMaxLeftCover;
                    nCount++;
    
                    if (d >= 0)
                    {
                        nY++;
                        d -= -w;
    
                        a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                        a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                        percentage = (d - w) / (-w + h);
                        a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = percentage * a_nMaxLeftCover;
                        nCount++;
                    }
                    d += h;
                }
                a_pBresenhamPath->m_nNumberOfCells = nCount;
                */
            }
            else if (nOctant == 1) {
                var nDScaledPlusWTimesMaxLC =
                    a_nMaxLeftCover *
                    ((nWScaled * (nTopYScaled & BRESENHAM_SCALE_MINUS_ONE)
                       - nHScaled * (nTopXScaled & BRESENHAM_SCALE_MINUS_ONE)
                     ) >> BRESENHAM_SCALE_POWER);
                var nWScaledTimesMaxLC = a_nMaxLeftCover * nWScaled;
                var nHScaledTimesMaxLC = a_nMaxLeftCover * nHScaled;
                var nWMinusHScaled = nWScaled - nHScaled;

                var nX = nTopXScaled >> BRESENHAM_SCALE_POWER;
                var nY = nTopYScaled >> BRESENHAM_SCALE_POWER;
                var nY2 = nBottomYScaled >> BRESENHAM_SCALE_POWER;
                for (; nY <= nY2; nY++) {
                    self.m_Cells.push({
                        m_nX: nX,
                        m_nY: nY,
                        m_nLeftCover: nDScaledPlusWTimesMaxLC / nWMinusHScaled
                    });

                    if (nDScaledPlusWTimesMaxLC >= nWScaledTimesMaxLC) {
                        nX--;
                        nDScaledPlusWTimesMaxLC -= nHScaledTimesMaxLC;

                        self.m_Cells.push({
                            m_nX: nX,
                            m_nY: nY,
                            m_nLeftCover: nDScaledPlusWTimesMaxLC / nWMinusHScaled
                        });
                    }
                    nDScaledPlusWTimesMaxLC -= nWScaledTimesMaxLC;
                }

                /*	DO NOT DELETE
                    int nX1 = a_nTopX;
                    int nY1 = a_nTopY;
                    int nX2 = a_nBottomX;
                    int nY2 = a_nBottomY;
    
                    double h = a_nBottomY - a_nTopY;
                    double w = a_nBottomX - a_nTopX;
                    double d = w * (a_nTopY - nY1 - 1) - h * (a_nTopX - nX1);
    
                    int nCount = 0;
                    int nX = nX1;
                    int nY = nY1;
                    for (; nY <= nY2; nY++)
                    {
                        a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                        a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                        double percentage = (d + h) / (-w + h);
                        a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = a_nMaxLeftCover - percentage * a_nMaxLeftCover;
                        nCount++;
    
                        if (d >= 0)
                        {
                            nX--;
                            d -= h;
    
                            a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                            a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                            percentage = (d + h) / (-w + h);
                            a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = a_nMaxLeftCover - percentage * a_nMaxLeftCover;
                            nCount++;
                        }
                        d += -w;
                    }
                    a_pBresenhamPath->m_nNumberOfCells = nCount;
                */
            }
            else if (nOctant == 2) {
                var nDScaledPlusHTimesMaxLC =
                    a_nMaxLeftCover *
                    ((nWScaled * (BRESENHAM_SCALE - (nTopYScaled & BRESENHAM_SCALE_MINUS_ONE))
                    - nHScaled * ((nTopXScaled & BRESENHAM_SCALE_MINUS_ONE) - BRESENHAM_SCALE)
                     ) >> BRESENHAM_SCALE_POWER);
                var nWScaledTimesMaxLC = a_nMaxLeftCover * nWScaled;
                var nHScaledTimesMaxLC = a_nMaxLeftCover * nHScaled;
                var nWPlusHScaled = nWScaled + nHScaled;

                var nCount = 0;
                var nX = nTopXScaled >> BRESENHAM_SCALE_POWER;
                var nY = nTopYScaled >> BRESENHAM_SCALE_POWER;
                var nY2 = nBottomYScaled >> BRESENHAM_SCALE_POWER;
                for (; nY <= nY2; nY++) {
                    self.m_Cells.push({
                        m_nX: nX,
                        m_nY: nY,
                        m_nLeftCover: nDScaledPlusHTimesMaxLC / nWPlusHScaled
                    });

                    if (nDScaledPlusHTimesMaxLC >= nHScaledTimesMaxLC) {
                        nX++;
                        nDScaledPlusHTimesMaxLC -= nHScaledTimesMaxLC;

                        self.m_Cells.push({
                            m_nX: nX,
                            m_nY: nY,
                            m_nLeftCover: nDScaledPlusHTimesMaxLC / nWPlusHScaled
                        });
                    }
                    nDScaledPlusHTimesMaxLC += nWScaledTimesMaxLC;
                }

                /*	DO NOT DELETE
                    int nX1 = a_nTopX;
                    int nY1 = a_nTopY;
                    int nX2 = a_nBottomX;
                    int nY2 = a_nBottomY;
    
                    double h = a_nBottomY - a_nTopY;
                    double w = a_nBottomX - a_nTopX;
                    double d = - h * (a_nTopX - nX1) + w * (1 - (a_nTopY - nY1));
    
                    int nCount = 0;
                    int nX = nX1;
                    int nY = nY1;
                    for (; nY <= nY2; nY++)
                    {
                        a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                        a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                        double percentage = (d + h) / (w + h);
                        a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = percentage * a_nMaxLeftCover;
                        nCount++;
    
                        if (d >= 0)
                        {
                            nX++;
                            d -= h;
    
                            a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                            a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                            percentage = (d + h) / (w + h);
                            a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = percentage * a_nMaxLeftCover;
                            nCount++;
                        }
                        d += w;
                    }
                    a_pBresenhamPath->m_nNumberOfCells = nCount;
                */
            }
            else // nOctant == 3
            {
                var nDScaledMinusHTimesMaxLC =
                    a_nMaxLeftCover *
                    ((-nWScaled * (BRESENHAM_SCALE - (nTopYScaled & BRESENHAM_SCALE_MINUS_ONE))
                        - nHScaled * (nTopXScaled & BRESENHAM_SCALE_MINUS_ONE)
                        ) >> BRESENHAM_SCALE_POWER);
                var nWScaledTimesMaxLC = a_nMaxLeftCover * nWScaled;
                var nNegHScaledTimesMaxLC = -a_nMaxLeftCover * nHScaled;
                var nMinusHMinusWScaled = -nHScaled - nWScaled;

                var nCount = 0;
                var nX = nTopXScaled >> BRESENHAM_SCALE_POWER;
                var nY = nTopYScaled >> BRESENHAM_SCALE_POWER;
                var nX2 = nBottomXScaled >> BRESENHAM_SCALE_POWER;
                for (; nX <= nX2; nX++) {
                    self.m_Cells.push({
                        m_nX: nX,
                        m_nY: nY,
                        m_nLeftCover: nDScaledMinusHTimesMaxLC / nMinusHMinusWScaled
                    });

                    if (nDScaledMinusHTimesMaxLC >= nNegHScaledTimesMaxLC) {
                        nY++;
                        nDScaledMinusHTimesMaxLC -= nWScaledTimesMaxLC;

                        self.m_Cells.push({
                            m_nX: nX,
                            m_nY: nY,
                            m_nLeftCover: nDScaledMinusHTimesMaxLC / nMinusHMinusWScaled
                        });
                    }
                    nDScaledMinusHTimesMaxLC -= nNegHScaledTimesMaxLC;
                }

                /* DO NOT DELETE
                int nX1 = a_nTopX;
                int nY1 = a_nTopY;
                int nX2 = a_nBottomX;
                int nY2 = a_nBottomY;
    
                double h = a_nBottomY - a_nTopY;
                double w = a_nBottomX - a_nTopX;
                double d = -w * (1 - (a_nTopY - nY1)) + h * (1 - (a_nTopX - nX1));
    
                int nCount = 0;
                int nX = nX1;
                int nY = nY1;
                for (; nX <= nX2; nX++)
                {
                    a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                    a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                    double percentage = (d + w) / (w + h);
                    a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = a_nMaxLeftCover - percentage * a_nMaxLeftCover;
                    nCount++;
    
                    if (d >= 0)
                    {
                        nY++;
                        d -= w;
    
                        a_pBresenhamPath->m_Cells[nCount].m_nX = nX;
                        a_pBresenhamPath->m_Cells[nCount].m_nY = nY;
                        percentage = (d + w) / (w + h);
                        a_pBresenhamPath->m_Cells[nCount].m_nLeftCover = a_nMaxLeftCover - percentage * a_nMaxLeftCover;
                        nCount++;
                    }
                    d += h;
                }
                a_pBresenhamPath->m_nNumberOfCells = nCount;
                */
            }
        };

        return BresenhamPath;
    })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = BresenhamPath;
    else
        window.BresenhamPath = BresenhamPath;
})();
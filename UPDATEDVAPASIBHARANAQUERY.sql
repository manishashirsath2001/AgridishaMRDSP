CREATE FUNCTION dbo.UDF_GetVyapariVapasiDetails
(
    @VPAID VARCHAR(24),
    @TRNDT DATE
)
RETURNS @Result TABLE
(
    SLAB_RANGE VARCHAR(50),
    BPAMT DECIMAL(18, 2),
    VAPASI_AMT DECIMAL(10, 2),
    TRNDT DATE
)
AS
BEGIN
    DECLARE @VSAID VARCHAR(24),
            @DUEDATE INT,
            @VSDAID VARCHAR(24),
            @STARTDATE INT,
            @ENDDATE INT;

    -- Temp tables in function (inline approach using table variables)
    DECLARE @TempSlabDetails TABLE (
        VSAID VARCHAR(24),
        DUEDATE INT,
        VSDAID VARCHAR(24),
        STARTDATE INT,
        ENDDATE INT
    );

    DECLARE @TempVyapriDueResult TABLE (
        ID INT IDENTITY(1,1) PRIMARY KEY,
        FDUEDT DATE,
        TRNDT DATE,
        TAMT DECIMAL(18, 2),
        BPAMT DECIMAL(18, 2),
        VAPASAT INT DEFAULT 0,
        DUEDATE INT,
        VSDAID VARCHAR(24),
        STARTDATE INT,
        ENDDATE INT,
        DAYS_DIFF INT,
        DUE_DAY INT,
        TO_DAY INT
    );

    DECLARE @TempVapasiDetails1 TABLE (
        VSDAID VARCHAR(24),
        DUE_DAY INT,
        TO_DAY INT,
        VAPASI INT
    );

    -- Step 1: Fill @TempSlabDetails
    INSERT INTO @TempSlabDetails (VSAID, DUEDATE, VSDAID, STARTDATE, ENDDATE)
    SELECT 
        D.VSAID, D.DUEDATE, D.VSDAID, D.STARTDATE, D.ENDDATE
    FROM tblVyapariMaster V
    LEFT JOIN tblVpapariSlabMaster M ON M.ISDELETED = 0 AND M.VSAID = V.VPSCHEME
    LEFT JOIN tblVyapariSlabDetail D ON D.ISDELETED = 0 AND D.VSAID = M.VSAID
    WHERE V.ISDELETED = 0 AND V.VPAID = @VPAID;

    -- Cursor simulation for slabs
    DECLARE slab_cursor CURSOR FOR
    SELECT VSAID, DUEDATE, VSDAID, STARTDATE, ENDDATE FROM @TempSlabDetails;

    OPEN slab_cursor;
    FETCH NEXT FROM slab_cursor INTO @VSAID, @DUEDATE, @VSDAID, @STARTDATE, @ENDDATE;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        ;WITH RankedData AS (
            SELECT 
                FDUEDT, TRNDT, TAMT, BPAMT,
                0 AS DummyZero,
                @DUEDATE AS DUEDATE,
                @VSDAID AS VSDAID,
                @STARTDATE AS STARTDATE,
                @ENDDATE AS ENDDATE,
                REFF,
                ROW_NUMBER() OVER (
                    PARTITION BY YEAR(TRNDT), MONTH(TRNDT)
                    ORDER BY SYSDT DESC
                ) AS RN
            FROM tblVyapriDue
            WHERE ISDELETED = 0
              AND VPAID = @VPAID
              AND DAY(TRNDT) BETWEEN @STARTDATE AND @ENDDATE
              AND REFF IS NOT NULL
              AND LTRIM(RTRIM(REFF)) <> ''
        )
        INSERT INTO @TempVyapriDueResult (
            FDUEDT, TRNDT, TAMT, BPAMT, VAPASAT, DUEDATE, VSDAID, STARTDATE, ENDDATE
        )
        SELECT FDUEDT, TRNDT, TAMT, BPAMT, DummyZero, DUEDATE, VSDAID, STARTDATE, ENDDATE
        FROM RankedData
        WHERE RN = 1;

        FETCH NEXT FROM slab_cursor INTO @VSAID, @DUEDATE, @VSDAID, @STARTDATE, @ENDDATE;
    END

    CLOSE slab_cursor;
    DEALLOCATE slab_cursor;

    -- Step 2: Vapasi Slabs
    INSERT INTO @TempVapasiDetails1 (VSDAID, DUE_DAY, TO_DAY, VAPASI)
    SELECT 
        V.VSDAID, V.DUE_DAY, V.TO_DAY, V.VAPASI
    FROM tblVyapariVapasiDetails V
    JOIN @TempSlabDetails S ON S.VSDAID = V.VSDAID
    WHERE V.ISDELETED = 0;

    -- Step 3: Apply Logic to fill VAPASAT and compute values
    DECLARE @ID INT,
            @FDUEDT DATE,
            @CUR_VSDAID VARCHAR(24),
            @VAPASAT INT,
            @DAYS_DIFF INT,
            @CUR_DUEDAY INT,
            @CUR_TODAY INT;

    DECLARE due_cursor CURSOR FOR
    SELECT ID, FDUEDT, VSDAID FROM @TempVyapriDueResult ORDER BY ID;

    OPEN due_cursor;
    FETCH NEXT FROM due_cursor INTO @ID, @FDUEDT, @CUR_VSDAID;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @DAYS_DIFF = DATEDIFF(DAY, @FDUEDT, @TRNDT);

        SELECT TOP 1
            @VAPASAT = VAPASI,
            @CUR_DUEDAY = DUE_DAY,
            @CUR_TODAY = TO_DAY
        FROM @TempVapasiDetails1
        WHERE VSDAID = @CUR_VSDAID
          AND (
            (@DAYS_DIFF < 0 AND DUE_DAY = TO_DAY)
            OR (DUE_DAY <> TO_DAY AND TO_DAY = 0 AND VAPASI = 0 AND @DAYS_DIFF > DUE_DAY)
            OR (@DAYS_DIFF BETWEEN DUE_DAY AND TO_DAY)
          );

        UPDATE @TempVyapriDueResult
        SET 
            VAPASAT = ISNULL(@VAPASAT, 0),
            DAYS_DIFF = @DAYS_DIFF,
            DUE_DAY = @CUR_DUEDAY,
            TO_DAY = @CUR_TODAY
        WHERE ID = @ID;

        FETCH NEXT FROM due_cursor INTO @ID, @FDUEDT, @CUR_VSDAID;
    END

    CLOSE due_cursor;
    DEALLOCATE due_cursor;

    -- Step 4: Return Final Result
    INSERT INTO @Result (SLAB_RANGE, BPAMT, VAPASI_AMT, TRNDT)
    SELECT 
        CAST(STARTDATE AS VARCHAR) + ' - ' + CAST(ENDDATE AS VARCHAR),
        COALESCE(BPAMT, 0),
        CAST(ROUND((COALESCE(BPAMT, 0) * COALESCE(VAPASAT, 0)) / 100.0, 2) AS DECIMAL(10,2)),
        COALESCE(TRNDT, '1900-01-01')
    FROM @TempVyapriDueResult
    ORDER BY TRNDT;

    RETURN;
END;

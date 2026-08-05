DECLARE 
    @DATE       VARCHAR(50) = '25 JUN 2025',
    @COMPANYID  VARCHAR(24) = 'COMP123456789',
    @BRANCHID   VARCHAR(24) = 'D001';

DECLARE 
    @RMSG NVARCHAR(MAX),
    @RVAL NVARCHAR(MAX),
    @ERRORCODE VARCHAR(10),
    @ISSUCCESS INT = 1;

DECLARE 
    @FYID VARCHAR(20),
    @PREVDATE DATE = DATEADD(DAY, -1, CAST(@DATE AS DATE)),
    @CLOSINGBAL MONEY;

-- Calculate FYID
IF MONTH(@PREVDATE) >= 4
    SET @FYID = CAST(YEAR(@PREVDATE) AS VARCHAR) + '-' + CAST(YEAR(@PREVDATE) + 1 AS VARCHAR);
ELSE
    SET @FYID = CAST(YEAR(@PREVDATE) - 1 AS VARCHAR) + '-' + CAST(YEAR(@PREVDATE) AS VARCHAR);

SELECT @CLOSINGBAL = ClosingBalance
FROM GET_DailyClosingBalance(@COMPANYID, @BRANCHID, @PREVDATE);

IF @CLOSINGBAL IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT	1 
        FROM	TBLDClosingBalance 
        WHERE	OrganizationID	= @COMPANYID 
          AND	DivisionID		= @BRANCHID 
          AND	DATE			= @PREVDATE
          AND	ISDELETED		= 0
    )
    BEGIN
        UPDATE TBLDClosingBalance
        SET ISDELETED			= 1
        WHERE OrganizationID	= @COMPANYID 
          AND DivisionID		= @BRANCHID 
          AND DATE				= @PREVDATE
          AND ISDELETED			= 0
    END

    -- Insert fresh record
    INSERT INTO TBLDClosingBalance (
        OrganizationID,
        DivisionID, 
        DATE, 
        FYID,
        AMOUNT, 
        ASID,
        ISDELETED, 
        SYSDT
    )
    VALUES (
        @COMPANYID,
        @BRANCHID,
        @PREVDATE, 
        @FYID, 
        @CLOSINGBAL, 
        '', 
        0, 
        GETDATE()
    );

    -- Success message
    SET @RMSG = N'अभिनंदन! दिवसाची समाप्ती यशस्वी झाली आहे.';
    SET @RVAL = 'DayEnd';
    SET @ERRORCODE = 'SUCCESS';
    SET @ISSUCCESS = 1;
END

SELECT 
    @ERRORCODE AS ResponseCode,
    @RMSG AS ResponseMessage,
    @RVAL AS ResponseValues,
    @ISSUCCESS AS IsSuccessful;

RETURN;
